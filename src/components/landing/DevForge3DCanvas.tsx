'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export interface DevForge3DCanvasProps {
  onAnimationComplete?: () => void;
  scrollProgress?: number; // 0 to 1 for downward fragment cascade
  className?: string;
  staticPreview?: boolean;
}

/**
 * DEVFORGE 3D CANVAS — CINEMATIC DEPTH, RECTANGULAR HAMMER & SOLID ANVIL
 *
 * Sequence:
 * 1. The Void (0 - 0.8s): Pitch black darkness, silence.
 * 2. Geometric Lines (0.8s - 2.2s): Fine technical drafting lines and 3D wireframe edges draw in.
 * 3. Realistic 3D Takes Shape (2.0s - 3.6s): Solid graphite metallic materials fade in over lines,
 *    revealing unmistakable rectangular hammer, dimensional anvil with depth, horn, waist, and specular lighting.
 * 4. The Strike (3.9s - 4.3s): Upright/diagonal hammer anticipates, swings through weighted arc,
 *    strikes anvil top plate with flush rectangular face and specular impact spark line.
 * 5. Fracture & Transition (4.3s+): Anvil breaks into solid 3D pieces that cascade downward into Scene 03 on scroll.
 */
export const DevForge3DCanvas: React.FC<DevForge3DCanvasProps> = ({
  onAnimationComplete,
  scrollProgress = 0,
  className = '',
  staticPreview = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const fragmentsRef = useRef<{
    mesh: THREE.Mesh;
    lines: THREE.LineSegments;
    initialPos: THREE.Vector3;
    initialRot: THREE.Euler;
    velocity: THREE.Vector3;
    rotVelocity: THREE.Vector3;
  }[]>([]);

  const hammerPivotRef = useRef<THREE.Group | null>(null);
  const hammerMeshesRef = useRef<THREE.Mesh[]>([]);
  const hammerLinesRef = useRef<THREE.LineSegments[]>([]);
  const flashGroupRef = useRef<THREE.Group | null>(null);
  const draftingLinesRef = useRef<THREE.LineSegments | null>(null);
  const hasStruckRef = useRef<boolean>(false);
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 740;
    const height = container.clientHeight || 650;

    // =========================================================================
    // 1. Scene & Perspective Camera with Believable 3D Depth
    // =========================================================================
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Perspective camera framing the anvil & hammer with authentic 3D depth:
    // Positioned slightly elevated and to the right/front (35° FOV) so the top plate,
    // side profile, horn, waist, and rectangular hammer head have deep, unmistakable volume.
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(1.15, 1.65, 5.6);
    camera.lookAt(0.10, 0.75, 0);
    cameraRef.current = camera;

    // =========================================================================
    // 2. High-Performance WebGL Renderer
    // =========================================================================
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
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // =========================================================================
    // 3. Cinematic 3D Lighting Setup (Depth, Specular Chamfers, Rich Metallic Shading)
    // =========================================================================
    // Ambient graphite base
    const ambientLight = new THREE.AmbientLight(0x222730, 1.4);
    scene.add(ambientLight);

    // Key directional light: crisp white from high-left casting top bevel reflections
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(-2.8, 5.5, 4.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Front specular fill: reveals front metallic facets and brushed metal depth
    const frontFill = new THREE.DirectionalLight(0x5a6578, 2.2);
    frontFill.position.set(1.8, 2.2, 5.0);
    scene.add(frontFill);

    // Rim light from rear-right: illuminates horn and hammer silhouette
    const rimLight = new THREE.DirectionalLight(0xa5c9f5, 3.0);
    rimLight.position.set(4.5, 3.5, -3.2);
    scene.add(rimLight);

    // Subtle ground bounce light
    const bounceLight = new THREE.DirectionalLight(0x181c22, 0.8);
    bounceLight.position.set(0, -3.0, 1.5);
    scene.add(bounceLight);

    // =========================================================================
    // 4. Photorealistic PBR Materials (Forged Dark Steel)
    // =========================================================================
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0x282e38,
      roughness: 0.28,
      metalness: 0.90,
      transparent: true,
      opacity: staticPreview ? 1 : 0,
    });

    const polishedFaceMaterial = new THREE.MeshStandardMaterial({
      color: 0x485363,
      roughness: 0.16,
      metalness: 0.96,
      transparent: true,
      opacity: staticPreview ? 1 : 0,
    });

    const woodHandleMaterial = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.55,
      metalness: 0.25,
      transparent: true,
      opacity: staticPreview ? 1 : 0,
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: staticPreview ? 0.22 : 0,
    });

    const draftingLineMaterial = new THREE.LineBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: staticPreview ? 0.35 : 0,
    });

    // =========================================================================
    // 5. Architectural Drafting Guides (Storyboard Frame 02)
    // =========================================================================
    const guidesGroup = new THREE.Group();
    scene.add(guidesGroup);

    const draftingPoints: THREE.Vector3[] = [
      // Top Working Face Horizon
      new THREE.Vector3(-3.2, 0.92, 0), new THREE.Vector3(3.2, 0.92, 0),
      // Step Shelf Line
      new THREE.Vector3(-2.8, 0.74, 0), new THREE.Vector3(0, 0.74, 0),
      // Base Plinth Horizon
      new THREE.Vector3(-2.8, -0.42, 0), new THREE.Vector3(2.8, -0.42, 0),
      // Vertical Centerline (Axis of Impact)
      new THREE.Vector3(0, -0.9, 0), new THREE.Vector3(0, 3.8, 0),
      // Diagonal Swing Trajectory Guideline
      new THREE.Vector3(0, 0.92, 0), new THREE.Vector3(1.6, 2.5, 0),
      // Horn Dimension Baseline
      new THREE.Vector3(0.8, 0.92, 0), new THREE.Vector3(2.35, 0.96, 0),
    ];
    const draftingGeo = new THREE.BufferGeometry().setFromPoints(draftingPoints);
    const draftingLines = new THREE.LineSegments(draftingGeo, draftingLineMaterial);
    draftingLinesRef.current = draftingLines;
    guidesGroup.add(draftingLines);

    // Impact focal ring
    const ringGeo = new THREE.RingGeometry(0.08, 0.10, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, side: THREE.DoubleSide, transparent: true, opacity: staticPreview ? 0.4 : 0 });
    const focalRing = new THREE.Mesh(ringGeo, ringMat);
    focalRing.position.set(0, 0.92, 0.01);
    guidesGroup.add(focalRing);

    // =========================================================================
    // 6. Realistic 3D Blacksmith's Anvil (Believable Solid Depth)
    // Composed of 8 Interlocking Solid Fracture Pieces
    // Anvil top surface at y = 0.92, genuine depth along Z of 0.88 units.
    // =========================================================================
    const anvilFragments: {
      mesh: THREE.Mesh;
      lines: THREE.LineSegments;
      initialPos: THREE.Vector3;
      initialRot: THREE.Euler;
      velocity: THREE.Vector3;
      rotVelocity: THREE.Vector3;
    }[] = [];

    const addFragment = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      pos: [number, number, number],
      rot: [number, number, number],
      velocity: [number, number, number],
      rotVel: [number, number, number]
    ) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geo, 22);
      const lines = new THREE.LineSegments(edges, lineMaterial.clone());
      mesh.add(lines);

      anvilFragments.push({
        mesh,
        lines,
        initialPos: new THREE.Vector3(pos[0], pos[1], pos[2]),
        initialRot: new THREE.Euler(rot[0], rot[1], rot[2]),
        velocity: new THREE.Vector3(velocity[0], velocity[1], velocity[2]),
        rotVelocity: new THREE.Vector3(rotVel[0], rotVel[1], rotVel[2]),
      });
    };

    // Fragment 1: The Horn (Solid cone tapering rightward, elevated tip)
    const hornGeo = new THREE.ConeGeometry(0.32, 1.45, 20);
    hornGeo.rotateZ(-Math.PI / 2);
    hornGeo.translate(1.52, 0.86, 0);
    addFragment(hornGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [2.6, -4.3, 0.5], [0.2, 0.1, -1.1]);

    // Fragment 2: Top Working Plate Right (Hardened face right of x = 0)
    const faceRightGeo = new THREE.BoxGeometry(0.85, 0.24, 0.84);
    faceRightGeo.translate(0.425, 0.80, 0);
    addFragment(faceRightGeo, polishedFaceMaterial, [0, 0, 0], [0, 0, 0], [1.3, -5.3, -0.4], [-0.3, 0.2, -0.8]);

    // Fragment 3: Top Working Plate Left (Hardened face left of x = 0)
    const faceLeftGeo = new THREE.BoxGeometry(0.85, 0.24, 0.84);
    faceLeftGeo.translate(-0.425, 0.80, 0);
    addFragment(faceLeftGeo, polishedFaceMaterial, [0, 0, 0], [0, 0, 0], [-1.3, -5.2, 0.4], [0.4, -0.3, 0.9]);

    // Fragment 4: Left Step & Heel Overhang
    const stepGeo = new THREE.BoxGeometry(0.55, 0.20, 0.78);
    stepGeo.translate(-1.12, 0.68, 0);
    addFragment(stepGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [-2.4, -4.6, 0.6], [0.5, 0.6, 1.3]);

    // Fragment 5: Central Waist Column (Directly beneath impact zone)
    const waistCoreGeo = new THREE.BoxGeometry(0.70, 0.62, 0.70);
    waistCoreGeo.translate(0, 0.38, 0);
    addFragment(waistCoreGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [0.1, -6.1, 0.2], [0.2, 0.6, 0.1]);

    // Fragment 6: Left Waist Flank
    const waistLeftGeo = new THREE.BoxGeometry(0.55, 0.58, 0.66);
    waistLeftGeo.translate(-0.60, 0.36, 0);
    addFragment(waistLeftGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [-1.6, -5.4, -0.5], [-0.4, 0.3, 0.6]);

    // Fragment 7: Right Waist Flank
    const waistRightGeo = new THREE.BoxGeometry(0.55, 0.58, 0.66);
    waistRightGeo.translate(0.60, 0.36, 0);
    addFragment(waistRightGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [1.6, -5.3, 0.5], [0.3, -0.4, -0.6]);

    // Fragment 8: Base Left Foot Plinth (Flared heavy base)
    const baseLeftGeo = new THREE.BoxGeometry(1.28, 0.40, 1.15);
    baseLeftGeo.translate(-0.64, -0.38, 0);
    addFragment(baseLeftGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [-0.9, -6.6, 0.3], [0.2, -0.2, 0.3]);

    // Fragment 9: Base Right Foot Plinth (Flared heavy base)
    const baseRightGeo = new THREE.BoxGeometry(1.28, 0.40, 1.15);
    baseRightGeo.translate(0.64, -0.38, 0);
    addFragment(baseRightGeo, steelMaterial, [0, 0, 0], [0, 0, 0], [0.9, -6.5, -0.3], [-0.2, 0.2, -0.3]);

    // 4 Chiseled Impact Micro-Shards at cleavage point (0, 0.92, 0)
    for (let i = 0; i < 4; i++) {
      const shardGeo = new THREE.DodecahedronGeometry(0.065, 0);
      const angle = (i / 4) * Math.PI * 2;
      shardGeo.translate(Math.cos(angle) * 0.15, 0.92, Math.sin(angle) * 0.15);
      addFragment(
        shardGeo,
        steelMaterial,
        [0, 0, 0],
        [0, 0, 0],
        [Math.cos(angle) * 2.8, -4.2, Math.sin(angle) * 2.8],
        [Math.random() * 4, Math.random() * 4, Math.random() * 4]
      );
    }

    fragmentsRef.current = anvilFragments;

    // =========================================================================
    // 7. Traditional Blacksmith's Sledge Hammer
    // A SOLID RECTANGULAR STEEL HEAD:
    // Dimensions: 0.68 length x 0.92 height x 0.65 depth.
    // The flat rectangular striking face (0.68 x 0.65) is oriented directly downward,
    // and lands completely flush onto the top surface of the anvil at impact!
    // A long ash handle (radius 0.075, length 2.65) extends straight up/out of the head eye.
    // =========================================================================
    const hammerPivot = new THREE.Group();
    hammerPivotRef.current = hammerPivot;
    // Pivot at contact point: (0, 0.92, 0)
    hammerPivot.position.set(0, 0.92, 0);
    scene.add(hammerPivot);

    const hammerMeshes: THREE.Mesh[] = [];
    const hammerLines: THREE.LineSegments[] = [];

    const hammerBody = new THREE.Group();
    hammerPivot.add(hammerBody);

    // 1. SOLID RECTANGULAR FORGED STEEL HEAD (Unmistakable Rectangular Cuboid):
    // Extends from y = 0 (striking face) to y = 0.92 (top eye face).
    // Width along X: 0.68, Depth along Z: 0.65, Height along Y: 0.92.
    const headGeo = new THREE.BoxGeometry(0.68, 0.92, 0.65);
    headGeo.translate(0, 0.46, 0); // Bottom face sits at y = 0!

    const headMesh = new THREE.Mesh(headGeo, steelMaterial);
    headMesh.castShadow = true;
    hammerBody.add(headMesh);
    hammerMeshes.push(headMesh);

    const headEdges = new THREE.EdgesGeometry(headGeo, 24);
    const headWire = new THREE.LineSegments(headEdges, lineMaterial.clone());
    headMesh.add(headWire);
    hammerLines.push(headWire);

    // 2. Hardened Polished Striking Face Plate (At y = 0):
    // Flat rectangular plate directly facing the anvil top plate
    const strikePlateGeo = new THREE.BoxGeometry(0.66, 0.05, 0.63);
    strikePlateGeo.translate(0, 0.025, 0);
    const strikePlateMesh = new THREE.Mesh(strikePlateGeo, polishedFaceMaterial);
    strikePlateMesh.castShadow = true;
    hammerBody.add(strikePlateMesh);
    hammerMeshes.push(strikePlateMesh);

    const strikeEdges = new THREE.EdgesGeometry(strikePlateGeo, 24);
    const strikeWire = new THREE.LineSegments(strikeEdges, lineMaterial.clone());
    strikePlateMesh.add(strikeWire);
    hammerLines.push(strikeWire);

    // 3. Central Eye Collar Wedge Band (Forging Detail in Center of Head):
    const eyeBandGeo = new THREE.BoxGeometry(0.70, 0.16, 0.67);
    eyeBandGeo.translate(0, 0.52, 0);
    const eyeBandMesh = new THREE.Mesh(eyeBandGeo, steelMaterial);
    eyeBandMesh.castShadow = true;
    hammerBody.add(eyeBandMesh);
    hammerMeshes.push(eyeBandMesh);

    // 4. Long Traditional Handle attached through the head:
    // Extends straight upward along +Y from y = 0.92 (top of head) up to y = 3.52!
    const handleGeo = new THREE.CylinderGeometry(0.07, 0.085, 2.60, 16);
    handleGeo.translate(0, 0.92 + 1.30, 0); // Center at y = 2.22

    const handleMesh = new THREE.Mesh(handleGeo, woodHandleMaterial);
    handleMesh.castShadow = true;
    hammerBody.add(handleMesh);
    hammerMeshes.push(handleMesh);

    const handleEdges = new THREE.EdgesGeometry(handleGeo, 24);
    const handleWire = new THREE.LineSegments(handleEdges, lineMaterial.clone());
    handleMesh.add(handleWire);
    hammerLines.push(handleWire);

    hammerMeshesRef.current = hammerMeshes;
    hammerLinesRef.current = hammerLines;

    // Initial Poised Position:
    // Held diagonally raised above the anvil top (Storyboard Frame 03/04):
    // Positioned at (0.16, 1.62, 0), angled at -35° (~ -0.61 rad) with handle pointing up & right
    hammerPivot.position.set(0.16, 1.62, 0);
    hammerPivot.rotation.z = -0.61;

    // =========================================================================
    // 8. Contact Flash & Gleam Group (At exact collision plane y = 0.92)
    // =========================================================================
    const flashGroup = new THREE.Group();
    flashGroup.position.set(0, 0.925, 0);
    scene.add(flashGroup);
    flashGroupRef.current = flashGroup;

    // Side-view horizontal impact spark line
    const flashLineGeo = new THREE.PlaneGeometry(2.0, 0.08);
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

    // Soft radial impact burst
    const burstGeo = new THREE.RingGeometry(0.01, 1.3, 32);
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

    // =========================================================================
    // 9. GSAP Master Chronological Sequence (Nothing -> Lines -> 3D Solids -> Strike -> Fracture)
    // =========================================================================
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        hasStruckRef.current = true;
        if (onAnimationComplete) onAnimationComplete();
      },
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || staticPreview) {
      steelMaterial.opacity = 1;
      polishedFaceMaterial.opacity = 1;
      woodHandleMaterial.opacity = 1;
      draftingLineMaterial.opacity = 0.25;
      hasStruckRef.current = true;
      if (onAnimationComplete) onAnimationComplete();
      return;
    }

    // =========================================================================
    // Phase 0: The Void (0.0s - 0.8s) -> Silence & Darkness
    // Phase 1: Geometric Lines Draw In (0.8s - 2.2s)
    // =========================================================================
    tl.to(
      draftingLineMaterial,
      { opacity: 0.70, duration: 0.8, ease: 'power2.out' },
      0.8
    );
    tl.to(
      ringMat,
      { opacity: 0.8, duration: 0.6, ease: 'power2.out' },
      0.9
    );

    anvilFragments.forEach((frag, idx) => {
      const mat = frag.lines.material as THREE.LineBasicMaterial;
      tl.to(
        mat,
        { opacity: 0.85, duration: 0.7, ease: 'power2.inOut' },
        0.9 + idx * 0.04
      );
    });

    hammerLines.forEach((line) => {
      const mat = line.material as THREE.LineBasicMaterial;
      tl.to(
        mat,
        { opacity: 0.85, duration: 0.75, ease: 'power2.inOut' },
        1.1
      );
    });

    // =========================================================================
    // Phase 2: Realistic 3D Forms Take Shape (2.0s - 3.6s)
    // Materials fade in over wireframes, solid steel volume and depth manifest
    // =========================================================================
    tl.to(steelMaterial, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 2.0);
    tl.to(polishedFaceMaterial, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 2.1);
    tl.to(woodHandleMaterial, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 2.2);

    // Edge lines soften as solid metallic geometry becomes primary
    anvilFragments.forEach((frag) => {
      const mat = frag.lines.material as THREE.LineBasicMaterial;
      tl.to(mat, { opacity: 0.20, duration: 0.6 }, 3.0);
    });
    hammerLines.forEach((line) => {
      const mat = line.material as THREE.LineBasicMaterial;
      tl.to(mat, { opacity: 0.22, duration: 0.6 }, 3.0);
    });
    tl.to(draftingLineMaterial, { opacity: 0.22, duration: 0.6 }, 3.0);

    // =========================================================================
    // Phase 3 & 4: Anticipation -> Weighted Strike Down (3.9s - 4.4s)
    // The hammer draws back/lifts in anticipation, then drives down:
    // Rotation aligns to 0° (rectangular face hits anvil top face flat!)
    // =========================================================================
    // 1. Anticipation: lifts upward & tilts back slightly
    tl.to(
      hammerPivot.position,
      { x: 0.24, y: 1.95, duration: 0.35, ease: 'power1.out' },
      3.90
    );
    tl.to(
      hammerPivot.rotation,
      { z: -0.78, duration: 0.35, ease: 'power1.out' },
      3.90
    );

    // 2. Accelerated Downward Strike to contact point (0, 0.92, 0)
    // Rectangular striking face lands completely flat on anvil top plate!
    tl.to(
      hammerPivot.rotation,
      { z: 0.0, duration: 0.16, ease: 'power4.in' },
      4.28
    );
    tl.to(
      hammerPivot.position,
      { x: 0.0, y: 0.92, duration: 0.16, ease: 'power4.in' },
      4.28
    );

    // 3. Impact Flash & Specular Spark Line (t = 4.44s)
    tl.fromTo(
      flashLine.scale,
      { x: 0.05, y: 1, z: 1 },
      { x: 1.4, y: 1, z: 1, duration: 0.20, ease: 'power3.out' },
      4.44
    );
    tl.fromTo(
      flashLineMat,
      { opacity: 1 },
      { opacity: 0, duration: 0.20, ease: 'power3.out' },
      4.44
    );

    tl.fromTo(
      burstMesh.scale,
      { x: 0.1, y: 0.1, z: 0.1 },
      { x: 1.6, y: 1.6, z: 1.6, duration: 0.22, ease: 'power2.out' },
      4.44
    );
    tl.fromTo(
      burstMat,
      { opacity: 1 },
      { opacity: 0, duration: 0.22, ease: 'power2.out' },
      4.44
    );

    // 4. Kinetic Camera Vibration
    tl.to(
      camera.position,
      { y: 1.63, duration: 0.04, yoyo: true, repeat: 1 },
      4.44
    );

    // 5. Kinetic Recoil of Hammer (rebounds cleanly upward along the arc)
    tl.to(
      hammerPivot.position,
      { x: 0.10, y: 1.26, duration: 0.45, ease: 'power2.out' },
      4.52
    );
    tl.to(
      hammerPivot.rotation,
      { z: -0.22, duration: 0.45, ease: 'power2.out' },
      4.52
    );

    // 6. Anvil Fracture Micro-Displacement (Shows physical cleavage cracks)
    anvilFragments.forEach((frag, idx) => {
      const offsetX = frag.velocity.x * 0.03;
      const offsetY = frag.velocity.y * 0.012;
      tl.to(
        frag.mesh.position,
        {
          x: frag.initialPos.x + offsetX,
          y: frag.initialPos.y + offsetY,
          duration: 0.35,
          ease: 'power2.out',
        },
        4.48 + idx * 0.015
      );
    });

    // Auto-trigger timeline when entering viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tl.play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(container);

    // =========================================================================
    // 10. Render Loop & Scroll-Linked Fracture Cascade into Scene 03
    // =========================================================================
    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      const progress = scrollProgressRef.current;

      // When visitor scrolls toward Scene 03, the solid pieces cascade downward
      if (progress > 0) {
        const p2 = progress * progress; // Quadratic acceleration y = 1/2 * g * t^2
        const fade = Math.max(1 - progress * 1.15, 0);

        anvilFragments.forEach((frag) => {
          frag.mesh.position.x = frag.initialPos.x + frag.velocity.x * progress;
          frag.mesh.position.y = frag.initialPos.y + frag.velocity.y * p2;
          frag.mesh.position.z = frag.initialPos.z + frag.velocity.z * progress;

          frag.mesh.rotation.x = frag.initialRot.x + frag.rotVelocity.x * progress;
          frag.mesh.rotation.y = frag.initialRot.y + frag.rotVelocity.y * progress;
          frag.mesh.rotation.z = frag.initialRot.z + frag.rotVelocity.z * progress;

          const meshMat = frag.mesh.material as THREE.MeshStandardMaterial;
          meshMat.opacity = fade;
          const lineMat = frag.lines.material as THREE.LineBasicMaterial;
          lineMat.opacity = fade * 0.25;
        });

        // Hammer lifts and fades smoothly
        if (hammerPivotRef.current) {
          hammerPivotRef.current.position.y = 1.26 + progress * 2.6;
          hammerPivotRef.current.position.x = 0.10 + progress * 0.4;
          hammerPivotRef.current.rotation.z = -0.22 - progress * 0.4;
          hammerMeshesRef.current.forEach((m) => {
            (m.material as THREE.MeshStandardMaterial).opacity = fade;
          });
          hammerLinesRef.current.forEach((l) => {
            (l.material as THREE.LineBasicMaterial).opacity = fade * 0.25;
          });
        }

        if (draftingLinesRef.current) {
          (draftingLinesRef.current.material as THREE.LineBasicMaterial).opacity = fade * 0.25;
        }
      } else if (hasStruckRef.current) {
        // Reset when scrolled back to top
        anvilFragments.forEach((frag) => {
          frag.mesh.position.copy(frag.initialPos);
          frag.mesh.rotation.copy(frag.initialRot);
          (frag.mesh.material as THREE.MeshStandardMaterial).opacity = 1;
        });
      }

      renderer.render(scene, camera);
    };

    render();

    // =========================================================================
    // 11. Responsive Resize
    // =========================================================================
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      tl.kill();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onAnimationComplete, staticPreview]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-visible ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
};
