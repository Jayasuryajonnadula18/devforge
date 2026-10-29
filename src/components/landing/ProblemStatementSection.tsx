'use client';

import React from 'react';

/**
 * DEVFORGE — PROBLEM SECTION: CONCEPTUAL ASYMMETRIC DIPTYCH
 *
 * Tension:
 * Writing code that works is not the same as understanding how software works.
 *
 * Spatial Architecture:
 * - Upper-Left Anchor: The pedagogical limitation ("Tutorials teach you syntax..."),
 *   set in high-contrast white with strong architectural line breaks.
 * - Lower-Right Anchor: The engineering reality ("You can write a query that works..."),
 *   offset across a central corridor of intentional negative space and set in reflective, disciplined grey.
 * - The spatial distance and vertical displacement physically embody the divide between writing isolated code
 *   and understanding production systems.
 * - 100% typography, alignment, and whitespace. Zero decorative cards, borders, or artificial graphics.
 */
export const ProblemStatementSection: React.FC = () => {
  return (
    <section
      id="problem"
      aria-label="Problem Statement"
      className="relative z-10 w-full min-h-[75vh] flex flex-col justify-center py-28 sm:py-36 lg:py-44 px-6 sm:px-12 lg:px-20 bg-[#06070a] text-[#f5f4f0]"
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* ================= UPPER-LEFT ANCHOR: THE SYNTAX LIMITATION ================= */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-sans font-medium tracking-[-0.03em] leading-[1.2] text-[#f5f4f0]">
              Tutorials teach you syntax,<br className="hidden sm:inline" /> but not how it matters<br className="hidden sm:inline" /> in the real world.
            </h2>
          </div>

          {/* ================= LOWER-RIGHT ANCHOR: THE ENGINEERING REALITY ================= */}
          <div className="lg:col-span-5 lg:col-start-8 lg:mt-24 xl:mt-32">
            <div className="space-y-5 sm:space-y-6 text-xl sm:text-2xl lg:text-[24px] xl:text-[26px] font-sans font-normal tracking-[-0.015em] leading-[1.4] text-[#E2E4E8]">
              <p>
                You can write a query that works.
              </p>
              <p>
                Understanding how it behaves in a real application is a different skill.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
