'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CineDnaNode, CineDnaEdge } from '@/lib/schemas/cineDna.schema';
import { useCineDnaForceLayout } from '@/hooks/useCineDnaForceLayout';

interface CineDnaCanvasProps {
  nodes: CineDnaNode[];
  edges: CineDnaEdge[];
  onSelectNode: (node: CineDnaNode) => void;
}

export function CineDnaCanvas({ nodes, edges, onSelectNode }: CineDnaCanvasProps) {
  const width = 760;
  const height = 480;

  const {
    positionedNodes,
    selectedNodeId,
    hoveredNodeId,
    setSelectedNodeId,
    setHoveredNodeId,
  } = useCineDnaForceLayout(nodes, edges, width, height);

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  return (
    <div className="relative w-full h-[480px] rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0,transparent_70%)] pointer-events-none" />

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none cursor-crosshair">
        {/* Render Edges */}
        <g className="edges">
          {edges.map((edge) => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return null;

            const isHighlighted =
              hoveredNodeId === edge.source ||
              hoveredNodeId === edge.target ||
              selectedNodeId === edge.source ||
              selectedNodeId === edge.target;

            return (
              <g key={edge.id}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? '#06B6D4' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? '4,4' : undefined}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </g>

        {/* Render Nodes */}
        <g className="nodes">
          {positionedNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const color = node.metadata.colorHex || '#FF9F0A';
            const isRoot = node.type === 'movie';

            return (
              <g
                key={node.id}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  onSelectNode(node);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer group"
              >
                {/* Node Outer Glow Halo */}
                {(isSelected || isHovered || isRoot) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 10}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    opacity={0.4}
                    className="animate-pulse"
                  />
                )}

                {/* Node Main Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="#0B0E14"
                  stroke={isSelected ? '#FFFFFF' : color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                {/* Inner Glow Gradient */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius - 6}
                  fill={color}
                  opacity={isRoot ? 0.35 : 0.2}
                />

                {/* Node Label Text */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isRoot ? 12 : 10}
                  fontWeight={isRoot ? '900' : '700'}
                  className="pointer-events-none"
                >
                  {node.label.length > 12 ? `${node.label.slice(0, 11)}..` : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
