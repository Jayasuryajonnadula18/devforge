'use client';

import React from 'react';
import { ArchitectureNode, ArchitectureEdge } from '../../types';
import { ArrowDown, CornerDownRight } from 'lucide-react';

interface ArchitectureViewProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  systemDescription: string;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  nodes,
  edges,
  systemDescription,
}) => {
  return (
    <div className="space-y-6 text-xs">
      {/* System Context Narrative */}
      <div className="border-l border-white/20 pl-4 space-y-1 py-1">
        <span className="text-[11px] font-medium text-neutral-400 block">
          Architectural Scope
        </span>
        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
          {systemDescription}
        </p>
      </div>

      {/* Structural Schematic Pipeline (Hairline schematic, no boxes) */}
      <div className="space-y-3 pt-2">
        <span className="text-[11px] font-medium text-neutral-400 block">
          Subsystem Execution Schematic
        </span>

        <div className="space-y-0 divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
          {nodes.map((node, index) => {
            const outgoingEdge = edges.find(e => e.from === node.id);

            return (
              <div key={node.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-500 text-xs font-medium">{String(index + 1).padStart(2, '0')}.</span>
                    <span className="text-white font-medium text-xs">
                      {node.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {node.type}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-400 pl-6 leading-relaxed">
                  {node.description}
                </p>

                {outgoingEdge && (
                  <div className="flex items-center space-x-2 pt-1 pl-6 text-xs text-neutral-400">
                    <CornerDownRight className="w-3 h-3 text-neutral-500" />
                    <span>
                      Dispatches to {outgoingEdge.label}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
