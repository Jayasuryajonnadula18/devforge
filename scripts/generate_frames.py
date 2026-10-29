import os
import math
from PIL import Image, ImageEnhance, ImageFilter

src_dir = r"C:\Users\MAHESH\.gemini\antigravity\brain\134c1ccb-a9af-41b4-a9ba-c0786c8f1426"
out_dir = r"C:\Users\MAHESH\Downloads\daemon v0.1\devforge-platform\public\anime-frames"
os.makedirs(out_dir, exist_ok=True)

# Load master keyframe images
img_problem = Image.open(os.path.join(src_dir, 'anime_problem_png_1793203955396.jpg')).convert('RGB')
img_solution = Image.open(os.path.join(src_dir, 'anime_solution_png_1793204022276.jpg')).convert('RGB')
img_arch = Image.open(os.path.join(src_dir, 'anime_architecture_png_1793204043802.jpg')).convert('RGB')
img_finale = Image.open(os.path.join(src_dir, 'anime_finale_png_1793204070407.jpg')).convert('RGB')

W, H = 1280, 720
img_problem = img_problem.resize((W, H), Image.Resampling.LANCZOS)
img_solution = img_solution.resize((W, H), Image.Resampling.LANCZOS)
img_arch = img_arch.resize((W, H), Image.Resampling.LANCZOS)
img_finale = img_finale.resize((W, H), Image.Resampling.LANCZOS)

def smoothstep(x):
    return x * x * (3 - 2 * x)

def zoom_and_crop(img, factor, center=(0.5, 0.5)):
    new_w = int(W * factor)
    new_h = int(H * factor)
    resized = img.resize((new_w, new_h), Image.Resampling.BILINEAR)
    cx, cy = int(new_w * center[0]), int(new_h * center[1])
    left = max(0, min(new_w - W, cx - W // 2))
    top = max(0, min(new_h - H, cy - H // 2))
    return resized.crop((left, top, left + W, top + H))

TOTAL_FRAMES = 72
segment_len = 18

print(f"Generating {TOTAL_FRAMES} anime scroll frames...")

for frame_idx in range(TOTAL_FRAMES):
    seg = frame_idx // segment_len
    seg_progress = (frame_idx % segment_len) / (segment_len - 1)
    eased = smoothstep(seg_progress)

    if seg == 0:
        # Act 1: The Problem (Tutorial hell push-in + glitch at end)
        zoom = 1.0 + 0.18 * eased
        base = zoom_and_crop(img_problem, zoom, center=(0.60, 0.45))
        if seg_progress > 0.7:
            glitch_alpha = (seg_progress - 0.7) / 0.3
            enhancer = ImageEnhance.Color(base)
            base = enhancer.enhance(1.0 - 0.4 * glitch_alpha)
            r, g, b = base.split()
            r_shift = Image.new('L', (W, H))
            shift_px = int(glitch_alpha * 12)
            r_cropped = r.crop((shift_px, 0, W, H))
            r_shift.paste(r_cropped, (0, 0))
            base = Image.merge('RGB', (r_shift, g, b))
        frame = base

    elif seg == 1:
        # Transition: Problem -> Solution (Forge)
        zoom_from = 1.18 + 0.05 * eased
        zoom_to = 1.0 + 0.12 * (1.0 - eased)
        img_a = zoom_and_crop(img_problem, zoom_from, center=(0.60, 0.45))
        img_b = zoom_and_crop(img_solution, zoom_to, center=(0.50, 0.50))
        frame = Image.blend(img_a, img_b, eased)
        if 0.3 < eased < 0.7:
            flare_strength = math.sin((eased - 0.3) / 0.4 * math.pi) * 0.25
            enhancer = ImageEnhance.Brightness(frame)
            frame = enhancer.enhance(1.0 + flare_strength)

    elif seg == 2:
        # Transition: Solution -> Architecture (Core Docking)
        zoom_from = 1.12 + 0.06 * eased
        zoom_to = 1.0 + 0.15 * (1.0 - eased)
        img_a = zoom_and_crop(img_solution, zoom_from, center=(0.50, 0.50))
        img_b = zoom_and_crop(img_arch, zoom_to, center=(0.58, 0.48))
        frame = Image.blend(img_a, img_b, eased)
        if 0.35 < eased < 0.65:
            pulse = math.sin((eased - 0.35) / 0.3 * math.pi) * 0.3
            enhancer = ImageEnhance.Color(frame)
            frame = enhancer.enhance(1.0 + pulse)

    else:
        # Transition: Architecture -> Finale (Sunrise Metropolis)
        zoom_from = 1.15 + 0.08 * eased
        zoom_to = 1.0 + 0.10 * (1.0 - eased)
        img_a = zoom_and_crop(img_arch, zoom_from, center=(0.58, 0.48))
        img_b = zoom_and_crop(img_finale, zoom_to, center=(0.55, 0.45))
        frame = Image.blend(img_a, img_b, eased)
        if 0.2 < eased < 0.8:
            warmth = math.sin((eased - 0.2) / 0.6 * math.pi) * 0.15
            enhancer = ImageEnhance.Brightness(frame)
            frame = enhancer.enhance(1.0 + warmth)

    frame_path = os.path.join(out_dir, f"frame_{frame_idx:03d}.jpg")
    frame.save(frame_path, quality=82)

print(f"All {TOTAL_FRAMES} frames generated successfully in {out_dir}")
