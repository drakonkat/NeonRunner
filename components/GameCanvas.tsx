
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GameStatus, Lane, GameAction, PowerUpType, UpgradeLevels, GlitchType, Difficulty, SkillType } from '../types';
import { LANE_WIDTH, GRAVITY, JUMP_FORCE, LEVELS, COLORS, POWERUP_CONFIG, COIN_CONFIG, INFINITE_SCALING, ENEMY_CONFIG, DIFFICULTY_MODS, CHARACTERS } from '../constants';

interface GameCanvasProps {
  status: GameStatus;
  levelIndex: number; 
  upgradeLevels: UpgradeLevels;
  activeGlitches: GlitchType[];
  difficulty: Difficulty;
  selectedCharacterId: string;
  onScoreUpdate: (score: number, coins: number) => void;
  onCollision: () => void;
  onPowerUpChange: (type: PowerUpType, progress: number) => void;
  onSkillUpdate: (cooldownCurrent: number, cooldownMax: number) => void; // New prop
}

export interface GameCanvasHandle {
  performAction: (action: GameAction) => void;
  resetGame: () => void;
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(({ 
  status, 
  levelIndex,
  upgradeLevels, 
  activeGlitches,
  difficulty,
  selectedCharacterId,
  onScoreUpdate, 
  onCollision,
  onPowerUpChange,
  onSkillUpdate
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for Props
  const statusRef = useRef(status);
  const levelIndexRef = useRef(levelIndex);
  const upgradeLevelsRef = useRef(upgradeLevels);
  const activeGlitchesRef = useRef(activeGlitches);
  const difficultyRef = useRef(difficulty);
  const selectedCharacterIdRef = useRef(selectedCharacterId);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { levelIndexRef.current = levelIndex; }, [levelIndex]);
  useEffect(() => { upgradeLevelsRef.current = upgradeLevels; }, [upgradeLevels]);
  useEffect(() => { activeGlitchesRef.current = activeGlitches; }, [activeGlitches]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { selectedCharacterIdRef.current = selectedCharacterId; }, [selectedCharacterId]);

  // Game State Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const shieldMeshRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  
  const activeEffectsRef = useRef<THREE.Group[]>([]);
  const trailRef = useRef<THREE.Mesh[]>([]); 
  const impactShakeRef = useRef<number>(0);
  
  const obstaclesRef = useRef<THREE.Mesh[]>([]);
  const enemiesRef = useRef<THREE.Group[]>([]);
  const coinsRef = useRef<THREE.Group[]>([]);
  const powerUpsRef = useRef<THREE.Group[]>([]);
  const lastPowerUpZRef = useRef<number>(-999);
  
  // New Refs for Moving Platforms and Gaps
  const platformsRef = useRef<THREE.Mesh[]>([]);
  const gapsRef = useRef<{zStart: number, zEnd: number, mesh: THREE.Mesh}[]>([]);

  const frameIdRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const coinsCollectedRef = useRef<number>(0);
  const speedRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  
  // Player Physics
  const laneRef = useRef<Lane>(Lane.CENTER);
  const playerYRef = useRef<number>(0);
  const velocityYRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const isSlidingRef = useRef<boolean>(false);
  const slideTimerRef = useRef<number>(0);
  const targetXRef = useRef<number>(0);
  
  // Power Up State
  const activePowerUpRef = useRef<PowerUpType>(PowerUpType.NONE);
  const powerUpTimerRef = useRef<number>(0);
  const powerUpDurationRef = useRef<number>(0);

  // Skill State
  const skillCooldownRef = useRef<number>(0);
  const skillActiveTimeRef = useRef<number>(0);
  const activeSkillRef = useRef<SkillType | null>(null);

  // Internal Helper Functions (exposed via refs to break circular/scope dependency)
  const createExplosionRef = useRef<(pos: THREE.Vector3) => void>(() => {});
  const spawnCoinRef = useRef<(zPos: number) => void>(() => {});

  // Function to update player mesh based on character
  const updatePlayerMesh = (scene: THREE.Scene) => {
      if (playerRef.current) {
          scene.remove(playerRef.current);
      }

      const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
      
      let playerGeo;
      if (charConfig.shape === 'SPHERE') {
          playerGeo = new THREE.SphereGeometry(0.6, 16, 16);
      } else if (charConfig.shape === 'TETRA') {
          playerGeo = new THREE.TetrahedronGeometry(0.7);
      } else {
          playerGeo = new THREE.BoxGeometry(1, 1, 1);
      }

      const playerMat = new THREE.MeshStandardMaterial({ 
        color: charConfig.color, 
        emissive: charConfig.emissive, 
        emissiveIntensity: 0.5
      });
      
      const player = new THREE.Mesh(playerGeo, playerMat);
      player.castShadow = true;
      
      if (charConfig.shape === 'TETRA') {
          player.rotation.x = -Math.PI / 4;
          player.rotation.y = Math.PI / 4;
      }

      scene.add(player);
      playerRef.current = player;

      const shieldGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const shieldMat = new THREE.MeshBasicMaterial({ 
        color: COLORS.POWERUPS[PowerUpType.SHIELD], transparent: true, opacity: 0.3, wireframe: true
      });
      const shield = new THREE.Mesh(shieldGeo, shieldMat);
      shield.visible = false;
      player.add(shield);
      shieldMeshRef.current = shield;
  };

  const activateSkill = () => {
      if (skillCooldownRef.current > 0) return;
      
      const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
      const skill = charConfig.skillId;
      
      activeSkillRef.current = skill;
      skillCooldownRef.current = charConfig.skillCooldown;
      skillActiveTimeRef.current = charConfig.skillDuration || 0;

      // Immediate Effects
      if (skill === 'BLAST') {
          // Destroy obstacles in front (Beam blast)
          const playerZ = 0; 
          
          // Create visual beam
          const beamGeo = new THREE.CylinderGeometry(0.5, 2, 40, 8, 1, true);
          const beamMat = new THREE.MeshBasicMaterial({ color: charConfig.emissive, transparent: true, opacity: 0.8 });
          const beam = new THREE.Mesh(beamGeo, beamMat);
          beam.rotation.x = -Math.PI / 2;
          beam.position.set(playerRef.current?.position.x || 0, 0.5, -20);
          sceneRef.current?.add(beam);
          
          // Animate beam removal
          setTimeout(() => sceneRef.current?.remove(beam), 300);

          // Destroy logic
          const laneX = (playerRef.current?.position.x || 0);
          const laneTolerance = 1.5;
          
          const destroyList = (list: THREE.Object3D[]) => {
              for (let i = list.length - 1; i >= 0; i--) {
                  const obj = list[i];
                  if (obj.position.z < 5 && obj.position.z > -50 && Math.abs(obj.position.x - laneX) < laneTolerance) {
                      createExplosionRef.current(obj.position);
                      sceneRef.current?.remove(obj);
                      list.splice(i, 1);
                  }
              }
          };
          destroyList(obstaclesRef.current);
          destroyList(enemiesRef.current);
      } else if (skill === 'ALCHEMY') {
          // Convert obstacles to coins
          const radius = 30;
          for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
              const obj = obstaclesRef.current[i];
              if (obj.position.z < 10 && obj.position.z > -radius) {
                   createExplosionRef.current(obj.position);
                   spawnCoinRef.current(obj.position.z);
                   sceneRef.current?.remove(obj);
                   obstaclesRef.current.splice(i, 1);
              }
          }
      }
  };

  useImperativeHandle(ref, () => ({
    performAction: (action: GameAction) => {
      if (statusRef.current !== GameStatus.PLAYING) return;

      const glitches = activeGlitchesRef.current;
      const hasMoonGravity = glitches.includes('MOON_GRAVITY');
      const hasHeavyMetal = glitches.includes('HEAVY_METAL');
      const isAustralia = glitches.includes('AUSTRALIA_MODE');

      if (action === 'SKILL') {
          activateSkill();
          return;
      }

      let jumpMod = 1.0;
      if (hasMoonGravity) jumpMod = 0.6;
      if (hasHeavyMetal) jumpMod = 1.2; 

      let effectiveAction = action;
      if (isAustralia && (action === 'LEFT' || action === 'RIGHT')) {
          effectiveAction = action === 'LEFT' ? 'RIGHT' : 'LEFT';
      }

      if (effectiveAction === 'LEFT') {
        if (laneRef.current === Lane.RIGHT) laneRef.current = Lane.CENTER;
        else if (laneRef.current === Lane.CENTER) laneRef.current = Lane.LEFT;
      } else if (effectiveAction === 'RIGHT') {
        if (laneRef.current === Lane.LEFT) laneRef.current = Lane.CENTER;
        else if (laneRef.current === Lane.CENTER) laneRef.current = Lane.RIGHT;
      } else if (action === 'JUMP') {
        if (!isJumpingRef.current && !isSlidingRef.current) {
          velocityYRef.current = JUMP_FORCE * jumpMod;
          isJumpingRef.current = true;
        }
      } else if (action === 'SLIDE') {
        if (!isSlidingRef.current && !isJumpingRef.current) {
          isSlidingRef.current = true;
          slideTimerRef.current = 0.8; 
        } else if (isJumpingRef.current) {
          velocityYRef.current = -0.5;
        }
      }
      
      targetXRef.current = laneRef.current * LANE_WIDTH;
    },
    resetGame: () => {
      scoreRef.current = 0;
      coinsCollectedRef.current = 0;
      laneRef.current = Lane.CENTER;
      targetXRef.current = 0;
      playerYRef.current = 0;
      velocityYRef.current = 0;
      isJumpingRef.current = false;
      isSlidingRef.current = false;
      slideTimerRef.current = 0;
      timeRef.current = 0;
      lastPowerUpZRef.current = -999;
      
      activePowerUpRef.current = PowerUpType.NONE;
      powerUpTimerRef.current = 0;
      impactShakeRef.current = 0;
      
      skillCooldownRef.current = 0;
      skillActiveTimeRef.current = 0;
      activeSkillRef.current = null;

      const removeAll = (list: THREE.Object3D[]) => list.forEach(o => sceneRef.current?.remove(o));
      
      removeAll(obstaclesRef.current); obstaclesRef.current = [];
      removeAll(enemiesRef.current); enemiesRef.current = [];
      removeAll(coinsRef.current); coinsRef.current = [];
      removeAll(powerUpsRef.current); powerUpsRef.current = [];
      removeAll(activeEffectsRef.current); activeEffectsRef.current = [];
      removeAll(trailRef.current); trailRef.current = [];
      removeAll(platformsRef.current); platformsRef.current = [];
      
      gapsRef.current.forEach(g => sceneRef.current?.remove(g.mesh));
      gapsRef.current = [];

      if (playerRef.current) {
        playerRef.current.visible = true;
        playerRef.current.position.set(0, 0, 0);
        playerRef.current.rotation.set(0, 0, 0);
        const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
        if (charConfig.shape === 'TETRA') {
            playerRef.current.rotation.x = -Math.PI / 4;
            playerRef.current.rotation.y = Math.PI / 4;
        }
        playerRef.current.scale.set(1, 1, 1);
      }
      if (cameraRef.current) {
        cameraRef.current.fov = 60;
        cameraRef.current.updateProjectionMatrix();
        cameraRef.current.rotation.set(0, 0, 0);
        cameraRef.current.position.set(0, 3, 6);
        cameraRef.current.lookAt(0, 0, -5);
      }
      if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
    }
  }));

  useEffect(() => {
      if (sceneRef.current) {
          updatePlayerMesh(sceneRef.current);
      }
  }, [selectedCharacterId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const initialConfig = LEVELS[0];
    scene.background = new THREE.Color(initialConfig.color);
    scene.fog = new THREE.Fog(initialConfig.color, 10, 50);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 6);
    camera.lookAt(0, 0, -5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const gridHelper = new THREE.GridHelper(200, 80, 0xffffff, 0x444444);
    gridHelper.position.y = -0.5;
    gridHelper.position.z = -50; 
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50; 
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.1, color: 0xffffff, transparent: true, opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);
    particlesRef.current = particles;

    const planeGeo = new THREE.PlaneGeometry(200, 400);
    const planeMat = new THREE.MeshStandardMaterial({ color: initialConfig.groundColor, roughness: 0.8 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.6;
    plane.position.z = -50;
    scene.add(plane);

    updatePlayerMesh(scene);

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    const isOccupied = (lane: number, zPos: number) => {
      // Check Standard Obstacles
      const stdCheck = obstaclesRef.current.some(obj => 
          Math.abs(obj.position.z - zPos) < 2 && 
          Math.abs(obj.position.x - (lane * LANE_WIDTH)) < 0.5
      );
      if (stdCheck) return true;
      
      // Check Gaps (If we are in a gap, we can't spawn normal stuff unless it's a platform)
      const gapCheck = gapsRef.current.some(gap => zPos >= gap.zStart && zPos <= gap.zEnd);
      return gapCheck;
    };

    const spawnPlatformSequence = (zStart: number) => {
        const gapLength = 20;
        
        // 1. Create Gap Visual
        const gapGeo = new THREE.PlaneGeometry(LANE_WIDTH * 5, gapLength);
        const gapMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const gapMesh = new THREE.Mesh(gapGeo, gapMat);
        gapMesh.rotation.x = -Math.PI / 2;
        gapMesh.position.set(0, -0.45, zStart + gapLength / 2); // Slightly above ground to cover it
        scene.add(gapMesh);
        
        gapsRef.current.push({
            zStart: zStart,
            zEnd: zStart + gapLength,
            mesh: gapMesh
        });

        // 2. Spawn Moving Platforms
        // We spawn 3 platforms
        const platformCount = 3;
        const spacing = gapLength / (platformCount + 1);
        
        for (let i = 1; i <= platformCount; i++) {
            const zPos = zStart + (i * spacing);
            const isHoriz = Math.random() > 0.5;
            
            const pGeo = new THREE.BoxGeometry(2.0, 0.2, 2.0);
            const pMat = new THREE.MeshStandardMaterial({ 
                color: 0x00ffcc, 
                emissive: 0x004433, 
                metalness: 0.8, 
                roughness: 0.2 
            });
            const platform = new THREE.Mesh(pGeo, pMat);
            
            platform.position.set(0, 0, zPos); // Start at 0 height
            platform.castShadow = true;
            
            platform.userData = {
                type: 'PLATFORM',
                moveType: isHoriz ? 'HORIZ' : 'VERT',
                speed: 2 + Math.random() * 2,
                offset: Math.random() * Math.PI * 2,
                baseY: 0,
                amp: isHoriz ? 3.5 : 1.0 
            };
            
            scene.add(platform);
            platformsRef.current.push(platform);
        }
    };

    const spawnObstacle = (zPos: number) => {
      const lanes = [Lane.LEFT, Lane.CENTER, Lane.RIGHT];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      
      if (isOccupied(lane, zPos)) return;

      const rand = Math.random();
      // 10% chance for Moving Platform Gap (if difficulty is high enough or randomly)
      if (rand < 0.10) {
          spawnPlatformSequence(zPos);
          return;
      }

      let type: 'WALL' | 'HURDLE' | 'BEAM' | 'RAMP' = 'WALL';

      if (rand < 0.25) type = 'HURDLE';
      else if (rand < 0.45) type = 'BEAM';
      else if (rand < 0.55) type = 'RAMP';
      else type = 'WALL';

      let geo, mat, yPos, scaleY;
      let rotationZ = 0;
      
      if (type === 'HURDLE') {
        geo = new THREE.BoxGeometry(1.5, 0.4, 0.4);
        mat = new THREE.MeshStandardMaterial({ color: COLORS.OBSTACLE_LOW, roughness: 0.2, emissive: COLORS.OBSTACLE_LOW, emissiveIntensity: 0.5 });
        yPos = -0.3; 
        scaleY = 0.4;
      } else if (type === 'BEAM') {
        geo = new THREE.BoxGeometry(2.0, 0.4, 0.4);
        mat = new THREE.MeshStandardMaterial({ color: COLORS.OBSTACLE_FLYING, roughness: 0.2, emissive: COLORS.OBSTACLE_FLYING, emissiveIntensity: 0.5 });
        yPos = 0.65;
        scaleY = 0.4;
      } else if (type === 'RAMP') {
        geo = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 3);
        mat = new THREE.MeshStandardMaterial({ 
            color: 0xFF4500, 
            roughness: 0.1, 
            emissive: 0xFF4500, 
            emissiveIntensity: 0.3,
            flatShading: true
        });
        yPos = -0.25; 
        scaleY = 0.6;
        rotationZ = Math.PI / 2;
      } else {
        geo = new THREE.BoxGeometry(1, 1, 1);
        mat = new THREE.MeshStandardMaterial({ color: COLORS.OBSTACLE, roughness: 0.2 });
        yPos = 0;
        scaleY = 1;
      }

      const obs = new THREE.Mesh(geo, mat);
      obs.position.set(lane * LANE_WIDTH, yPos, zPos);
      if (type === 'RAMP') {
          obs.rotation.z = rotationZ;
          obs.rotation.y = Math.PI / 2;
      }

      obs.castShadow = true;
      obs.userData = { 
        type: 'OBSTACLE', 
        subType: type,
        height: scaleY,
        yPos: yPos
      };
      scene.add(obs);
      obstaclesRef.current.push(obs);
    };

    const spawnEnemy = (zPos: number) => {
      const lanes = [Lane.LEFT, Lane.CENTER, Lane.RIGHT];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      if (isOccupied(lane, zPos)) return;
      const group = new THREE.Group();
      const geo = new THREE.TetrahedronGeometry(0.6);
      const mat = new THREE.MeshStandardMaterial({ 
          color: COLORS.ENEMY, emissive: COLORS.ENEMY, emissiveIntensity: 0.8, roughness: 0.4
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.rotation.x = -Math.PI / 4;
      mesh.rotation.z = Math.PI / 8;
      group.add(mesh);
      group.position.set(lane * LANE_WIDTH, 0.5, zPos);
      group.userData = { type: 'ENEMY', timeOffset: Math.random() * 100 };
      scene.add(group);
      enemiesRef.current.push(group);
    };

    const spawnCoin = (zPos: number) => {
      const lanes = [Lane.LEFT, Lane.CENTER, Lane.RIGHT];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      if (isOccupied(lane, zPos)) return;
      for (let i = 0; i < 3; i++) {
        const group = new THREE.Group();
        const geo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        const mat = new THREE.MeshStandardMaterial({ 
          color: COLORS.COIN, emissive: COLORS.COIN, emissiveIntensity: 0.6, metalness: 0.8 
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.rotation.z = Math.PI / 2;
        group.add(mesh);
        group.position.set(lane * LANE_WIDTH, 0.5, zPos - (i * 1.2)); 
        group.userData = { type: 'COIN' };
        scene.add(group);
        coinsRef.current.push(group);
      }
    };
    spawnCoinRef.current = spawnCoin;

    const spawnPowerUp = (zPos: number) => {
      // Anti-spam: prevent powerups from spawning too close to each other
      if (Math.abs(zPos - lastPowerUpZRef.current) < 100) return;
      
      const types = [PowerUpType.SHIELD, PowerUpType.MULTIPLIER, PowerUpType.SPEED];
      const type = types[Math.floor(Math.random() * types.length)];
      
      // Smart lane selection: try to find a free lane instead of just picking one randomly
      const allLanes = [Lane.LEFT, Lane.CENTER, Lane.RIGHT];
      const shuffledLanes = allLanes.sort(() => Math.random() - 0.5);
      
      let chosenLane = null;
      for (const lane of shuffledLanes) {
          if (!isOccupied(lane, zPos)) {
              chosenLane = lane;
              break;
          }
      }
      
      if (chosenLane === null) return; // All lanes blocked

      const group = new THREE.Group();
      let geo;
      if (type === PowerUpType.SHIELD) geo = new THREE.IcosahedronGeometry(0.4);
      else if (type === PowerUpType.MULTIPLIER) geo = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
      else geo = new THREE.OctahedronGeometry(0.4);
      const mat = new THREE.MeshStandardMaterial({ 
        color: COLORS.POWERUPS[type], emissive: COLORS.POWERUPS[type], emissiveIntensity: 0.8
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      group.position.set(chosenLane * LANE_WIDTH, 0.5, zPos);
      group.userData = { type: 'POWERUP', powerUpType: type };
      scene.add(group);
      powerUpsRef.current.push(group);
      
      lastPowerUpZRef.current = zPos;
    };

    const createTrail = (pos: THREE.Vector3, rot: THREE.Euler, scale: THREE.Vector3) => {
        if (!sceneRef.current) return;
        const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
        let geo;
        if (charConfig.shape === 'SPHERE') geo = new THREE.SphereGeometry(0.2, 8, 8);
        else if (charConfig.shape === 'TETRA') geo = new THREE.TetrahedronGeometry(0.25);
        else geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);

        const mat = new THREE.MeshBasicMaterial({ 
            color: charConfig.color, 
            transparent: true, 
            opacity: 0.4,
            wireframe: activeGlitchesRef.current.includes('WIRE_FRAME')
        });
        
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        mesh.rotation.copy(rot);
        mesh.scale.copy(scale).multiplyScalar(0.5); 

        mesh.userData = { life: 1.0 };
        sceneRef.current.add(mesh);
        trailRef.current.push(mesh);
    };

    const createExplosion = (pos: THREE.Vector3) => {
        const group = new THREE.Group();
        const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
        const particleCount = 20;
        for(let i=0; i<particleCount; i++) {
            const size = 0.15 + Math.random() * 0.2;
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshBasicMaterial({ color: charConfig.color });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.position.x += (Math.random() - 0.5) * 0.5;
            mesh.position.y += (Math.random() - 0.5) * 0.5;
            mesh.position.z += (Math.random() - 0.5) * 0.5;
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.8, Math.random() * 0.8 + 0.2, (Math.random() - 0.5) * 0.5 + 0.5
            );
            mesh.userData.rotSpeed = new THREE.Vector3(
                Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5
            );
            group.add(mesh);
        }
        group.userData = { type: 'EXPLOSION', life: 1.0 };
        sceneRef.current?.add(group);
        activeEffectsRef.current.push(group);
    };
    createExplosionRef.current = createExplosion;

    const createCoinSparkle = (pos: THREE.Vector3) => {
      const group = new THREE.Group();
      for(let i=0; i<10; i++) {
          const size = 0.1 + Math.random() * 0.1;
          const geo = new THREE.BoxGeometry(size, size, size);
          const mat = new THREE.MeshBasicMaterial({ color: COLORS.COIN, transparent: true, opacity: 1 });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.copy(pos);
          mesh.position.x += (Math.random() - 0.5) * 0.3;
          mesh.position.y += (Math.random() - 0.5) * 0.3;
          mesh.userData.velocity = new THREE.Vector3(
              (Math.random() - 0.5) * 0.4, Math.random() * 0.6 + 0.2, (Math.random() - 0.5) * 0.4
          );
          mesh.userData.rotSpeed = new THREE.Vector3(Math.random(), Math.random(), Math.random());
          group.add(mesh);
      }
      group.userData = { type: 'SPARKLE', life: 1.0 }; 
      scene.add(group);
      activeEffectsRef.current.push(group);
    };

    const createLandingDust = (pos: THREE.Vector3) => {
        const group = new THREE.Group();
        for(let i=0; i<8; i++) {
            const size = 0.1 + Math.random() * 0.15;
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.position.y = 0.05; 
            mesh.position.x += (Math.random() - 0.5) * 0.6;
            mesh.position.z += (Math.random() - 0.5) * 0.6;
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2, Math.random() * 0.1, (Math.random() - 0.5) * 0.2
            );
            mesh.userData.rotSpeed = new THREE.Vector3(Math.random(), Math.random(), Math.random());
            group.add(mesh);
        }
        group.userData = { type: 'DUST', life: 0.6 }; 
        scene.add(group);
        activeEffectsRef.current.push(group);
    };

    let lastTime = performance.now();
    let spawnTimer = 0;
    let fogColorTimer = 0;
    let shakeTimer = 0;
    let lastTrailTime = 0;

    const loop = (time: number) => {
      const deltaTimeRaw = Math.min(time - lastTime, 100); // Cap at 100ms to prevent huge jumps on tab switch
      lastTime = time;
      
      let timeScale = 1.0;
      if (activeSkillRef.current === 'SLOW_MO' && skillActiveTimeRef.current > 0) {
          timeScale = 0.5;
      }

      const effectiveDelta = (statusRef.current === GameStatus.PLAYING) ? deltaTimeRaw * timeScale : 0;
      
      // Delta Time Factor relative to 60FPS (16.67ms)
      // If 144hz (approx 7ms), dtFactor is ~0.42 -> Physics moves less per frame, same per second.
      // If 30hz (approx 33ms), dtFactor is ~2.0 -> Physics moves more per frame, same per second.
      const dtFactor = effectiveDelta / 16.67;

      const isPlaying = statusRef.current === GameStatus.PLAYING;
      const isLevelComplete = statusRef.current === GameStatus.LEVEL_COMPLETE;
      const glitches = activeGlitchesRef.current;
      const difficultyConfig = DIFFICULTY_MODS[difficultyRef.current];

      // Update Skill Timers
      if (isPlaying) {
          if (skillActiveTimeRef.current > 0) {
              skillActiveTimeRef.current -= (deltaTimeRaw / 1000); // Real time decrement
          } else {
              // Disable effects when time runs out
              if (activeSkillRef.current === 'DASH' || activeSkillRef.current === 'CLONE') {
                  if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
              }
          }
          
          if (skillCooldownRef.current > 0) {
              skillCooldownRef.current -= (deltaTimeRaw / 1000);
          }
          
          const charConfig = CHARACTERS.find(c => c.id === selectedCharacterIdRef.current) || CHARACTERS[0];
          onSkillUpdate(Math.max(0, skillCooldownRef.current), charConfig.skillCooldown);

          // Skill Visuals
          if ((activeSkillRef.current === 'CLONE' || activeSkillRef.current === 'DASH') && skillActiveTimeRef.current > 0) {
               if (shieldMeshRef.current) {
                   shieldMeshRef.current.visible = true;
                   shieldMeshRef.current.scale.setScalar(1.2 + Math.sin(time * 0.01) * 0.1);
                   (shieldMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x00ff00); // Green for skill
               }
          } else if (activePowerUpRef.current === PowerUpType.SHIELD) {
               if (shieldMeshRef.current) {
                   shieldMeshRef.current.visible = true;
                   (shieldMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(parseInt(COLORS.POWERUPS[PowerUpType.SHIELD].replace('#','0x'))); 
               }
          } else {
              if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
          }
      }

      // --- RENDER LOGIC ---
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
          if (glitches.includes('PIXEL_HELL')) {
              rendererRef.current.setPixelRatio(0.2);
          } else {
              rendererRef.current.setPixelRatio(window.devicePixelRatio);
          }
          const isWireframe = glitches.includes('WIRE_FRAME');
          sceneRef.current.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                  if (child.material) {
                       if (!(child.geometry instanceof THREE.BufferGeometry && !child.geometry.index)) { 
                           if (Array.isArray(child.material)) {
                               child.material.forEach(m => m.wireframe = isWireframe);
                           } else {
                               child.material.wireframe = isWireframe;
                           }
                       }
                  }
              }
          });
          const isAustralia = glitches.includes('AUSTRALIA_MODE');
          let baseRotZ = isAustralia ? Math.PI : 0;
          let offsetX = 0;
          let offsetY = 3; 
          let offsetZ = baseRotZ;

          if (glitches.includes('EARTHQUAKE') && isPlaying) {
              shakeTimer += effectiveDelta;
              offsetX += (Math.random() - 0.5) * 1.5;
              offsetZ += (Math.random() - 0.5) * 0.2;
          }

          if (impactShakeRef.current > 0.01) {
            const shake = impactShakeRef.current;
            offsetX += (Math.random() - 0.5) * shake;
            offsetY += (Math.random() - 0.5) * shake * 0.5;
            offsetZ += (Math.random() - 0.5) * shake * 0.1;
            impactShakeRef.current -= effectiveDelta * 0.002; 
          } else {
            impactShakeRef.current = 0;
          }

          if (glitches.includes('DRUNK_CAM') && isPlaying) {
             offsetZ += Math.sin(time * 0.002) * 0.2;
             offsetX += Math.sin(time * 0.001) * 2;
          }

          cameraRef.current.rotation.z = offsetZ;
          cameraRef.current.position.x = offsetX;
          cameraRef.current.position.y = offsetY;

          const targetFov = glitches.includes('WIDE_LENS') ? 110 : 60;
          cameraRef.current.fov += (targetFov - cameraRef.current.fov) * 0.05 * dtFactor;
          cameraRef.current.updateProjectionMatrix();

          if (glitches.includes('DISCO')) {
            fogColorTimer += deltaTimeRaw * 0.005;
            const r = Math.sin(fogColorTimer) * 0.5 + 0.5;
            const g = Math.sin(fogColorTimer + 2) * 0.5 + 0.5;
            const b = Math.sin(fogColorTimer + 4) * 0.5 + 0.5;
            sceneRef.current.background = new THREE.Color(r, g, b);
            if (sceneRef.current.fog) sceneRef.current.fog.color.setRGB(r, g, b);
          } else {
             const visualIndex = levelIndexRef.current % LEVELS.length;
             const color = new THREE.Color(LEVELS[visualIndex].color);
             sceneRef.current.background = color;
             if (sceneRef.current.fog) sceneRef.current.fog.color = color;
          }
          if (containerRef.current) {
              if (glitches.includes('INVERTED_COLORS')) {
                  containerRef.current.style.filter = 'invert(1) hue-rotate(180deg)';
              } else {
                  containerRef.current.style.filter = 'none';
              }
          }
      }

      const currentLvlIndex = levelIndexRef.current;
      const visualIndex = currentLvlIndex % LEVELS.length;
      const baseConfig = LEVELS[visualIndex];
      
      let currentSpeed = baseConfig.speed * difficultyConfig.speed;
      let currentDensity = baseConfig.obstacleDensity * difficultyConfig.density;

      if (glitches.includes('SPEED_DEMON')) currentSpeed *= 1.2;
      if (isLevelComplete) currentSpeed *= 3.0;

      if (activeSkillRef.current === 'DASH' && skillActiveTimeRef.current > 0) {
          currentSpeed *= 2.0;
      }

      if (currentLvlIndex >= LEVELS.length) {
        const extraLevels = currentLvlIndex - LEVELS.length + 1;
        currentSpeed = (LEVELS[LEVELS.length-1].speed + (extraLevels * INFINITE_SCALING.SPEED_INCREMENT)) * difficultyConfig.speed;
        currentDensity = Math.min(INFINITE_SCALING.DENSITY_CAP, (LEVELS[LEVELS.length-1].obstacleDensity + (extraLevels * INFINITE_SCALING.DENSITY_INCREMENT)) * difficultyConfig.density);
      }
      
      // Note: We do not apply timeScale directly to currentSpeed here because currentSpeed is "Units per frame".
      // We apply timeScale to the DELTA, which produces dtFactor.
      // So we just need to multiply currentSpeed by dtFactor later.

      // Effects Update
       if (sceneRef.current) {
        for (let i = activeEffectsRef.current.length - 1; i >= 0; i--) {
            const group = activeEffectsRef.current[i];
            const isExplosion = group.userData.type === 'EXPLOSION';
            let remove = false;

            if (!isExplosion) {
                group.userData.life -= 0.03 * dtFactor; // Norm
                if (group.userData.life <= 0) remove = true;
            }

            let allExplosionParticlesDead = true;

            group.children.forEach((child) => {
                const mesh = child as THREE.Mesh;
                const vel = mesh.userData.velocity as THREE.Vector3;
                // Normalize physics
                mesh.position.add(vel.clone().multiplyScalar(dtFactor)); 
                mesh.rotation.x += mesh.userData.rotSpeed.x * dtFactor;
                mesh.rotation.y += mesh.userData.rotSpeed.y * dtFactor;

                if (isExplosion) {
                    vel.y -= 0.02 * dtFactor; // Norm gravity
                    mesh.scale.multiplyScalar(0.96); // Scalar dampening
                    if (mesh.scale.x > 0.01) allExplosionParticlesDead = false;
                } else {
                    vel.y -= 0.01 * dtFactor;
                    if (mesh.material instanceof THREE.Material) mesh.material.opacity = group.userData.life;
                    mesh.scale.setScalar(group.userData.life);
                }
            });

            if (isExplosion && allExplosionParticlesDead) remove = true;

            if (remove) {
                sceneRef.current?.remove(group);
                activeEffectsRef.current.splice(i, 1);
            }
        }
        
        if (isPlaying && playerRef.current) {
            if (timeRef.current - lastTrailTime > 0.08) { 
                createTrail(playerRef.current.position, playerRef.current.rotation, playerRef.current.scale);
                lastTrailTime = timeRef.current;
            }
        }

        for (let i = trailRef.current.length - 1; i >= 0; i--) {
            const t = trailRef.current[i];
            t.position.z += currentSpeed * dtFactor; // Norm
            t.userData.life -= 0.04 * dtFactor; // Norm
            
            if (t.userData.life <= 0) {
                sceneRef.current?.remove(t);
                trailRef.current.splice(i, 1);
            } else {
                const s = t.userData.life;
                t.scale.setScalar(s * (glitches.includes('GIANT') ? 1.5 : 0.5)); 
                (t.material as THREE.MeshBasicMaterial).opacity = s * 0.4;
            }
        }

        // --- UPDATE MOVING PLATFORMS ---
        for (let i = platformsRef.current.length - 1; i >= 0; i--) {
            const p = platformsRef.current[i];
            p.position.z += currentSpeed * dtFactor; // Norm forward movement
            
            // The sine wave uses REAL TIME, so we don't use dtFactor here, we use timeRef which accumulates delta
            const t = timeRef.current * p.userData.speed + p.userData.offset;
            if (p.userData.moveType === 'HORIZ') {
                p.position.x = Math.sin(t) * p.userData.amp;
            } else {
                p.position.y = p.userData.baseY + Math.sin(t) * 0.8; 
            }

            if (p.position.z > 10) {
                sceneRef.current?.remove(p);
                platformsRef.current.splice(i, 1);
            }
        }
        
        // Remove Gaps
        for (let i = gapsRef.current.length - 1; i >= 0; i--) {
             const g = gapsRef.current[i];
             g.mesh.position.z += currentSpeed * dtFactor; // Norm
             g.zStart += currentSpeed * dtFactor;
             g.zEnd += currentSpeed * dtFactor;
             
             if (g.zStart > 20) { 
                 sceneRef.current?.remove(g.mesh);
                 gapsRef.current.splice(i, 1);
             }
        }
      }

      const handleHit = () => {
        if (!playerRef.current || !playerRef.current.visible) return false; 
        
        // Skill Invincibility (Dash or Clone)
        if ((activeSkillRef.current === 'DASH' || activeSkillRef.current === 'CLONE') && skillActiveTimeRef.current > 0) {
             // If clone, remove time (consumes the shield)
             if (activeSkillRef.current === 'CLONE') {
                 skillActiveTimeRef.current = 0; 
                 if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
             }
             return true; // Protected
        }

        if (activePowerUpRef.current === PowerUpType.SHIELD || activePowerUpRef.current === PowerUpType.SPEED) {
          if (activePowerUpRef.current === PowerUpType.SHIELD) {
            activePowerUpRef.current = PowerUpType.NONE;
            if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
          }
          return true; 
        } else {
          createExplosion(playerRef.current.position.clone());
          playerRef.current.visible = false;
          onCollision();
          return false;
        }
      };

      if (isPlaying && playerRef.current) {
        const player = playerRef.current;
        timeRef.current += effectiveDelta * 0.001;
        if (activePowerUpRef.current === PowerUpType.SPEED) {
          currentSpeed *= POWERUP_CONFIG.SPEED_BOOST_MULTIPLIER;
        }
        speedRef.current = currentSpeed; // Just for ref, doesn't affect physics directly

        let targetScale = 1;
        if (glitches.includes('GIANT')) targetScale = 2.5;
        if (glitches.includes('TINY')) targetScale = 0.4;
        
        const currentScaleBase = isSlidingRef.current ? 0.5 : 1.0;
        player.scale.x += (targetScale - player.scale.x) * 0.1 * dtFactor;
        player.scale.z += (targetScale - player.scale.z) * 0.1 * dtFactor;
        player.scale.y += ((targetScale * currentScaleBase) - player.scale.y) * 0.1 * dtFactor;

        // Update Grid/Particles
        if (gridRef.current) {
          gridRef.current.position.z += currentSpeed * dtFactor;
          if (gridRef.current.position.z > -50 + 2.5) gridRef.current.position.z = -50;
        }
        if (particlesRef.current) {
           const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
           for(let i = 0; i < positions.length; i += 3) {
             positions[i+2] += currentSpeed * 2 * dtFactor;
             if (positions[i+2] > 10) {
               positions[i+2] = -60;
               positions[i] = (Math.random() - 0.5) * 50;
               positions[i+1] = (Math.random() - 0.5) * 20;
             }
           }
           particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (isPlaying) {
            let scoreMultiplier = 1;
            if (activePowerUpRef.current === PowerUpType.MULTIPLIER) scoreMultiplier = 2;
            if (activePowerUpRef.current === PowerUpType.SPEED) scoreMultiplier = 2;
            if (glitches.includes('SPEED_DEMON')) scoreMultiplier *= 2;
            if (glitches.includes('AUSTRALIA_MODE')) scoreMultiplier *= 1.5; 
            if (glitches.includes('WIRE_FRAME')) scoreMultiplier *= 1.2; 
            
            // Score is based on distance traveled basically, so usage of currentSpeed * dtFactor maintains consistency
            scoreRef.current += (currentSpeed * scoreMultiplier * difficultyConfig.score * dtFactor);
            onScoreUpdate(Math.floor(scoreRef.current), coinsCollectedRef.current);
        }

        // Update PowerUp Timer
        if (activePowerUpRef.current !== PowerUpType.NONE) {
          powerUpTimerRef.current -= effectiveDelta; // Time based, correct
          const progress = Math.max(0, (powerUpTimerRef.current / powerUpDurationRef.current) * 100);
          onPowerUpChange(activePowerUpRef.current, progress);
          if (powerUpTimerRef.current <= 0) {
            activePowerUpRef.current = PowerUpType.NONE;
            onPowerUpChange(PowerUpType.NONE, 0);
            if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
          }
        }

        // Horizontal Movement (LERP needs time correction)
        // Standardizing Lerp: val += (target - val) * factor * dtFactor
        player.position.x += (targetXRef.current - player.position.x) * 0.2 * dtFactor;
        player.rotation.z = (player.position.x - targetXRef.current) * -0.1;

        // Slide logic
        if (isSlidingRef.current) {
          slideTimerRef.current -= effectiveDelta * 0.001; // Time based, correct
          if (slideTimerRef.current <= 0) {
            isSlidingRef.current = false;
          }
        }

        // --- PHYSICS ---
        let terrainHeight = 0; 
        const playerBoxMin = new THREE.Vector2(player.position.x - 0.3, player.position.z - 0.3);
        const playerBoxMax = new THREE.Vector2(player.position.x + 0.3, player.position.z + 0.3);
        
        let onPlatform = false;
        for (const plat of platformsRef.current) {
            const pMinX = plat.position.x - 1.0;
            const pMaxX = plat.position.x + 1.0;
            const pMinZ = plat.position.z - 1.0;
            const pMaxZ = plat.position.z + 1.0;
            
            if (playerBoxMax.x > pMinX && playerBoxMin.x < pMaxX &&
                playerBoxMax.y > pMinZ && playerBoxMin.y < pMaxZ) {
                
                const pTop = plat.position.y + 0.1; 
                if (player.position.y >= pTop - 0.2) {
                     terrainHeight = Math.max(terrainHeight, pTop);
                     onPlatform = true;
                }
            }
        }
        
        if (!onPlatform) {
            for (const gap of gapsRef.current) {
                if (player.position.z >= gap.mesh.position.z - 10 && player.position.z <= gap.mesh.position.z + 10) {
                    terrainHeight = -999;
                    break;
                }
            }
        }

        // Vertical Physics
        let gravityMod = 1.0;
        if (glitches.includes('MOON_GRAVITY')) gravityMod = 0.4;
        if (glitches.includes('HEAVY_METAL')) gravityMod = 2.0;

        // Apply dtFactor to gravity/velocity integration
        velocityYRef.current += GRAVITY * gravityMod * dtFactor; 
        player.position.y += velocityYRef.current * dtFactor; 

        if (player.position.y <= terrainHeight && velocityYRef.current <= 0) {
            if (terrainHeight > -100) {
                if (velocityYRef.current < -0.1) {
                    createLandingDust(player.position);
                    impactShakeRef.current = 0.2;
                }
                player.position.y = terrainHeight;
                velocityYRef.current = 0;
                isJumpingRef.current = false;
            }
        }

        if (player.position.y < -2.5) {
             handleHit(); 
        }

        playerYRef.current = player.position.y;

        if (isPlaying) {
            spawnTimer += currentSpeed * dtFactor; // Norm
            if (spawnTimer > 11) {
            spawnTimer = 0;
            const spawnZ = -50;
            if (Math.random() < currentDensity) {
                if (Math.random() < ENEMY_CONFIG.SPAWN_RATIO) spawnEnemy(spawnZ);
                else spawnObstacle(spawnZ);
            } else if (Math.random() < COIN_CONFIG.SPAWN_CHANCE) {
                spawnCoin(spawnZ);
            } else if (Math.random() < POWERUP_CONFIG.SPAWN_CHANCE) {
                spawnPowerUp(spawnZ);
            }
            }
        }

        // Collision Logic
        const scaleFactor = glitches.includes('GIANT') ? 2.5 : (glitches.includes('TINY') ? 0.4 : 1.0);
        const pHeight = (isSlidingRef.current && !isJumpingRef.current ? 0.5 : 1.0) * scaleFactor;
        const pWidth = 0.8 * scaleFactor;
        const pCenter = player.position;
        const pTop = pCenter.y + pHeight;

        const updateAndCheckCollision = (list: THREE.Object3D[], type: 'OBSTACLE' | 'ENEMY' | 'COIN' | 'POWERUP') => {
             for (let i = list.length - 1; i >= 0; i--) {
                const obj = list[i];
                obj.position.z += currentSpeed * dtFactor; // Norm
                if (type === 'ENEMY') obj.position.z += ENEMY_CONFIG.SPEED_OFFSET * dtFactor; // Norm
                
                if (type === 'ENEMY') {
                    const enemy = obj as THREE.Group;
                    const wobble = Math.sin(timeRef.current * ENEMY_CONFIG.WOBBLE_SPEED + enemy.userData.timeOffset) * ENEMY_CONFIG.WOBBLE_AMP;
                    enemy.rotation.z += 0.1 * dtFactor;
                    enemy.position.y = 0.5 + Math.abs(wobble * 0.5);
                } else if (type === 'COIN' || type === 'POWERUP') {
                    obj.rotation.y += 0.1 * dtFactor;
                }

                if (isPlaying) {
                    const dx = Math.abs(obj.position.x - pCenter.x);
                    const dz = Math.abs(obj.position.z - pCenter.z);
                    
                    if (type === 'OBSTACLE') {
                        const obs = obj as THREE.Mesh;
                        const oHeight = obs.userData.height || 1;
                        const oY = obs.userData.yPos || 0;
                        const obsBottom = oY - (oHeight/2);
                        const obsTop = oY + (oHeight/2);
                        
                        const pFeet = pCenter.y;
                        const pHead = pCenter.y + pHeight;
                        
                        const yOverlap = (pFeet < obsTop - 0.1) && (pHead > obsBottom + 0.1);

                        if (dx < (0.5 + pWidth/2) && dz < 0.8 && yOverlap) {
                            if (handleHit()) {
                                sceneRef.current?.remove(obj);
                                list.splice(i, 1);
                            }
                        }
                    } else if (type === 'ENEMY') {
                        // Enemy collision
                        const yOverlap = (pCenter.y < 1.0) && (pTop > 0.2);
                        if (dx < (0.5 + pWidth/2) && dz < 0.8 && yOverlap) {
                             if (handleHit()) {
                                sceneRef.current?.remove(obj);
                                list.splice(i, 1);
                            }
                        }
                    } else if (type === 'COIN') {
                        let collectionRadius = scaleFactor > 1 ? 1.5 : 0.8;
                        if (activeSkillRef.current === 'MAGNET' && skillActiveTimeRef.current > 0) {
                            collectionRadius = 5.0; // Magnet Power
                            // Pull visual effect
                             if (dx < 5.0 && dz < 10.0) {
                                 obj.position.x += (player.position.x - obj.position.x) * 0.2 * dtFactor;
                                 obj.position.z += (player.position.z - obj.position.z) * 0.2 * dtFactor;
                             }
                        }

                         if (dx < collectionRadius && dz < collectionRadius && Math.abs(pCenter.y - 0.5) < 2.0) {
                            const diffConfig = DIFFICULTY_MODS[difficultyRef.current];
                            coinsCollectedRef.current += Math.floor(10 * diffConfig.coinMultiplier);
                            scoreRef.current += COIN_CONFIG.POINTS;
                            createCoinSparkle(obj.position.clone());
                            sceneRef.current?.remove(obj);
                            list.splice(i, 1);
                         }
                    } else if (type === 'POWERUP') {
                         if (dx < 0.8 && dz < 0.8 && Math.abs(pCenter.y - 0.5) < 0.8) {
                             const pType = obj.userData.powerUpType as PowerUpType;
                             activePowerUpRef.current = pType;
                             const level = upgradeLevelsRef.current[pType] || 0;
                             powerUpDurationRef.current = POWERUP_CONFIG.BASE_DURATION + (level * POWERUP_CONFIG.DURATION_PER_LEVEL);
                             powerUpTimerRef.current = powerUpDurationRef.current;

                             if (pType === PowerUpType.SHIELD) {
                                if (shieldMeshRef.current) shieldMeshRef.current.visible = true;
                             } else {
                                if (shieldMeshRef.current) shieldMeshRef.current.visible = false;
                             }
                             sceneRef.current?.remove(obj);
                             list.splice(i, 1);
                         }
                    }
                }
                
                if (obj.position.z > 5) {
                    sceneRef.current?.remove(obj);
                    list.splice(i, 1);
                }
             }
        };

        updateAndCheckCollision(obstaclesRef.current, 'OBSTACLE');
        updateAndCheckCollision(enemiesRef.current, 'ENEMY');
        updateAndCheckCollision(coinsRef.current, 'COIN');
        updateAndCheckCollision(powerUpsRef.current, 'POWERUP');
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      if (containerRef.current && rendererRef.current.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
});

export default GameCanvas;
