import * as THREE from 'three';

/**
 * Procedural Industrial Textures for Authentic Forged Steel, Milled Metal, and Hardwood
 * Generated purely via HTML5 2D Canvas — 0 external asset requests, zero network latency.
 */

// 1. Brushed Milled Steel Texture (Hairline CNC grinding striations)
export function createBrushedSteelTexture(size = 512): {
  diffuse: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base metal gray
  ctx.fillStyle = '#8a97a8';
  ctx.fillRect(0, 0, size, size);

  // Hairline milling striations
  for (let i = 0; i < 1800; i++) {
    const y = Math.random() * size;
    const len = size * (0.3 + Math.random() * 0.7);
    const x = Math.random() * size;
    const brightness = Math.floor(115 + Math.random() * 70);
    const alpha = 0.04 + Math.random() * 0.08;

    ctx.strokeStyle = `rgba(${brightness}, ${brightness + 4}, ${brightness + 10}, ${alpha})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;

  // Roughness Map (Micro-scratches reflect light anisotropically)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#3a3a3a'; // Base low roughness (glossy milled)
  rCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 1200; i++) {
    const y = Math.random() * size;
    const len = size * (0.2 + Math.random() * 0.8);
    const x = Math.random() * size;
    const val = Math.floor(45 + Math.random() * 65);
    rCtx.strokeStyle = `rgba(${val}, ${val}, ${val}, 0.12)`;
    rCtx.lineWidth = 0.8 + Math.random() * 1.5;
    rCtx.beginPath();
    rCtx.moveTo(x, y);
    rCtx.lineTo(x + len, y);
    rCtx.stroke();
  }

  const roughness = new THREE.CanvasTexture(roughCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;

  const bump = diffuse; // Can share high-frequency hairline bump

  return { diffuse, roughness, bump };
}

// 2. Cast Forged Iron Texture (Heavy industrial cast micro-pebble stipple)
export function createCastIronTexture(size = 512): {
  diffuse: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base cast slate-steel
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, size, size);

  // High-frequency stipple noise for authentic cast iron texture
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 36;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 2));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 6));
  }
  ctx.putImageData(imgData, 0, 0);

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(2, 2);

  // Bump texture for tactile micro-roughness
  const bump = diffuse;

  // Roughness map (matte cast finish)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#656565';
  rCtx.fillRect(0, 0, size, size);
  const rData = rCtx.getImageData(0, 0, size, size);
  for (let i = 0; i < rData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    const v = Math.min(255, Math.max(0, 105 + noise));
    rData.data[i] = v;
    rData.data[i + 1] = v;
    rData.data[i + 2] = v;
  }
  rCtx.putImageData(rData, 0, 0);

  const roughness = new THREE.CanvasTexture(roughCanvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;
  roughness.repeat.set(2, 2);

  return { diffuse, roughness, bump };
}

// 3. Hickory Hardwood Texture (Longitudinal grain pores for hammer handle)
export function createHickoryHardwoodTexture(size = 512): {
  diffuse: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm hickory base
  ctx.fillStyle = '#8c6239';
  ctx.fillRect(0, 0, size, size);

  // Longitudinal wood grain lines
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const h = size * (0.25 + Math.random() * 0.75);
    const alpha = 0.06 + Math.random() * 0.12;
    const isDark = Math.random() > 0.45;
    const tone = isDark ? 70 + Math.random() * 40 : 160 + Math.random() * 45;

    ctx.strokeStyle = `rgba(${tone}, ${Math.floor(tone * 0.72)}, ${Math.floor(tone * 0.42)}, ${alpha})`;
    ctx.lineWidth = 0.6 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y + h);
    ctx.stroke();
  }

  const diffuse = new THREE.CanvasTexture(canvas);
  diffuse.wrapS = THREE.RepeatWrapping;
  diffuse.wrapT = THREE.RepeatWrapping;
  diffuse.repeat.set(1, 3);

  // Roughness map (semi-matte oiled wood)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#888888';
  rCtx.fillRect(0, 0, size, size);
  const roughness = new THREE.CanvasTexture(roughCanvas);

  return { diffuse, roughness };
}

// 4. Studio Environment Gradient Map (Simulates softbox studio lighting on metallic surfaces)
export function createStudioEnvironment(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Smooth vertical studio gradient (cool ambient sky, bright white softbox strip, dark grounded floor)
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0.0, '#3a4b60'); // Soft sky fill
  grad.addColorStop(0.35, '#ffffff'); // Primary overhead softbox
  grad.addColorStop(0.50, '#94a7bd'); // Horizon fill
  grad.addColorStop(0.70, '#1a202c'); // Ground shadow transition
  grad.addColorStop(1.0, '#0a0d14'); // Studio floor

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Add subtle lateral softbox highlights
  const gradH = ctx.createRadialGradient(size * 0.3, size * 0.35, 10, size * 0.3, size * 0.35, size * 0.45);
  gradH.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  gradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, size, size);

  const env = new THREE.CanvasTexture(canvas);
  env.mapping = THREE.EquirectangularReflectionMapping;
  return env;
}
