import React from 'react';
import { RiasecScores, RiasecDimension } from '../types/riasec';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import { HEXAGON_ORDER } from '../utils/riasecMatching';
import { useLanguage } from '../context/LanguageContext';

interface RiasecRadarChartProps {
  userScores: RiasecScores;
  comparisonScores?: RiasecScores | null;
  comparisonLabel?: string;
  size?: number;
  interactive?: boolean;
  onDimensionClick?: (dim: RiasecDimension) => void;
  selectedDimension?: RiasecDimension | null;
}

export const RiasecRadarChart: React.FC<RiasecRadarChartProps> = ({
  userScores,
  comparisonScores,
  comparisonLabel = 'Profil cible du métier',
  size = 360,
  interactive = true,
  onDimensionClick,
  selectedDimension
}) => {
  const { language } = useLanguage();
  const center = size / 2;
  const radius = (size / 2) * 0.70;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const userPolygonPoints = HEXAGON_ORDER.map((dim, i) => {
    const score = Math.max(10, Math.min(100, userScores[dim] || 0));
    const { x, y } = getCoordinates(i, score);
    return `${x},${y}`;
  }).join(' ');

  const comparisonPolygonPoints = comparisonScores
    ? HEXAGON_ORDER.map((dim, i) => {
        const score = Math.max(10, Math.min(100, comparisonScores[dim] || 0));
        const { x, y } = getCoordinates(i, score);
        return `${x},${y}`;
      }).join(' ')
    : null;

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        <defs>
          <radialGradient id="forcesUserRadarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c41230" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c41230" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient id="forcesCompRadarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Concentric grid rings */}
        {levels.map((lvl) => {
          const ringPoints = HEXAGON_ORDER.map((_, i) => {
            const { x, y } = getCoordinates(i, lvl * 100);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={lvl}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1.2"
                strokeDasharray={lvl === 1.0 ? 'none' : '3 3'}
              />
              <text
                x={center}
                y={center - lvl * radius + 11}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-mono font-medium"
              >
                {Math.round(lvl * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axes lines */}
        {HEXAGON_ORDER.map((dim, i) => {
          const { x, y } = getCoordinates(i, 100);
          const isSelected = selectedDimension === dim;
          return (
            <line
              key={dim}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={isSelected ? '#c41230' : '#cbd5e1'}
              strokeWidth={isSelected ? '1.8' : '1'}
            />
          );
        })}

        {/* Comparison Polygon (if selected) */}
        {comparisonPolygonPoints && (
          <g>
            <polygon
              points={comparisonPolygonPoints}
              fill="url(#forcesCompRadarGlow)"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
              className="transition-all duration-300"
            />
            {HEXAGON_ORDER.map((dim, i) => {
              const score = comparisonScores![dim] || 0;
              const { x, y } = getCoordinates(i, score);
              return (
                <circle
                  key={`comp-pt-${dim}`}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        )}

        {/* User Score Polygon */}
        <polygon
          points={userPolygonPoints}
          fill="url(#forcesUserRadarGlow)"
          stroke="#c41230"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* User vertices dots */}
        {HEXAGON_ORDER.map((dim, i) => {
          const score = userScores[dim] || 0;
          const { x, y } = getCoordinates(i, score);
          const isSelected = selectedDimension === dim;
          return (
            <circle
              key={`user-pt-${dim}`}
              cx={x}
              cy={y}
              r={isSelected ? '6' : '4.5'}
              fill="#c41230"
              stroke="#ffffff"
              strokeWidth={isSelected ? '2.5' : '1.5'}
              className="transition-all duration-200 cursor-pointer shadow-xs"
              onClick={() => onDimensionClick && onDimensionClick(dim)}
            />
          );
        })}

        {/* Dimension Labels */}
        {HEXAGON_ORDER.map((dim, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          const labelDist = radius + 28;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const info = RIASEC_DIMENSIONS[dim];
          const isSelected = selectedDimension === dim;

          return (
            <g
              key={`label-${dim}`}
              className="cursor-pointer group"
              onClick={() => onDimensionClick && onDimensionClick(dim)}
            >
              <circle cx={lx} cy={ly} r="22" fill="transparent" />
              <text
                x={lx}
                y={ly - 4}
                textAnchor="middle"
                className={`text-sm font-bold transition-colors ${
                  isSelected ? 'fill-[#c41230]' : 'fill-slate-800 group-hover:fill-[#c41230]'
                }`}
              >
                {dim}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500 font-semibold"
              >
                {userScores[dim] || 0}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend below chart */}
      <div className="flex items-center gap-5 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[#c41230] inline-block"></span>
          <span className="text-slate-800 font-medium">
            {language === 'en' ? 'Your candidate profile' : 'Votre profil candidat'}
          </span>
        </div>
        {comparisonScores && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-[#0284c7] inline-block"></span>
            <span className="text-[#0284c7] font-semibold">{comparisonLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};
