'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildAuthenticAnvilGeometries, buildAuthenticHammerGeometries } from './createAnvilAndHammer';
import { buildAnvilAndCubeFragments } from './createAnvilAndCubeFragments';

gsap.registerPlugin(ScrollTrigger);

interface Scene02ImpactProps {
  onSelectProject?: () => void;
}

/**
 * DEVFORGE — SCENE 02 → SCENE 03: UNIFIED CINEMATIC TRANSITION
 * Anvil Fragmentation → Knowledge Cube Formation
 *
 * Sequence:
 * 1. Scene 02 Forge: Anvil forms, hammer poises, swings, strikes with authentic physical force.
 * 2. Phase A (Impact & Fracture): Anvil cracks along 26 geometric shear planes. "Meet DevForge." fades.
 * 3. Phase B & C (Disassembly & Fall): Fragments separate and travel downward into Scene 03.
 * 4. Scene 03 Stage 1 (Broken): 26 fragments suspended in 3D space around center. "Start here." at top.
 * 5. Scene 03 Stage 2 (Descent): Headline descends toward middle. Major pieces begin moving.
 * 6. Scene 03 Stage 3 (Major Pieces Connect): 18 core structural blocks form the cube foundation.
 * 7. Scene 03 Stage 4 (Smaller Pieces Complete): Remaining 8 corner blocks snap into the 3x3x3 grid.
 * 8. Scene 03 Stage 5 (Complete Monolith): Full modular cube matching reference image on reflective floor.
 *    "Start here. Become a builder." and supporting copy settle firmly.
 */
export const Scene02Impact: React.FC<Scene02ImpactProps> = ({ onSelectProject }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // Scene 02: Forge Text Overlay Refs
  const scene02TitleBoxRef = useRef<HTMLDivElement>(null);
  const brandGlowRef = useRef<HTMLDivElement>(null);
  const wordMeetRef = useRef<HTMLSpanElement>(null);
  const wordDevForgeRef = useRef<HTMLSpanElement>(null);
  const scene02SublineRef = useRef<HTMLParagraphElement>(null);

  // Scene 03: Cube Assembly Overlay Refs
  const scene03StageRef = useRef<HTMLDivElement>(null);
  const scene03HeadlineBoxRef = useRef<HTMLDivElement>(null);
  const headlineSecondLineRef = useRef<HTMLSpanElement>(null);
  const scene03SublineRef = useRef<HTMLParagraphElement>(null);
  const leftRailRef = useRef<HTMLDivElement>(null);
  const bottomTrackerRef = useRef<HTMLDivElement>(null);

  // Bottom tracker stage step indicators
  const step01Ref = useRef<HTMLSpanElement>(null);
  const step02Ref = useRef<HTMLSpanElement>(null);
  const step03Ref = useRef<HTMLSpanElement>(null);
  const step04Ref = useRef<HTMLSpanElement>(null);
  const step05Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = sectionRef.current;
    const container = canvasMountRef.current;
    if (!stage || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // =========================================================================
    // 1. Three.js Scene & Dual-Perspective Cinematic Camera
    // =========================================================================
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(24, width / height, 0.1, 50);
    // Starts at side-on view of the anvil
    camera.position.set(0.10, 0.60, 9.2);
    camera.lookAt(0.10, 0.60, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. Cinematic Lighting Rig (Side Key + Warm Amber Cube Rim from Reference)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x11151e, 1.2);
    scene.add(ambientLight);

    // Scene 02 Forge Key Light
    const forgeKeyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    forgeKeyLight.position.set(-3.2, 5.5, 4.2);
    forgeKeyLight.castShadow = true;
    scene.add(forgeKeyLight);

    // Cool Rim Light
    const coolRimLight = new THREE.DirectionalLight(0xdce7f5, 3.5);
    coolRimLight.position.set(4.0, 4.5, -3.5);
    scene.add(coolRimLight);

    // Warm Amber/Bronze Rim Kicker (From Reference Image: lights left/rear facet edges)
    const warmRimLight = new THREE.DirectionalLight(0xd97706, 0); // Fades in for Scene 03
    warmRimLight.position.set(-4.5, -1.5, -2.5);
    scene.add(warmRimLight);

    const travelingLight = new THREE.PointLight(0xffffff, 0, 5.5);
    travelingLight.position.set(-0.45, 0.95, 0.5);
    scene.add(travelingLight);

    // =========================================================================
    // 3. Grounded Studio Reflector Floor
    // =========================================================================
    const floorGeo = new THREE.CircleGeometry(5.5, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090d,
      roughness: 0.35,
      metalness: 0.85,
      transparent: true,
      opacity: 0,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0.5, -0.75, 0);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Contact ambient shadow under cube/anvil
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.set(0, -0.74, 0);
    scene.add(contactShadow);

    // =========================================================================
    // 4A. Authentic Solid London Anvil (100% Solid until Impact Strike)
    // =========================================================================
    const ANVIL_X = 1.0;
    const ANVIL_Y = -0.15;
    const solidGeos = buildAuthenticAnvilGeometries();
    const solidAnvilGroup = new THREE.Group();
    solidAnvilGroup.position.set(ANVIL_X, ANVIL_Y, 0);
    solidAnvilGroup.visible = true; // SOLID UNTIL IMPACT!
    scene.add(solidAnvilGroup);

    const solidFaceMat = new THREE.MeshStandardMaterial({
      color: 0x6e7b8f,
      roughness: 0.22,
      metalness: 0.88,
      transparent: true,
      opacity: 0,
    });
    const solidBodyMat = new THREE.MeshStandardMaterial({
      color: 0x2e3542,
      roughness: 0.40,
      metalness: 0.78,
      transparent: true,
      opacity: 0,
    });

    const solidFaceMesh = new THREE.Mesh(solidGeos.facePlate, solidFaceMat);
    solidFaceMesh.castShadow = true;
    solidFaceMesh.receiveShadow = true;
    solidAnvilGroup.add(solidFaceMesh);

    const solidBodyMesh = new THREE.Mesh(solidGeos.body, solidBodyMat);
    solidBodyMesh.castShadow = true;
    solidBodyMesh.receiveShadow = true;
    solidAnvilGroup.add(solidBodyMesh);

    // =========================================================================
    // 4B. Anvil-to-Cube 26 Fragment System (Hidden until hammer strike)
    // =========================================================================
    const { fragments, cubeGroup, anvilFragmentsGroup, faceMat, bodyMat } =
      buildAnvilAndCubeFragments(ANVIL_X, ANVIL_Y);

    scene.add(anvilFragmentsGroup);
    scene.add(cubeGroup);

    // Precalculate world targets for each cube block in Scene 03
    const cubeWorldTargets = fragments.map((frag) => {
      const posWorld = frag.cubePos.clone().applyEuler(cubeGroup.rotation).add(cubeGroup.position);
      return {
        pos: posWorld,
        rot: cubeGroup.rotation.clone(),
      };
    });

    // World targets for intact anvil (including anvilFragmentsGroup offset)
    const anvilWorldTargets = fragments.map((frag) => {
      const posWorld = frag.anvilPos.clone().add(anvilFragmentsGroup.position);
      return {
        pos: posWorld,
        scale: frag.anvilScale.clone(),
      };
    });

    // =========================================================================
    // 5. Authentic Sledge Hammer
    // =========================================================================
    const hammerGeos = buildAuthenticHammerGeometries();
    const hammerPivot = new THREE.Group();
    hammerPivot.position.set(ANVIL_X - 1.85, ANVIL_Y + 1.125, 0);
    hammerPivot.rotation.z = 0.58;
    scene.add(hammerPivot);

    const hammerHeadMat = new THREE.MeshStandardMaterial({
      color: 0x363d4a,
      roughness: 0.30,
      metalness: 0.75,
      transparent: true,
      opacity: 0,
    });
    const hammerStrikeFaceMat = new THREE.MeshStandardMaterial({
      color: 0x768599,
      roughness: 0.16,
      metalness: 0.92,
      transparent: true,
      opacity: 0,
    });
    const hammerWoodMat = new THREE.MeshStandardMaterial({
      color: 0x9e7350,
      roughness: 0.52,
      metalness: 0.10,
      transparent: true,
      opacity: 0,
    });

    const hammerHeadMesh = new THREE.Mesh(hammerGeos.head, hammerHeadMat);
    hammerHeadMesh.castShadow = true;
    hammerPivot.add(hammerHeadMesh);

    const hammerStrikeMesh = new THREE.Mesh(hammerGeos.strikeFace, hammerStrikeFaceMat);
    hammerStrikeMesh.castShadow = true;
    hammerPivot.add(hammerStrikeMesh);

    const hammerHandleMesh = new THREE.Mesh(hammerGeos.handle, hammerWoodMat);
    hammerHandleMesh.castShadow = true;
    hammerPivot.add(hammerHandleMesh);

    // =========================================================================
    // 6. Impact Effects (Flash Line, Ring Burst, Ember Sparks)
    // =========================================================================
    const flashGroup = new THREE.Group();
    flashGroup.position.set(ANVIL_X, ANVIL_Y + 0.855, 0);
    flashGroup.visible = false;
    scene.add(flashGroup);

    const flashLineGeo = new THREE.PlaneGeometry(1.6, 0.06);
    flashLineGeo.rotateX(-Math.PI / 2);
    const flashLineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const flashLine = new THREE.Mesh(flashLineGeo, flashLineMat);
    flashGroup.add(flashLine);

    const burstGeo = new THREE.RingGeometry(0.02, 1.4, 32);
    burstGeo.rotateX(-Math.PI / 2);
    const burstMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const burstMesh = new THREE.Mesh(burstGeo, burstMat);
    flashGroup.add(burstMesh);

    const sparkCount = 24;
    const sparkBasePos = new Float32Array(sparkCount * 3);
    const sparkCurrentPos = new Float32Array(sparkCount * 3);
    const sparkVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkBasePos[i * 3] = ANVIL_X + (Math.random() - 0.5) * 0.35;
      sparkBasePos[i * 3 + 1] = ANVIL_Y + 0.855;
      sparkBasePos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      sparkCurrentPos[i * 3] = sparkBasePos[i * 3];
      sparkCurrentPos[i * 3 + 1] = sparkBasePos[i * 3 + 1];
      sparkCurrentPos[i * 3 + 2] = sparkBasePos[i * 3 + 2];

      const angle = (Math.random() - 0.5) * Math.PI * 1.3;
      const speed = 2.0 + Math.random() * 2.8;
      sparkVelocities.push({
        x: Math.sin(angle) * speed,
        y: 0.8 + Math.random() * 2.2,
        z: (Math.random() - 0.5) * speed * 0.7,
      });
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkCurrentPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xfff2e0,
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    sparkPoints.visible = false;
    scene.add(sparkPoints);

    // =========================================================================
    // 7. Dynamic Kinematics & Natural Magnetic Assembly Engine
    // =========================================================================
    const trans = {
      fracture: 0,          // 0 -> 1: Initial shock fracture along shear vectors
      scatter: 0,           // 0 -> 1: Fragments travel into Scene 03 suspended cloud
      assembleProgress: 0,  // 0 -> 1: Master magnetic convergence with per-fragment arc & delay
      cubeRotationY: 0,     // Subtle ambient rotation of the assembled monolith
      camX: 0.10,
      camY: 0.60,
      camZ: 9.2,
      lookX: 0.10,
      lookY: 0.60,
      sparkProgress: 0,
    };

    let animationFrameId: number;
    const render = () => {
      // 1. Camera interpolation
      camera.position.set(trans.camX, trans.camY, trans.camZ);
      camera.lookAt(trans.lookX, trans.lookY, 0);

      // 2. Spark particles
      if (sparkPoints.visible && trans.sparkProgress > 0 && trans.sparkProgress < 1) {
        const pArr = sparkGeo.attributes.position.array as Float32Array;
        const t = trans.sparkProgress;
        for (let i = 0; i < sparkCount; i++) {
          const v = sparkVelocities[i];
          pArr[i * 3] = sparkBasePos[i * 3] + v.x * t;
          pArr[i * 3 + 1] = sparkBasePos[i * 3 + 1] + v.y * t - 5.0 * t * t;
          pArr[i * 3 + 2] = sparkBasePos[i * 3 + 2] + v.z * t;
        }
        sparkGeo.attributes.position.needsUpdate = true;
      }

      // 3. Dynamic position & rotation of all 26 fragments
      if (anvilFragmentsGroup.visible) {
        fragments.forEach((frag, i) => {
          const mesh = frag.mesh;
          const anvilW = anvilWorldTargets[i];
          const cubeW = cubeWorldTargets[i];

          if (trans.scatter < 1.0) {
            // Stage A & B: Fracturing and tumbling into Scene 03 suspended scatter cloud
            const fx = anvilW.pos.x + frag.fractureDir.x * trans.fracture * 0.50;
            const fy = anvilW.pos.y + frag.fractureDir.y * trans.fracture * 0.50 - trans.fracture * 0.14;
            const fz = anvilW.pos.z + frag.fractureDir.z * trans.fracture * 0.50;

            const px = THREE.MathUtils.lerp(fx, frag.scatterPos.x, trans.scatter);
            const py = THREE.MathUtils.lerp(fy, frag.scatterPos.y, trans.scatter);
            const pz = THREE.MathUtils.lerp(fz, frag.scatterPos.z, trans.scatter);
            mesh.position.set(px, py, pz);

            mesh.rotation.set(
              THREE.MathUtils.lerp(frag.fractureDir.y * 0.35, frag.scatterRot.x, trans.scatter),
              THREE.MathUtils.lerp(frag.fractureDir.x * 0.35, frag.scatterRot.y, trans.scatter),
              THREE.MathUtils.lerp(frag.fractureDir.z * 0.35, frag.scatterRot.z, trans.scatter)
            );
            mesh.scale.set(1.0, 1.0, 1.0);
          } else {
            // Stage C: NATURAL MAGNETIC ASSEMBLY INTO MONOLITHIC CUBE
            // Each block has an individual progress value based on its distance-to-center delay
            const pRaw = (trans.assembleProgress - frag.delay) / (1.0 - frag.delay);
            const pClamped = Math.max(0, Math.min(1, pRaw));

            // Smooth cubic smoothstep interpolation
            const pSmooth = pClamped * pClamped * (3 - 2 * pClamped);

            // Target world position with ambient cube rotation
            const rotYOffset = trans.cubeRotationY;
            const targetRot = new THREE.Euler(
              cubeW.rot.x,
              cubeW.rot.y + rotYOffset,
              cubeW.rot.z
            );
            const targetPos = cubeW.pos.clone();
            targetPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotYOffset);

            // Curved orbital flight trajectory (parabolic arc perpendicular to travel)
            const arcWeight = Math.sin(Math.PI * pSmooth);
            const arcVec = frag.arcOffset.clone().multiplyScalar(arcWeight);

            // Subtle tactile settle damping when snapping into position (pClamped > 0.92)
            let settleOffset = 0;
            if (pClamped > 0.92 && pClamped < 1.0) {
              const tSettle = (pClamped - 0.92) / 0.08;
              settleOffset = Math.sin(tSettle * Math.PI * 2) * 0.014 * (1 - tSettle);
            }

            const px = THREE.MathUtils.lerp(frag.scatterPos.x, targetPos.x, pSmooth) + arcVec.x;
            const py = THREE.MathUtils.lerp(frag.scatterPos.y, targetPos.y, pSmooth) + arcVec.y + settleOffset;
            const pz = THREE.MathUtils.lerp(frag.scatterPos.z, targetPos.z, pSmooth) + arcVec.z;

            mesh.position.set(px, py, pz);

            // Rotation smoothly aligns and locks
            mesh.rotation.set(
              THREE.MathUtils.lerp(frag.scatterRot.x, targetRot.x, pSmooth),
              THREE.MathUtils.lerp(frag.scatterRot.y, targetRot.y, pSmooth),
              THREE.MathUtils.lerp(frag.scatterRot.z, targetRot.z, pSmooth)
            );
            mesh.scale.set(1.0, 1.0, 1.0);
          }
        });
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // =========================================================================
    // 8. MASTER GSAP SCROLLTRIGGER PINNED TIMELINE (Scene 02 → Scene 03)
    // 3800px scrubbed distance for smooth, responsive cinematic progression.
    // =========================================================================
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Initial States: Absolute Void & Zero Artifacts
      gsap.set(stage, { backgroundColor: '#050608' });
      gsap.set(floorMat, { opacity: 0 });
      gsap.set(contactShadow.material, { opacity: 0 });
      gsap.set(solidFaceMat, { opacity: 0 });
      gsap.set(solidBodyMat, { opacity: 0 });
      gsap.set(faceMat, { opacity: 1 });
      gsap.set(bodyMat, { opacity: 1 });
      gsap.set(solidAnvilGroup, { visible: true });
      gsap.set(anvilFragmentsGroup, { visible: false });
      gsap.set(hammerHeadMat, { opacity: 0 });
      gsap.set(hammerStrikeFaceMat, { opacity: 0 });
      gsap.set(hammerWoodMat, { opacity: 0 });

      // Scene 02 Text Initial States
      if (scene02TitleBoxRef.current) gsap.set(scene02TitleBoxRef.current, { opacity: 1, x: 0 });
      if (brandGlowRef.current) gsap.set(brandGlowRef.current, { opacity: 0, scale: 0.85 });
      if (wordMeetRef.current) {
        gsap.set(wordMeetRef.current, {
          opacity: 0,
          y: 28,
          scale: 0.94,
          letterSpacing: '0.08em',
          filter: 'blur(10px) brightness(1.7)',
        });
      }
      if (wordDevForgeRef.current) {
        gsap.set(wordDevForgeRef.current, {
          opacity: 0,
          y: 38,
          scale: 0.92,
          letterSpacing: '0.10em',
          filter: 'blur(14px) brightness(2.0)',
        });
      }
      if (scene02SublineRef.current) gsap.set(scene02SublineRef.current, { opacity: 0, y: 14 });

      // Scene 03 Overlay Initial States
      if (scene03StageRef.current) gsap.set(scene03StageRef.current, { opacity: 0 });
      if (scene03HeadlineBoxRef.current) {
        gsap.set(scene03HeadlineBoxRef.current, { opacity: 0, y: -40 });
      }
      if (headlineSecondLineRef.current) gsap.set(headlineSecondLineRef.current, { opacity: 0, y: 16 });
      if (scene03SublineRef.current) gsap.set(scene03SublineRef.current, { opacity: 0, y: 14 });
      if (leftRailRef.current) gsap.set(leftRailRef.current, { opacity: 0, x: -20 });
      if (bottomTrackerRef.current) gsap.set(bottomTrackerRef.current, { opacity: 0, y: 20 });

      // Master Scrubbed Timeline (0.0s to 12.0s across 3800px pinned scroll)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=3800',
          pin: true,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (prefersReducedMotion) {
        trans.scatter = 1;
        trans.assembleProgress = 1;
        trans.camX = 0;
        trans.camY = 1.35;
        trans.camZ = 7.4;
        trans.lookX = 0;
        trans.lookY = 0.25;
        gsap.set(solidAnvilGroup, { visible: false });
        gsap.set(anvilFragmentsGroup, { visible: true });
        gsap.set(floorMat, { opacity: 0.85 });
        gsap.set(contactShadow.material, { opacity: 0.45 });
        if (scene02TitleBoxRef.current) gsap.set(scene02TitleBoxRef.current, { opacity: 0 });
        if (scene03StageRef.current) gsap.set(scene03StageRef.current, { opacity: 1 });
        if (scene03HeadlineBoxRef.current) gsap.set(scene03HeadlineBoxRef.current, { opacity: 1, y: 0 });
        if (headlineSecondLineRef.current) gsap.set(headlineSecondLineRef.current, { opacity: 1, y: 0 });
        if (scene03SublineRef.current) gsap.set(scene03SublineRef.current, { opacity: 1, y: 0 });
        if (leftRailRef.current) gsap.set(leftRailRef.current, { opacity: 1, x: 0 });
        if (bottomTrackerRef.current) gsap.set(bottomTrackerRef.current, { opacity: 1, y: 0 });
        return;
      }

      // =======================================================================
      // PART 1: SCENE 02 — THE FORGE & STRIKE POISE (0.0s → 3.5s)
      // Solid Anvil is 100% Solid, Seamless & Grounded
      // =======================================================================
      masterTl.to([solidFaceMat, solidBodyMat], { opacity: 1.0, duration: 0.6, ease: 'power1.out' }, 0.4);
      masterTl.to(floorMat, { opacity: 0.82, duration: 0.8, ease: 'power2.out' }, 0.5);

      // Specular sweep across the smooth working face
      masterTl.to(travelingLight, { intensity: 4.8, duration: 0.3, ease: 'power2.out' }, 0.7);
      masterTl.to(travelingLight.position, { x: ANVIL_X + 1.85, y: ANVIL_Y + 0.92, z: 0.4, duration: 0.8, ease: 'power1.inOut' }, 0.7);
      masterTl.to(travelingLight, { intensity: 0, duration: 0.3, ease: 'power2.in' }, 1.3);

      // Scene 02 Text Entry (Special Crystallization)
      if (brandGlowRef.current) {
        masterTl.to(brandGlowRef.current, { opacity: 1, scale: 1.0, duration: 1.1, ease: 'power2.out' }, 0.9);
      }
      if (wordMeetRef.current) {
        masterTl.to(
          wordMeetRef.current,
          { opacity: 1, y: 0, scale: 1, letterSpacing: '-0.035em', filter: 'blur(0px) brightness(1)', duration: 0.8, ease: 'power3.out' },
          0.9
        );
      }
      if (wordDevForgeRef.current) {
        masterTl.to(
          wordDevForgeRef.current,
          { opacity: 1, y: 0, scale: 1, letterSpacing: '-0.038em', filter: 'blur(0px) brightness(1)', duration: 0.9, ease: 'power3.out' },
          1.1
        );
        masterTl.fromTo(
          wordDevForgeRef.current,
          { filter: 'brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))' },
          { filter: 'brightness(1.3) drop-shadow(0 0 26px rgba(200,225,255,0.45))', duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.inOut' },
          1.6
        );
      }
      if (scene02SublineRef.current) {
        masterTl.to(scene02SublineRef.current, { opacity: 1.0, y: 0, duration: 0.65, ease: 'power2.out' }, 1.4);
      }

      // Hammer solidifies in poised angle (~33°)
      masterTl.to([hammerHeadMat, hammerStrikeFaceMat, hammerWoodMat], { opacity: 1.0, duration: 0.5 }, 1.5);
      masterTl.to(hammerPivot.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.6, ease: 'power2.out' }, 1.5);

      // Hammer backswing in anticipation (~45° tension angle)
      masterTl.to(hammerPivot.rotation, { z: 0.78, duration: 0.6, ease: 'power1.out' }, 2.2);

      // Decisive accelerated downswing into the anvil face
      masterTl.to(hammerPivot.rotation, { z: 0.0, duration: 0.35, ease: 'power3.in' }, 3.25);

      // =======================================================================
      // PART 2: THE IMPACT STRIKE BEAT AT 3.60s (Instant Swap to Fragments!)
      // =======================================================================
      // Anvil shatters: solid anvil is hidden, 26 fragment meshes become active!
      masterTl.set(solidAnvilGroup, { visible: false }, 3.60);
      masterTl.set(anvilFragmentsGroup, { visible: true }, 3.60);
      masterTl.set([flashGroup, sparkPoints], { visible: true }, 3.60);
      masterTl.set([flashLineMat, burstMat, sparkMat], { opacity: 1.0 }, 3.60);
      masterTl.set(flashLine.scale, { x: 0.05, y: 1, z: 1 }, 3.60);
      masterTl.set(burstMesh.scale, { x: 0.1, y: 0.1, z: 0.1 }, 3.60);
      masterTl.set(trans, { sparkProgress: 0 }, 3.60);

      // Contact shockwave flash & sparks burst
      masterTl.to(flashLine.scale, { x: 1.6, y: 1, z: 1, duration: 0.22, ease: 'power3.out' }, 3.60);
      masterTl.to(flashLineMat, { opacity: 0, duration: 0.22, ease: 'power3.out' }, 3.60);
      masterTl.to(burstMesh.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.28, ease: 'power2.out' }, 3.60);
      masterTl.to(burstMat, { opacity: 0, duration: 0.28, ease: 'power2.out' }, 3.60);
      masterTl.to(sparkMat, { opacity: 0, duration: 0.28, ease: 'power2.out' }, 3.60);
      masterTl.to(trans, { sparkProgress: 1, duration: 0.28, ease: 'power1.out' }, 3.60);
      masterTl.set([flashGroup, sparkPoints], { visible: false }, 3.90);

      // Strike Recoil & Brand Title Pulse
      masterTl.to(trans, { camY: 0.58, duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.60);
      if (wordDevForgeRef.current) {
        masterTl.to(
          wordDevForgeRef.current,
          { filter: 'brightness(1.55) drop-shadow(0 0 35px rgba(255,255,255,0.95))', duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.out' },
          3.60
        );
      }

      // Initial shock fracture along shear planes
      masterTl.to(trans, { fracture: 1.0, duration: 0.6, ease: 'power2.out' }, 3.62);

      // Hammer elastic rebound bounce and dissolve
      masterTl.to(hammerPivot.rotation, { z: 0.08, duration: 0.16, ease: 'power1.out' }, 3.62);
      masterTl.to(hammerPivot.rotation, { z: 0.0, duration: 0.26, ease: 'bounce.out' }, 3.78);
      masterTl.to([hammerHeadMat, hammerStrikeFaceMat, hammerWoodMat], { opacity: 0, duration: 0.6 }, 4.0);

      // Scene 02 Text fades out into darkness
      if (scene02TitleBoxRef.current) {
        masterTl.to(scene02TitleBoxRef.current, { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, 3.9);
      }
      if (brandGlowRef.current) {
        masterTl.to(brandGlowRef.current, { opacity: 0, duration: 0.5 }, 3.9);
      }

      // =======================================================================
      // PART 3: PHASE C — SCATTER INTO SCENE 03 (4.3s → 6.4s)
      // =======================================================================
      masterTl.to(trans, { scatter: 1.0, duration: 1.5, ease: 'power2.inOut' }, 4.3);

      // Camera smoothly lifts into isometric three-quarter elevation
      masterTl.to(
        trans,
        {
          camX: 0.0,
          camY: 1.35,
          camZ: 7.4,
          lookX: 0.0,
          lookY: 0.25,
          duration: 1.8,
          ease: 'power2.inOut',
        },
        4.3
      );

      // Warm Amber Rim Light from bottom-left fades in (from reference image)
      masterTl.to(warmRimLight, { intensity: 2.8, duration: 1.4, ease: 'power2.out' }, 4.8);
      masterTl.to(contactShadow.material, { opacity: 0.35, duration: 1.4, ease: 'power2.out' }, 4.8);

      // =======================================================================
      // PART 4: SCENE 03 — STAGE 1: BROKEN OBJECT SUSPENDED (5.5s → 6.6s)
      // =======================================================================
      if (scene03StageRef.current) {
        masterTl.to(scene03StageRef.current, { opacity: 1, duration: 0.5 }, 5.5);
      }
      if (leftRailRef.current) {
        masterTl.to(leftRailRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 5.6);
      }
      if (bottomTrackerRef.current) {
        masterTl.to(bottomTrackerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 5.6);
      }

      // Step 01 Highlight: 0% Broken
      if (step01Ref.current) {
        masterTl.to(step01Ref.current, { color: '#ffffff', textDecoration: 'underline', duration: 0.2 }, 5.6);
      }

      // Headline begins near top of viewport ("Start here.")
      if (scene03HeadlineBoxRef.current) {
        masterTl.to(
          scene03HeadlineBoxRef.current,
          { opacity: 1, y: -20, duration: 0.6, ease: 'power2.out' },
          5.6
        );
      }

      // =======================================================================
      // PART 5: SCENE 03 — STAGE 2 & 3: NATURAL MAGNETIC CONVERGENCE (6.6s → 9.2s)
      // =======================================================================
      // Headline descends smoothly toward middle position
      if (scene03HeadlineBoxRef.current) {
        masterTl.to(
          scene03HeadlineBoxRef.current,
          { y: 0, duration: 1.4, ease: 'power2.inOut' },
          6.6
        );
      }

      // Second headline line reveals: "Become a builder."
      if (headlineSecondLineRef.current) {
        masterTl.to(
          headlineSecondLineRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          6.9
        );
      }

      // Step 02 Highlight: 25% Pieces move
      if (step01Ref.current) masterTl.to(step01Ref.current, { color: '#71717a', textDecoration: 'none', duration: 0.2 }, 6.8);
      if (step02Ref.current) masterTl.to(step02Ref.current, { color: '#ffffff', textDecoration: 'underline', duration: 0.2 }, 6.8);

      // Smooth master assembleProgress driving individual organic magnetic curves
      masterTl.to(trans, { assembleProgress: 0.60, duration: 1.6, ease: 'power2.inOut' }, 6.8);

      // Step 03 Highlight: 50% Structure forms
      if (step02Ref.current) masterTl.to(step02Ref.current, { color: '#71717a', textDecoration: 'none', duration: 0.2 }, 8.0);
      if (step03Ref.current) masterTl.to(step03Ref.current, { color: '#ffffff', textDecoration: 'underline', duration: 0.2 }, 8.0);

      // =======================================================================
      // PART 6: SCENE 03 — STAGE 4 & 5: FINAL ASSEMBLY & LOCK (8.8s → 10.8s)
      // =======================================================================
      // Remaining blocks sweep along parabolic arcs and snap into 3x3x3 grid
      masterTl.to(trans, { assembleProgress: 1.0, duration: 1.6, ease: 'power3.out' }, 8.6);

      // Step 04 Highlight: 75% Almost complete
      if (step03Ref.current) masterTl.to(step03Ref.current, { color: '#71717a', textDecoration: 'none', duration: 0.2 }, 8.8);
      if (step04Ref.current) masterTl.to(step04Ref.current, { color: '#ffffff', textDecoration: 'underline', duration: 0.2 }, 8.8);

      // Step 05 Highlight: 100% Fully assembled
      if (step04Ref.current) masterTl.to(step04Ref.current, { color: '#71717a', textDecoration: 'none', duration: 0.2 }, 9.8);
      if (step05Ref.current) masterTl.to(step05Ref.current, { color: '#ffffff', textDecoration: 'underline', duration: 0.2 }, 9.8);

      // Subtle ambient cube rotation as monolith locks into completion
      masterTl.to(trans, { cubeRotationY: 0.10, duration: 1.8, ease: 'power1.out' }, 9.8);

      // Supporting narrative reveals and settles firmly
      if (scene03SublineRef.current) {
        masterTl.to(
          scene03SublineRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          9.9
        );
      }

      // Hold complete state before release into next section
      masterTl.to({}, { duration: 1.0 }, 11.0);
    }, stage);

    // Resize & Cleanup
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="meet-devforge"
      className="relative w-full h-screen min-h-screen bg-[#050608] text-white overflow-hidden flex items-center px-6 sm:px-12 lg:px-24 z-20 select-none"
      style={{ backgroundColor: '#050608' }}
    >
      {/* Background Volumetric Aura */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle 800px at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 80%)',
        }}
      />

      {/* 3D Canvas Stage: Full Viewport Coverage for both Scene 02 and Scene 03 */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
      />

      {/* ===================================================================== */}
      {/* SCENE 02 OVERLAY: The Forge (Meet DevForge.)                          */}
      {/* ===================================================================== */}
      <div
        ref={scene02TitleBoxRef}
        className="relative z-30 max-w-lg lg:max-w-2xl flex flex-col justify-center pointer-events-auto"
      >
        {/* Volumetric Foundry Aura behind title */}
        <div
          ref={brandGlowRef}
          className="absolute -top-32 -left-28 w-[720px] h-[720px] rounded-full pointer-events-none opacity-0 blur-[110px] -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(140, 190, 240, 0.14) 0%, rgba(255, 255, 255, 0.05) 35%, transparent 70%)',
          }}
        />

        {/* Anchor Headline (Rector Serif, 100% White) */}
        <h2 className="font-rector text-6xl sm:text-7xl lg:text-[96px] xl:text-[108px] 2xl:text-[116px] font-bold tracking-[-0.038em] leading-[0.96] text-white select-none">
          <span
            ref={wordMeetRef}
            className="inline-block mr-4 transform-gpu will-change-transform"
          >
            Meet
          </span>
          <br className="hidden sm:inline" />
          <span
            ref={wordDevForgeRef}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f0f4f8] to-[#c8d8e8] whitespace-nowrap drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] pb-4 pt-1 -mb-4 pr-3 transform-gpu will-change-transform"
          >
            DevForge.
          </span>
        </h2>

        {/* Narrative Subtitle (High Contrast, 18-20px Desktop, 16-18px Mobile) */}
        <p
          ref={scene02SublineRef}
          className="font-acma text-[16px] sm:text-[18px] lg:text-[19px] xl:text-[20px] text-[#EDEDED] font-normal sm:font-medium leading-[1.68] max-w-[480px] lg:max-w-[530px] mt-6 sm:mt-8 select-none"
        >
          A new perspective on learning to build software. Master the architecture
          of real-world computing systems from the ground up.
        </p>
      </div>

      {/* ===================================================================== */}
      {/* SCENE 03 OVERLAY: Cube Assembly (Start here. Become a builder.)       */}
      {/* ===================================================================== */}
      <div
        ref={scene03StageRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-0 flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none"
      >
        {/* Left Rail Navigation Tracker (From Reference Image) */}
        <div
          ref={leftRailRef}
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col space-y-7 z-30 text-[11px] font-mono tracking-widest pointer-events-none"
        >
          <div className="flex items-center space-x-3 text-neutral-500 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <span>01 Meet DevForge</span>
          </div>
          <div className="flex items-center space-x-3 text-white">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
            <span className="font-semibold text-neutral-100">02 Start here</span>
          </div>
          <div className="flex items-center space-x-3 text-neutral-500 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <span>03 Courses</span>
          </div>
          <div className="flex items-center space-x-3 text-neutral-500 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            <span>04 Join the era</span>
          </div>
        </div>

        {/* Center Descending Headline & Narrative */}
        <div
          ref={scene03HeadlineBoxRef}
          className="w-full flex flex-col items-center text-center mt-12 sm:mt-16 lg:mt-18 z-30 max-w-4xl mx-auto will-change-transform"
        >
          {/* Section Kicker */}
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-neutral-400 mb-3 block">
            SECTION 02
          </span>

          {/* Main Headline (Descending in Stage 2) */}
          <h2 className="font-rector text-4xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[84px] font-bold tracking-[-0.03em] leading-[1.02] text-white select-none">
            <span className="block">Start here.</span>
            <span
              ref={headlineSecondLineRef}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300 pb-2"
            >
              Become a builder.
            </span>
          </h2>

          {/* Supporting Copy (High Contrast, Controlled Width, Effortless Reading) */}
          <p
            ref={scene03SublineRef}
            className="font-acma text-[16px] sm:text-[18px] lg:text-[20px] text-[#EDEDED] font-normal sm:font-medium leading-[1.68] max-w-xl mt-5 sm:mt-6 px-4 select-none opacity-0"
          >
            You don't become a builder by knowing everything already. You become one
            by learning how the pieces fit together.
          </p>
        </div>

        {/* Bottom Interactive Timeline Indicator (From Reference Image) */}
        <div
          ref={bottomTrackerRef}
          className="w-full flex flex-col items-center justify-center z-30 pb-2 pointer-events-none space-y-2.5"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
            SCROLL TO BUILD
          </span>
          <div className="flex items-center space-x-2 sm:space-x-8 lg:space-x-12 text-[9px] sm:text-[11px] font-mono tracking-wider text-neutral-500">
            <span ref={step01Ref}>0%<span className="hidden sm:inline"> Broken</span></span>
            <span className="text-neutral-700">·</span>
            <span ref={step02Ref}>25%<span className="hidden sm:inline"> Pieces move</span></span>
            <span className="text-neutral-700">·</span>
            <span ref={step03Ref}>50%<span className="hidden sm:inline"> Structure forms</span></span>
            <span className="text-neutral-700">·</span>
            <span ref={step04Ref}>75%<span className="hidden sm:inline"> Almost complete</span></span>
            <span className="text-neutral-700">·</span>
            <span ref={step05Ref}>100%<span className="hidden sm:inline"> Fully assembled</span></span>
          </div>
        </div>
      </div>
    </section>
  );
};
