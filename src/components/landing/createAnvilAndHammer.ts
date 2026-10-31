import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function cleanAttributes(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  if (!geo.attributes.normal) geo.computeVertexNormals();
  const newGeo = new THREE.BufferGeometry();
  newGeo.setAttribute('position', geo.attributes.position);
  newGeo.setAttribute('normal', geo.attributes.normal);
  if (geo.index) newGeo.setIndex(geo.index);
  return newGeo;
}

/**
 * Builds the authentic Blacksmith Anvil as two separate parts:
 * 1. facePlate: Milled, mirror-polished high-carbon steel working face with hardy & pritchel holes.
 * 2. body: Heavy cast/forged dark iron body (horn, waist, heel support, plinth base, 4 flared feet).
 * 3. combined: Unified geometry for precision contour edges.
 */
export function buildAuthenticAnvilGeometries() {
  const faceParts: THREE.BufferGeometry[] = [];
  const bodyParts: THREE.BufferGeometry[] = [];

  // 1. TOP WORKING FACE PLATE (x: -1.45 to 0.60, y: 0.72 to 0.86, z: -0.37 to 0.37)
  const faceLength = 2.05;
  const faceWidth = 0.74;
  const faceHeight = 0.14;
  const faceGeo = new THREE.BoxGeometry(faceLength, faceHeight, faceWidth, 8, 2, 6);
  faceGeo.translate(-0.425, 0.79, 0);
  faceParts.push(cleanAttributes(faceGeo));

  const faceMerged = BufferGeometryUtils.mergeGeometries(faceParts, false);
  faceMerged.computeVertexNormals();

  // 2. CONICAL HORN (Tapers from throat at x = 0.60 to tip at x = 1.82)
  const hornSegmentsX = 16;
  const hornSegmentsRadial = 20;
  const hornPositions: number[] = [];
  const hornIndices: number[] = [];

  for (let i = 0; i <= hornSegmentsX; i++) {
    const u = i / hornSegmentsX;
    const x = 0.60 + u * 1.22;
    const taper = Math.pow(1 - u, 0.85);
    const ry = 0.035 + 0.225 * taper;
    const rz = 0.035 + 0.285 * taper;
    const centerY = (0.84 - 0.04 * u) - ry;

    for (let j = 0; j < hornSegmentsRadial; j++) {
      const theta = (j / hornSegmentsRadial) * Math.PI * 2;
      const vy = centerY + Math.cos(theta) * ry;
      const vz = Math.sin(theta) * rz;
      hornPositions.push(x, vy, vz);
    }
  }

  for (let i = 0; i < hornSegmentsX; i++) {
    for (let j = 0; j < hornSegmentsRadial; j++) {
      const nextJ = (j + 1) % hornSegmentsRadial;
      const p1 = i * hornSegmentsRadial + j;
      const p2 = i * hornSegmentsRadial + nextJ;
      const p3 = (i + 1) * hornSegmentsRadial + j;
      const p4 = (i + 1) * hornSegmentsRadial + nextJ;

      hornIndices.push(p1, p3, p2);
      hornIndices.push(p2, p3, p4);
    }
  }

  const tipCenterIndex = hornPositions.length / 3;
  hornPositions.push(1.825, 0.80 - 0.035, 0);
  const lastRingStart = hornSegmentsX * hornSegmentsRadial;
  for (let j = 0; j < hornSegmentsRadial; j++) {
    const nextJ = (j + 1) % hornSegmentsRadial;
    hornIndices.push(lastRingStart + j, tipCenterIndex, lastRingStart + nextJ);
  }

  const hornGeo = new THREE.BufferGeometry();
  hornGeo.setAttribute('position', new THREE.Float32BufferAttribute(hornPositions, 3));
  hornGeo.setIndex(hornIndices);
  hornGeo.computeVertexNormals();
  bodyParts.push(cleanAttributes(hornGeo));

  // 3. SCULPTED WAIST & BODY (y: -0.15 to 0.72)
  const waistSegmentsY = 16;
  const waistRadial = 20;
  const waistPositions: number[] = [];
  const waistIndices: number[] = [];

  for (let i = 0; i <= waistSegmentsY; i++) {
    const v = i / waistSegmentsY;
    const y = -0.15 + v * 0.87;
    const distFromWaist = (v - 0.40) / 0.60;
    const curvature = Math.pow(Math.abs(distFromWaist), 2.0);
    const rx = 0.38 + curvature * 0.42;
    const rz = 0.22 + curvature * 0.16;
    const cx = -0.15 + (v > 0.4 ? (v - 0.4) * -0.25 : 0);

    for (let j = 0; j < waistRadial; j++) {
      const angle = (j / waistRadial) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const signCos = Math.sign(cosA);
      const signSin = Math.sign(sinA);
      const p = 3.0;
      const px = Math.pow(Math.abs(cosA), 2 / p) * rx * signCos;
      const pz = Math.pow(Math.abs(sinA), 2 / p) * rz * signSin;
      waistPositions.push(cx + px, y, pz);
    }
  }

  for (let i = 0; i < waistSegmentsY; i++) {
    for (let j = 0; j < waistRadial; j++) {
      const nextJ = (j + 1) % waistRadial;
      const p1 = i * waistRadial + j;
      const p2 = i * waistRadial + nextJ;
      const p3 = (i + 1) * waistRadial + j;
      const p4 = (i + 1) * waistRadial + nextJ;

      waistIndices.push(p1, p3, p2);
      waistIndices.push(p2, p3, p4);
    }
  }

  const waistGeo = new THREE.BufferGeometry();
  waistGeo.setAttribute('position', new THREE.Float32BufferAttribute(waistPositions, 3));
  waistGeo.setIndex(waistIndices);
  waistGeo.computeVertexNormals();
  bodyParts.push(cleanAttributes(waistGeo));

  // Recessed side panels on front & back (+Z and -Z)
  const frontPanel = new THREE.BoxGeometry(0.58, 0.32, 0.05);
  frontPanel.translate(-0.15, 0.22, 0.24);
  bodyParts.push(cleanAttributes(frontPanel));

  const backPanel = new THREE.BoxGeometry(0.58, 0.32, 0.05);
  backPanel.translate(-0.15, 0.22, -0.24);
  bodyParts.push(cleanAttributes(backPanel));

  // Heel cantilever support (underneath heel block)
  const heelSupport = new THREE.BoxGeometry(0.75, 0.24, 0.62);
  heelSupport.translate(-1.075, 0.60, 0);
  bodyParts.push(cleanAttributes(heelSupport));

  // Plinth base
  const baseFlared = new THREE.BoxGeometry(1.65, 0.40, 0.92, 4, 2, 4);
  baseFlared.translate(-0.12, -0.35, 0);
  bodyParts.push(cleanAttributes(baseFlared));

  // 4 Flared feet
  const footPositions = [
    [-0.82, -0.42, 0.40],
    [0.58, -0.42, 0.40],
    [-0.82, -0.42, -0.40],
    [0.58, -0.42, -0.40],
  ];

  footPositions.forEach(([fx, fy, fz]) => {
    const footBlock = new THREE.BoxGeometry(0.32, 0.26, 0.24);
    footBlock.translate(fx, fy, fz);
    bodyParts.push(cleanAttributes(footBlock));
  });

  const bodyMerged = BufferGeometryUtils.mergeGeometries(bodyParts, false);
  bodyMerged.computeVertexNormals();

  const combined = BufferGeometryUtils.mergeGeometries([...faceParts, ...bodyParts], false);
  combined.computeVertexNormals();

  return {
    facePlate: faceMerged,
    body: bodyMerged,
    combined,
  };
}

/**
 * Builds the Blacksmith's Sledge Hammer:
 * - Natural pivot at grip end (x = 0, y = 0, z = 0).
 * - Handle extends from x = 0 along +X to headX = 2.10.
 * - Solid rectangular forged steel head mounted at headX = 2.10:
 *   - Striking face is on bottom (-Y).
 *   - Beveled peen is on top (+Y).
 *   - Width in X: 0.44, Height in Y: 0.54, Depth in Z: 0.36.
 */
export function buildAuthenticHammerGeometries() {
  const headParts: THREE.BufferGeometry[] = [];
  const strikeFaceParts: THREE.BufferGeometry[] = [];
  const headX = 1.85;

  // Main rectangular head block: height 0.52, width 0.44, depth 0.36
  const mainBlock = new THREE.BoxGeometry(0.44, 0.52, 0.36, 2, 4, 2);
  mainBlock.translate(headX, 0, 0);
  headParts.push(cleanAttributes(mainBlock));

  // Polished flat rectangular striking face at bottom (-Y)
  const bottomStrikingFace = new THREE.BoxGeometry(0.40, 0.05, 0.32);
  bottomStrikingFace.translate(headX, -0.27, 0);
  strikeFaceParts.push(cleanAttributes(bottomStrikingFace));

  // Top peen at +Y
  const topFace = new THREE.BoxGeometry(0.40, 0.05, 0.32);
  topFace.translate(headX, 0.27, 0);
  headParts.push(cleanAttributes(topFace));

  // Central eye collar reinforcement around handle eye at headX
  const eyeCollar = new THREE.BoxGeometry(0.48, 0.32, 0.38);
  eyeCollar.translate(headX, 0, 0);
  headParts.push(cleanAttributes(eyeCollar));

  const headMerged = BufferGeometryUtils.mergeGeometries(headParts, false);
  headMerged.computeVertexNormals();

  const strikeFaceMerged = BufferGeometryUtils.mergeGeometries(strikeFaceParts, false);
  strikeFaceMerged.computeVertexNormals();

  // HANDLE: Extends from grip at x = 0 along +X to headX + 0.16
  const handleParts: THREE.BufferGeometry[] = [];
  const handleLength = headX + 0.16;
  const handleShaft = new THREE.BoxGeometry(handleLength, 0.11, 0.15, 12, 2, 2);
  handleShaft.translate(handleLength / 2, 0, 0);
  handleParts.push(cleanAttributes(handleShaft));

  const wedge = new THREE.BoxGeometry(0.04, 0.03, 0.10);
  wedge.translate(headX + 0.14, 0, 0);
  handleParts.push(cleanAttributes(wedge));

  const grip = new THREE.BoxGeometry(0.38, 0.14, 0.18);
  grip.translate(0.22, 0, 0);
  handleParts.push(cleanAttributes(grip));

  const handleMerged = BufferGeometryUtils.mergeGeometries(handleParts, false);
  handleMerged.computeVertexNormals();

  return {
    head: headMerged,
    strikeFace: strikeFaceMerged,
    handle: handleMerged,
    headX,
  };
}
