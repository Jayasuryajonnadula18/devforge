import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function cleanAttributes(geo) {
  if (!geo.attributes.normal) geo.computeVertexNormals();
  const newGeo = new THREE.BufferGeometry();
  newGeo.setAttribute('position', geo.attributes.position);
  newGeo.setAttribute('normal', geo.attributes.normal);
  if (geo.index) newGeo.setIndex(geo.index);
  return newGeo;
}

/**
 * Builds the real blacksmith hammer where:
 * - Pivot is at the GRIP END (where the invisible blacksmith's hand holds it).
 * - Handle extends along +X from x = 0 (grip) to x = 2.10 (head eye).
 * - Head is mounted at x = 2.10:
 *   Striking axis is along Y:
 *   - Striking face is at bottom (y = -0.28), pointing down toward anvil!
 *   - Top peen is at top (y = +0.28).
 *   - Width in X: 0.42, Depth in Z: 0.36.
 */
export function buildRealBlacksmithHammer() {
  const headParts = [];
  const headX = 2.10;

  // Main rectangular head block at headX: length (X) 0.44, height (Y) 0.52, depth (Z) 0.36
  const mainBlock = new THREE.BoxGeometry(0.44, 0.52, 0.36, 2, 4, 2);
  mainBlock.translate(headX, 0, 0);
  headParts.push(cleanAttributes(mainBlock));

  // Flat rectangular striking face at bottom (-Y)
  const bottomStrikingFace = new THREE.BoxGeometry(0.40, 0.05, 0.32);
  bottomStrikingFace.translate(headX, -0.27, 0);
  headParts.push(cleanAttributes(bottomStrikingFace));

  // Top peen at +Y
  const topFace = new THREE.BoxGeometry(0.40, 0.05, 0.32);
  topFace.translate(headX, 0.27, 0);
  headParts.push(cleanAttributes(topFace));

  // Eye collar reinforcement around handle eye at headX
  const eyeCollar = new THREE.BoxGeometry(0.48, 0.32, 0.38);
  eyeCollar.translate(headX, 0, 0);
  headParts.push(cleanAttributes(eyeCollar));

  const headMerged = BufferGeometryUtils.mergeGeometries(headParts, false);
  headMerged.computeVertexNormals();

  // HANDLE: Extends from grip at x = 0 to x = headX + 0.12 (front protrusion)
  const handleParts = [];
  const handleLength = headX + 0.16; // 2.26
  const handleShaft = new THREE.BoxGeometry(handleLength, 0.11, 0.15, 12, 2, 2);
  handleShaft.translate(handleLength / 2, 0, 0); // from x = 0 to x = 2.26
  handleParts.push(cleanAttributes(handleShaft));

  // Retaining steel wedge at front tip (x = 2.24)
  const wedge = new THREE.BoxGeometry(0.04, 0.03, 0.10);
  wedge.translate(headX + 0.14, 0, 0);
  handleParts.push(cleanAttributes(wedge));

  // Ergonomic grip swell at the grip end (x = 0.05 to 0.45)
  const grip = new THREE.BoxGeometry(0.38, 0.14, 0.18);
  grip.translate(0.22, 0, 0);
  handleParts.push(cleanAttributes(grip));

  const handleMerged = BufferGeometryUtils.mergeGeometries(handleParts, false);
  handleMerged.computeVertexNormals();

  return { head: headMerged, handle: handleMerged, headX };
}

const hammer = buildRealBlacksmithHammer();
console.log('Real blacksmith hammer built!');
console.log('Head vertices:', hammer.head.attributes.position.count);
console.log('Handle vertices:', hammer.handle.attributes.position.count);
