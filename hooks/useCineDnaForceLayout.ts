'use client';

import { useMemo, useState } from 'react';
import { CineDnaNode, CineDnaEdge } from '@/lib/schemas/cineDna.schema';

export interface PositionedNode extends CineDnaNode {
  x: number;
  y: number;
  radius: number;
}

export function useCineDnaForceLayout(
  nodes: CineDnaNode[],
  edges: CineDnaEdge[],
  width = 800,
  height = 500
) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const positionedNodes: PositionedNode[] = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];

    const centerX = width / 2;
    const centerY = height / 2;
    const coreNode = nodes.find((n) => n.type === 'movie') || nodes[0];
    const peripheralNodes = nodes.filter((n) => n.id !== coreNode.id);

    const radiusDist = Math.min(width, height) * 0.35;
    const angleStep = (2 * Math.PI) / (peripheralNodes.length || 1);

    const result: PositionedNode[] = [
      {
        ...coreNode,
        x: centerX,
        y: centerY,
        radius: 46,
      },
    ];

    peripheralNodes.forEach((node, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radiusDist * Math.cos(angle);
      const y = centerY + radiusDist * Math.sin(angle);
      result.push({
        ...node,
        x,
        y,
        radius: 34,
      });
    });

    return result;
  }, [nodes, width, height]);

  const activeNode = useMemo(() => {
    const id = selectedNodeId || hoveredNodeId;
    if (!id) return positionedNodes.find((n) => n.type === 'movie') || positionedNodes[0] || null;
    return positionedNodes.find((n) => n.id === id) || null;
  }, [positionedNodes, selectedNodeId, hoveredNodeId]);

  return {
    positionedNodes,
    edges,
    selectedNodeId,
    hoveredNodeId,
    activeNode,
    setSelectedNodeId,
    setHoveredNodeId,
  };
}
