'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SVGSeatProps {
  seatId: string;
  row: string;
  col: number;
  x: number;
  y: number;
  isOccupied: boolean;
  isSelected: boolean;
  isLobbyUserSelecting: boolean;
  showHeatmap: boolean;
  popularity: number;
  auraColor: string;
  onHover: (seatId: string | null) => void;
  onClick: () => void;
}

export default function SVGSeat({
  seatId,
  row,
  col,
  x,
  y,
  isOccupied,
  isSelected,
  isLobbyUserSelecting,
  showHeatmap,
  popularity,
  auraColor,
  onHover,
  onClick,
}: SVGSeatProps) {
  // Determine colors and styles
  const seatSize = 32;
  const radius = 8;

  const getSeatColor = () => {
    if (isOccupied) return 'rgba(255, 255, 255, 0.05)';
    if (isSelected) return auraColor;
    if (isLobbyUserSelecting) return '#22D3EE'; // Cyan-400
    return 'rgba(255, 255, 255, 0.1)';
  };

  const getStrokeColor = () => {
    if (isOccupied) return 'rgba(255, 255, 255, 0.05)';
    if (isSelected) return auraColor;
    if (isLobbyUserSelecting) return '#22D3EE';
    return 'rgba(255, 255, 255, 0.15)';
  };

  const getFilter = () => {
    if (isSelected) return 'url(#glow-selected)';
    if (isLobbyUserSelecting) return 'url(#glow-partner)';
    return undefined;
  };

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => !isOccupied && onHover(seatId)}
      onMouseLeave={() => !isOccupied && onHover(null)}
      onClick={() => !isOccupied && onClick()}
      whileHover={isOccupied ? {} : { scale: 1.15, zIndex: 10 }}
      whileTap={isOccupied ? {} : { scale: 0.9 }}
      className={isOccupied ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}
      style={{ originX: `${seatSize / 2}px`, originY: `${seatSize / 2}px` }}
    >
      {/* Heatmap Layer */}
      <AnimatePresence>
        {showHeatmap && !isOccupied && !isSelected && (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: popularity * 0.7 }}
            exit={{ opacity: 0 }}
            width={seatSize + 6}
            height={seatSize + 6}
            x={-3}
            y={-3}
            rx={radius + 2}
            ry={radius + 2}
            fill="#F97316"
            filter="url(#glow-heatmap)"
            className="pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Seat Shape (Cinematic high-tech console style) */}
      <rect
        width={seatSize}
        height={seatSize}
        rx={radius}
        ry={radius}
        fill={getSeatColor()}
        stroke={getStrokeColor()}
        strokeWidth={1.5}
        filter={getFilter()}
        className="transition-colors duration-300"
      />

      {/* Inner console details (Visual premium feel) */}
      {!isOccupied && (
        <rect
          width={seatSize - 10}
          height={4}
          x={5}
          y={seatSize - 8}
          rx={1}
          ry={1}
          fill="rgba(255, 255, 255, 0.15)"
        />
      )}

      {/* Seat code rendered inside */}
      <text
        x={seatSize / 2}
        y={seatSize / 2 + 3}
        textAnchor="middle"
        fontSize="8px"
        fontWeight="black"
        fill="rgba(255, 255, 255, 0.4)"
        className="select-none pointer-events-none font-sans"
      >
        {row}{col}
      </text>

      {/* Active partner ping indicator */}
      {isLobbyUserSelecting && (
        <circle cx={seatSize - 2} cy={2} r={3} fill="#22D3EE" className="animate-ping" />
      )}
    </motion.g>
  );
}
