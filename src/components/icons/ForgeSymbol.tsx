'use client';

import React from 'react';

interface ForgeSymbolProps {
  className?: string;
  size?: number;
}

/**
 * ForgeSymbol:
 * DevForge iconic brand mark:
 * Blacksmith hammer striking down upon the anvil with kinetic sparks bursting upward.
 * Exactly matches user reference (media_1793192008723_2242d0da.png).
 */
export const ForgeSymbol: React.FC<ForgeSymbolProps> = ({
  className = 'w-7 h-7 text-white',
  size = 28,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 860 740"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 1. Blacksmith Hammer Poised at Angle */}
      <path
        d="M 356.0 94.0 L 365.0 98.0 L 447.0 177.0 L 482.0 288.0 L 404.0 322.0 L 363.0 255.0 L 357.0 246.0 L 353.0 245.0 L 113.0 352.0 L 69.0 369.0 L 51.0 328.0 L 334.0 204.0 L 336.0 200.0 L 310.0 114.0 L 355.0 95.0 Z"
        fill="currentColor"
      />

      {/* 2. Kinetic Impact Sparks Bursting Upward-Right */}
      <path
        d="M 682.0 48.0 L 650.0 190.0 L 657.0 190.0 L 765.0 133.0 L 692.0 237.0 L 802.0 242.0 L 606.0 319.0 L 603.0 319.0 L 601.0 273.0 L 503.0 319.0 L 549.0 184.0 L 561.0 231.0 L 565.0 231.0 L 682.0 49.0 Z"
        fill="currentColor"
      />

      {/* 3. Blacksmith Anvil (Base, Step, Horn and Plinth) */}
      <path
        d="M 340.0 352.0 L 713.0 352.0 L 713.0 398.0 L 763.0 416.0 L 807.0 447.0 L 776.0 473.0 L 747.0 490.0 L 713.0 505.0 L 713.0 550.0 L 611.0 551.0 L 634.0 597.0 L 662.0 632.0 L 710.0 674.0 L 753.0 674.0 L 753.0 701.0 L 300.0 701.0 L 300.0 674.0 L 340.0 674.0 L 344.0 671.0 L 379.0 637.0 L 401.0 610.0 L 421.0 580.0 L 433.0 551.0 L 340.0 550.0 L 340.0 499.0 L 303.0 487.0 L 276.0 473.0 L 250.0 454.0 L 218.0 420.0 L 198.0 383.0 L 339.0 383.0 L 340.0 353.0 Z"
        fill="currentColor"
      />
    </svg>
  );
};
