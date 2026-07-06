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
  const seatSize = 32;
  const radius = 8;

  const getSeatColor = () => {
    if (isOccupied) return 'rgba(255, 255, 255, 0.03)';
    if (isSelected) return auraColor;
    if (isLobbyUserSelecting) return '#22D3EE';
    return 'rgba(255, 255, 255, 0.1)';
  };

  const getStrokeColor = () => {
    if (isOccupied) return 'rgba(255, 255, 255, 0.12)';
    if (isSelected) return auraColor;
    if (isLobbyUserSelecting) return '#22D3EE';
    return 'rgba(255, 255, 255, 0.15)';
  };

  // Hardware-accelerated CSS drop-shadow instead of expensive custom SVG filter pipelines
  const getFilterStyle = () => {
    if (isSelected) return `drop-shadow(0 0 6px ${auraColor})`;
    if (isLobbyUserSelecting) return 'drop-shadow(0 0 6px #22D3EE)';
    return undefined;
  };

  const isDisabled = isOccupied || isLobbyUserSelecting;

  const getCursorClass = () => {
    if (isOccupied) return 'cursor-not-allowed opacity-40';
    if (isLobbyUserSelecting) return 'cursor-not-allowed';
    return 'cursor-pointer';
  };

  return (
    <motion.g
      style={{ 
        x, 
        y, 
        originX: `${seatSize / 2}px`, 
        originY: `${seatSize / 2}px`,
        filter: getFilterStyle()
      }}
      onHoverStart={() => !isDisabled && onHover(seatId)}
      onHoverEnd={() => !isDisabled && onHover(null)}
      onTap={() => !isDisabled && onClick()}
      whileHover={isDisabled ? {} : { scale: 1.15 }}
      whileTap={isDisabled ? {} : { scale: 0.9 }}
      className={getCursorClass()}
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
            className="pointer-events-none blur-[4px]"
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
