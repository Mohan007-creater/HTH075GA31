import React, { useState } from 'react';
import { ChartDataPoint } from '../types/dataset';
import { BarChart3, LineChart, PieChart, Table as TableIcon, Sparkles } from 'lucide-react';
import { formatNumber } from '../utils/dataEngine';

interface InteractiveChartProps {
  data: ChartDataPoint[];
  initialType?: 'metric' | 'bar' | 'horizontal_bar' | 'line' | 'donut' | 'scatter' | 'table';
  unit?: string;
  title?: string;
  allowTypeSwitch?: boolean;
}

const PALETTE = [
  '#4F8CFF', // primary blue
  '#8B5CF6', // purple
  '#06B6D4', // cyan-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  initialType = 'bar',
  unit,
  title,
  allowTypeSwitch = true,
}) => {
  const [currentType, setCurrentType] = useState<string>(initialType);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
        No numeric records available to plot for this query.
      </div>
    );
  }

  // Handle single metric card
  if (currentType === 'metric' || data.length === 1) {
    const single = data[0];
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 border border-cyan-500/20 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
            {title || single.label}
          </span>
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>
        <div className="text-4xl font-extrabold text-white tracking-tight">
          {formatNumber(single.value, unit)}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Verified calculation executed against uploaded dataset records.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalSum = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800/80 p-5 backdrop-blur-md shadow-xl transition-all">
      {/* Chart Header & Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-200">
            {title || 'Visual Distribution'}
          </h4>
          <span className="text-xs text-slate-500">· {data.length} categories</span>
        </div>

        {allowTypeSwitch && (
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentType('bar')}
              title="Vertical Bar"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentType === 'bar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentType('horizontal_bar')}
              title="Ranking Bar"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentType === 'horizontal_bar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="rotate-90 inline-block">
                <BarChart3 className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={() => setCurrentType('line')}
              title="Trend Line"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentType === 'line'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentType('donut')}
              title="Donut Distribution"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentType === 'donut'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentType('table')}
              title="Data Table"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                currentType === 'table'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 1. Vertical Bar Chart */}
      {currentType === 'bar' && (
        <div className="relative pt-6 pb-2">
          <div className="h-56 flex items-end gap-3 sm:gap-5 px-2">
            {data.map((item, idx) => {
              const heightPct = Math.max(8, (item.value / maxValue) * 100);
              const color = PALETTE[idx % PALETTE.length];
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-cyan-500/50 shadow-2xl text-[11px] whitespace-nowrap text-white font-mono pointer-events-none">
                      <span className="font-semibold text-cyan-300">{item.label}</span>:{' '}
                      {formatNumber(item.value, unit)}{' '}
                      <span className="text-slate-400">
                        ({totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                  )}

                  {/* Bar */}
                  <div className="w-full max-w-[48px] rounded-t-lg bg-slate-800/40 relative overflow-hidden transition-all duration-300 group-hover:brightness-125">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        background: `linear-gradient(to top, ${color}33, ${color})`,
                        boxShadow: isHovered ? `0 0 15px ${color}88` : 'none',
                      }}
                    />
                  </div>

                  {/* Value Label */}
                  <span className="mt-2 text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                    {formatNumber(item.value, unit)}
                  </span>

                  {/* Category Label */}
                  <span
                    className="mt-1 text-[11px] text-slate-400 max-w-[65px] truncate text-center group-hover:text-slate-200"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Horizontal Bar Chart (Ranking) */}
      {currentType === 'horizontal_bar' && (
        <div className="space-y-3.5 py-2">
          {data.map((item, idx) => {
            const widthPct = Math.max(6, (item.value / maxValue) * 100);
            const color = PALETTE[idx % PALETTE.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300 group-hover:text-white transition-colors truncate max-w-[200px]">
                    <span className="font-mono text-slate-500 mr-2">#{idx + 1}</span>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-cyan-300">
                      {formatNumber(item.value, unit)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                    style={{
                      width: `${widthPct}%`,
                      background: `linear-gradient(to right, ${color}88, ${color})`,
                      boxShadow: isHovered ? `0 0 12px ${color}` : 'none',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Trend Line Chart */}
      {currentType === 'line' && (
        <div className="relative pt-6 pb-2">
          <svg className="w-full h-56 overflow-visible" viewBox="0 0 500 200">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 50, 100, 150].map((y) => (
              <line
                key={y}
                x1="20"
                y1={y}
                x2="480"
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
            ))}

            {/* Compute SVG Path */}
            {(() => {
              const pts = data.map((d, i) => {
                const x = 30 + (i / Math.max(1, data.length - 1)) * 440;
                const y = 170 - (d.value / maxValue) * 140;
                return { x, y, ...d };
              });

              const pathStr = pts.reduce(
                (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                ''
              );
              const areaStr = `${pathStr} L ${pts[pts.length - 1].x} 180 L ${pts[0].x} 180 Z`;

              return (
                <>
                  <path d={areaStr} fill="url(#lineGrad)" />
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {pts.map((p, i) => (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredIndex === i ? 6 : 4}
                        fill="#080B11"
                        stroke="#22D3EE"
                        strokeWidth="2.5"
                        className="transition-all"
                      />
                      {hoveredIndex === i && (
                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          fill="#38BDF8"
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {formatNumber(p.value, unit)}
                        </text>
                      )}
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>

          {/* X Axis labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-6">
            {data.map((d, i) => (
              <span key={i} className="truncate max-w-[60px] text-center">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Donut Chart */}
      {currentType === 'donut' && (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {(() => {
                let cumulativeAngle = 0;
                return data.map((item, idx) => {
                  const sliceAngle = totalSum > 0 ? (item.value / totalSum) * 360 : 0;
                  const color = PALETTE[idx % PALETTE.length];
                  const strokeDasharray = `${(sliceAngle / 360) * 251.2} 251.2`;
                  const strokeDashoffset = -((cumulativeAngle / 360) * 251.2);
                  cumulativeAngle += sliceAngle;

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="14"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] text-slate-400 font-medium">Total</span>
              <span className="text-base font-bold text-white font-mono">
                {formatNumber(totalSum, unit)}
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 w-full sm:w-auto">
            {data.map((item, idx) => {
              const color = PALETTE[idx % PALETTE.length];
              const pct = totalSum > 0 ? ((item.value / totalSum) * 100).toFixed(1) : 0;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-4 text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                    hoveredIndex === idx ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-300 font-medium truncate max-w-[120px]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-200 font-semibold">{formatNumber(item.value, unit)}</span>
                    <span className="text-slate-500 text-[10px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Data Table View */}
      {currentType === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-64">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono sticky top-0 border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Category / Dimension</th>
                <th className="px-4 py-2.5 text-right">Value</th>
                <th className="px-4 py-2.5 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-2 text-slate-500 font-mono">{idx + 1}</td>
                  <td className="px-4 py-2 font-medium text-slate-200">{row.label}</td>
                  <td className="px-4 py-2 text-right font-mono font-semibold text-cyan-300">
                    {formatNumber(row.value, unit)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-slate-400">
                    {totalSum > 0 ? ((row.value / totalSum) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
