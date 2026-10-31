import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface FragmentData {
  mesh: THREE.Mesh;
  index: number;
  isMajor: boolean;
  // Starting position/rotation in the intact anvil
  anvilPos: THREE.Vector3;
  anvilScale: THREE.Vector3;
  // Dynamic trajectory when struck by the hammer
  fractureDir: THREE.Vector3;
  // Suspended floating coordinates in Scene 03 Stage 1 (Broken)
  scatterPos: THREE.Vector3;
  scatterRot: THREE.Euler;
  // Target coordinates in the final assembled 3x3x3 monolithic cube
  cubePos: THREE.Vector3;
  cubeRot: THREE.Euler;
  // Magnetic physics trajectory parameters
  arcOffset: THREE.Vector3;
  delay: number;
}

export interface AnvilCubeSystem {
  fragments: FragmentData[];
  cubeGroup: THREE.Group;
  anvilFragmentsGroup: THREE.Group;
  faceMat: THREE.MeshStandardMaterial;
  bodyMat: THREE.MeshStandardMaterial;
}

/**
 * Builds the 26 coordinated solid fragments that:
 * 1. Form the anvil fracture pieces upon hammer impact.
 * 2. Scatter into 3D suspended space in Scene 03 Stage 1 (Broken).
 * 3. Flow along organic, natural magnetic arcs to assemble into the 3x3x3 cube monolith.
 */
export function buildAnvilAndCubeFragments(ANVIL_X = 1.0, ANVIL_Y = -0.15): AnvilCubeSystem {
  const anvilFragmentsGroup = new THREE.Group();
  anvilFragmentsGroup.position.set(ANVIL_X, ANVIL_Y, 0);
  anvilFragmentsGroup.visible = false; // INVISIBLE UNTIL IMPACT! Solid anvil is shown before strike.

  const cubeGroup = new THREE.Group();
  // Isometric tilt angle matching reference image
  cubeGroup.rotation.set(0.38, -0.68, 0.12);
  cubeGroup.position.set(0, 0.15, 0);

  // Precision-machined PBR materials: dark forged titanium with specular bevel chamfers
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0x3d4756,
    roughness: 0.16,
    metalness: 0.92,
    transparent: true,
  });

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e2430,
    roughness: 0.26,
    metalness: 0.88,
    transparent: true,
  });

  // Base unit geometry for each modular block in the 3x3x3 cube (precision CNC beveled edges)
  const blockSize = 0.52;
  const baseBoxGeo = new RoundedBoxGeometry(blockSize, blockSize, blockSize, 4, 0.032);

  // 1. Enumerate the 26 grid positions for a 3x3x3 cube (excluding internal center 0,0,0)
  const gridCoords: { ix: number; iy: number; iz: number }[] = [];
  for (let iy = 1; iy >= -1; iy--) {
    for (let ix = -1; ix <= 1; ix++) {
      for (let iz = -1; iz <= 1; iz++) {
        if (ix === 0 && iy === 0 && iz === 0) continue;
        gridCoords.push({ ix, iy, iz });
      }
    }
  }

  // Spacing between cube block centers
  const S = 0.55;

  // Precomputed scatter offsets matching Step 01 in reference image
  const scatterOffsets: [number, number, number, number, number, number][] = [
    // [x, y, z, rotX, rotY, rotZ]
    [-1.8, 1.6, 1.2, 0.4, 0.6, -0.3],
    [-0.4, 1.9, -0.8, -0.5, 0.2, 0.7],
    [1.6, 1.7, 0.9, 0.3, -0.8, 0.4],
    [-2.2, 0.8, -0.6, 0.6, -0.3, -0.5],
    [0.1, 1.5, 1.8, -0.4, 0.5, 0.2],
    [2.3, 0.9, -1.1, 0.7, 0.4, -0.6],
    [-1.7, 0.2, 1.6, -0.3, -0.6, 0.5],
    [-0.2, 0.4, -2.1, 0.5, 0.7, -0.2],
    [1.9, 0.3, 1.4, -0.6, 0.3, 0.8],

    [-2.4, -0.3, 0.4, 0.2, 0.8, -0.4],
    [-0.8, 0.1, 2.3, -0.7, -0.2, 0.6],
    [1.1, -0.2, -1.9, 0.4, -0.5, -0.3],
    [-1.9, -0.9, -1.2, -0.5, 0.6, 0.2],
    [2.1, -0.7, 0.7, 0.6, -0.4, -0.7],
    [-0.6, -0.8, 1.9, 0.3, 0.5, 0.4],
    [1.4, -0.9, -0.8, -0.4, -0.7, 0.3],
    [-2.0, -1.6, 1.0, 0.5, 0.2, -0.6],
    [0.2, -1.4, -1.8, -0.6, 0.4, 0.5],

    [1.8, -1.5, 1.2, 0.3, -0.6, -0.4],
    [-1.5, -2.0, -0.7, -0.4, 0.7, 0.2],
    [-0.1, -1.9, 1.6, 0.6, -0.3, 0.5],
    [1.6, -1.8, -1.1, -0.5, -0.4, -0.3],
    [-1.2, -2.3, 0.8, 0.4, 0.5, -0.6],
    [0.9, -2.2, 0.6, -0.3, -0.6, 0.4],
    [-0.4, -2.5, -1.4, 0.5, 0.3, 0.7],
    [1.1, -2.4, -0.6, -0.6, 0.4, -0.5],
  ];

  const fragments: FragmentData[] = [];

  gridCoords.forEach((coord, i) => {
    // 1. Target coordinate in monolithic cube (relative to cubeGroup)
    const cubePos = new THREE.Vector3(coord.ix * S, coord.iy * S, coord.iz * S);
    const cubeRot = new THREE.Euler(0, 0, 0);

    // Major structural block if Manhattan distance <= 2 (faces and mid-edges connect first)
    const isMajor = Math.abs(coord.ix) + Math.abs(coord.iy) + Math.abs(coord.iz) <= 2;

    // 2. Suspended coordinate in Scene 03 Stage 1 (Broken)
    const [scX, scY, scZ, rX, rY, rZ] = scatterOffsets[i % scatterOffsets.length];
    const scatterPos = new THREE.Vector3(scX, scY + 0.25, scZ);
    const scatterRot = new THREE.Euler(rX, rY, rZ);

    // Natural physics: Distance to cube center determines organic magnetic delay
    // Core/face blocks pull in first, edges follow, corners snap in last
    const distToCenter = Math.sqrt(coord.ix * coord.ix + coord.iy * coord.iy + coord.iz * coord.iz);
    const normalizedDist = (distToCenter - 1.0) / (Math.sqrt(3) - 1.0); // 0 (faces) to 1 (corners)
    const delay = normalizedDist * 0.28 + ((i * 7) % 5) * 0.015;

    // Curved flight trajectory: lateral and vertical parabolic arc
    const travel = cubePos.clone().sub(scatterPos);
    const lateral = new THREE.Vector3(-travel.z, 0, travel.x).normalize();
    const sign = (i % 2 === 0 ? 1 : -1);
    const arcMagnitude = 0.42 + ((i % 3) * 0.14);
    const arcOffset = lateral.multiplyScalar(sign * arcMagnitude).add(new THREE.Vector3(0, ((i % 4) - 1.5) * 0.18, 0));

    // 3. Coordinate and scale in intact London Anvil
    let anvilPos: THREE.Vector3;
    let anvilScale: THREE.Vector3;
    let isFacePiece = false;
    let fractureDir: THREE.Vector3;

    if (i < 6) {
      // Top Working Face Plate (6 slabs)
      const u = (i % 3) / 2; // 0, 0.5, 1
      const side = Math.floor(i / 3) === 0 ? 0.18 : -0.18;
      const x = -1.25 + u * 1.65;
      anvilPos = new THREE.Vector3(x, 0.79, side);
      anvilScale = new THREE.Vector3(1.15, 0.32, 0.75);
      isFacePiece = true;
      fractureDir = new THREE.Vector3((u - 0.5) * 1.8, 1.4, side * 2.2).normalize();
    } else if (i < 10) {
      // Conical Horn (4 segments)
      const u = (i - 6) / 3;
      const x = 0.65 + u * 1.05;
      const taper = Math.pow(1 - u, 0.85);
      anvilPos = new THREE.Vector3(x, 0.70 - u * 0.12, 0);
      anvilScale = new THREE.Vector3(0.65, 0.55 * taper + 0.2, 0.65 * taper + 0.2);
      fractureDir = new THREE.Vector3(1.6 + u * 1.2, 0.8, (i % 2 === 0 ? 0.8 : -0.8)).normalize();
    } else if (i < 14) {
      // Waist & Core Body (4 blocks)
      const u = (i - 10) / 3;
      anvilPos = new THREE.Vector3(-0.15 + (u - 0.5) * 0.4, 0.15 + u * 0.35, (i % 2 === 0 ? 0.15 : -0.15));
      anvilScale = new THREE.Vector3(0.85, 0.75, 0.65);
      fractureDir = new THREE.Vector3((u - 0.5) * 1.2, -0.4, (i % 2 === 0 ? 1.2 : -1.2)).normalize();
    } else if (i < 16) {
      // Heel Cantilever Support (2 blocks)
      const side = i === 14 ? 0.16 : -0.16;
      anvilPos = new THREE.Vector3(-0.95, 0.58, side);
      anvilScale = new THREE.Vector3(0.80, 0.45, 0.60);
      fractureDir = new THREE.Vector3(-1.8, 0.5, side * 2.0).normalize();
    } else if (i < 22) {
      // Plinth Base Foundation (6 blocks)
      const u = ((i - 16) % 3) / 2;
      const side = Math.floor((i - 16) / 3) === 0 ? 0.22 : -0.22;
      anvilPos = new THREE.Vector3(-0.75 + u * 1.25, -0.32, side);
      anvilScale = new THREE.Vector3(0.95, 0.65, 0.85);
      fractureDir = new THREE.Vector3((u - 0.5) * 1.5, -1.2, side * 1.8).normalize();
    } else {
      // 4 Flared Base Feet
      const footIdx = i - 22;
      const fx = footIdx % 2 === 0 ? -0.85 : 0.60;
      const fz = footIdx < 2 ? 0.38 : -0.38;
      anvilPos = new THREE.Vector3(fx, -0.44, fz);
      anvilScale = new THREE.Vector3(0.65, 0.55, 0.60);
      fractureDir = new THREE.Vector3(fx > 0 ? 1.6 : -1.6, -1.5, fz > 0 ? 1.5 : -1.5).normalize();
    }

    // Create the fragment mesh
    const mat = isFacePiece ? faceMat : bodyMat;
    const mesh = new THREE.Mesh(baseBoxGeo.clone(), mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Subtle edge bevel line for the block seams (creates the modular puzzle aesthetic without CAD wireframes)
    const edgesGeo = new THREE.EdgesGeometry(baseBoxGeo, 28);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x6e8099,
      transparent: true,
      opacity: 0.22,
    });
    const edgeLines = new THREE.LineSegments(edgesGeo, edgeMat);
    mesh.add(edgeLines);

    // Initial state: starts at anvil fracture positions
    mesh.position.copy(anvilPos);
    mesh.scale.copy(anvilScale);
    anvilFragmentsGroup.add(mesh);

    fragments.push({
      mesh,
      index: i,
      isMajor,
      anvilPos,
      anvilScale,
      fractureDir,
      scatterPos,
      scatterRot,
      cubePos,
      cubeRot,
      arcOffset,
      delay,
    });
  });

  return {
    fragments,
    cubeGroup,
    anvilFragmentsGroup,
    faceMat,
    bodyMat,
  };
}
