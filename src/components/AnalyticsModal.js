import { memo, useState } from "react";
import { calculateStreak, calculateLongestStreak } from "../utils/streak";

function AnalyticsModal({ habit, onClose }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!habit) return null;

  const streak = calculateStreak(habit.completedDates);
  const longest = calculateLongestStreak(habit.completedDates);
  const total = habit.completedDates.length;
  const category = habit.category || "General";

  const createdDate = habit.createdAt.split("T")[0];
  const daysSinceCreated = Math.max(
    1,
    Math.floor((new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24))
  );
  const overallRate = Math.round((total / daysSinceCreated) * 100);
  const goalProgress = Math.min(100, Math.round((streak / (habit.goal || 30)) * 100));

  // Last 30 days data
  const last30 = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: dateStr,
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      done: habit.completedDates.includes(dateStr) ? 1 : 0,
    };
  });

  // Rolling 7-day average for smooth curve
  const rollingAvg = last30.map((_, i) => {
    const window = last30.slice(Math.max(0, i - 3), i + 4);
    return window.reduce((s, d) => s + d.done, 0) / window.length;
  });

  // Chart dimensions
  const chartW = 420;
  const chartH = 120;
  const padX = 30;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  // Smooth bezier curve from rolling averages
  const getPoint = (i) => ({
    x: padX + (i / 29) * plotW,
    y: padY + plotH - rollingAvg[i] * plotH,
  });

  const curvePoints = last30.map((_, i) => getPoint(i));

  const buildSmoothPath = (pts) => {
    if (pts.length < 2) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp = (pts[i + 1].x - pts[i].x) / 3;
      path += ` C ${pts[i].x + cp},${pts[i].y} ${pts[i + 1].x - cp},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return path;
  };

  const curvePath = buildSmoothPath(curvePoints);
  const areaPath = `${curvePath} L ${curvePoints[curvePoints.length - 1].x},${padY + plotH} L ${curvePoints[0].x},${padY + plotH} Z`;

  // Actual data points for dots
  const dataPoints = last30.map((d, i) => ({
    x: padX + (i / 29) * plotW,
    y: padY + plotH - d.done * plotH,
    done: d.done,
    day: d.day,
    date: d.date,
    weekday: d.weekday,
  }));

  // Heatmap: organize into weeks (5 rows x 6 cols or similar)
  const heatWeeks = [];
  for (let i = 0; i < last30.length; i += 7) {
    heatWeeks.push(last30.slice(i, i + 7));
  }

  // Goal progress ring
  const ringR = 36;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc - (goalProgress / 100) * ringCirc;

  // Weekly completion stats for mini bar chart
  const weeklyStats = heatWeeks.map((week, wi) => ({
    label: `W${wi + 1}`,
    done: week.reduce((s, d) => s + d.done, 0),
    total: week.length,
  }));
  const maxWeekDone = Math.max(1, ...weeklyStats.map((w) => w.done));

  const stats = [
    { label: "Current Streak", value: streak, suffix: " days", icon: "🔥" },
    { label: "Longest Streak", value: longest, suffix: " days", icon: "🏆" },
    { label: "Total Check-ins", value: total, suffix: "", icon: "✅" },
    { label: "Completion Rate", value: overallRate, suffix: "%", icon: "📊" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal analytics-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="modal-category">{category}</span>
            <h2>{habit.name}</h2>
            <span className="modal-created">Since {createdDate}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Stats Row + Goal Ring */}
        <div className="analytics-top-row">
          <div className="modal-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="modal-stat">
                <span className="modal-stat-icon">{s.icon}</span>
                <div>
                  <span className="modal-stat-value">{s.value}{s.suffix}</span>
                  <span className="modal-stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="goal-ring-container">
            <svg width="92" height="92" viewBox="0 0 92 92">
              <circle cx="46" cy="46" r={ringR} fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                cx="46" cy="46" r={ringR}
                fill="none" stroke="url(#goalRingGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 46 46)"
                className="goal-ring-progress"
              />
              <defs>
                <linearGradient id="goalRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#b8ff57" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
              </defs>
              <text x="46" y="42" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="800" fontFamily="inherit">{goalProgress}%</text>
              <text x="46" y="56" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontWeight="600" fontFamily="inherit" textTransform="uppercase">GOAL</text>
            </svg>
          </div>
        </div>

        {/* 30-Day Smooth Line Chart */}
        <div className="modal-chart-section">
          <div className="chart-header-row">
            <h4>30-Day Activity</h4>
            <span className="chart-legend-pill">
              <span className="legend-dot" /> 7-day avg
            </span>
          </div>
          <div className="chart-container">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="140" className="modal-line-chart" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b8ff57" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#4ade80" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#b8ff57" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <filter id="dotGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <line key={i} x1={padX} y1={padY + plotH * (1 - pct)} x2={padX + plotW} y2={padY + plotH * (1 - pct)} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={i > 0 && i < 4 ? "4 4" : "0"} />
              ))}

              {/* Date labels */}
              {[0, 9, 19, 29].map((i) => (
                <text key={i} x={dataPoints[i].x} y={chartH - 2} textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="inherit">
                  {last30[i].day}
                </text>
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="url(#chartAreaGrad)" />

              {/* Smooth line */}
              <path d={curvePath} fill="none" stroke="url(#chartLineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chart-line-animated" />

              {/* Data dots */}
              {dataPoints.map((pt, i) => (
                <g key={i}
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Invisible larger hit target */}
                  <circle cx={pt.x} cy={pt.y} r="8" fill="transparent" />
                  {pt.done ? (
                    <circle cx={pt.x} cy={pt.y} r={hoveredDay === i ? 5 : 3.5} fill="#b8ff57" filter="url(#dotGlow)" className="chart-dot" />
                  ) : (
                    <circle cx={pt.x} cy={pt.y} r={hoveredDay === i ? 4 : 2} fill="var(--text-muted)" opacity="0.4" />
                  )}
                </g>
              ))}

              {/* Tooltip */}
              {hoveredDay !== null && (
                <g>
                  <line x1={dataPoints[hoveredDay].x} y1={padY} x2={dataPoints[hoveredDay].x} y2={padY + plotH} stroke="var(--accent-mid)" strokeWidth="1" strokeDasharray="3 3" />
                  <rect x={dataPoints[hoveredDay].x - 28} y={dataPoints[hoveredDay].y - 28} width="56" height="20" rx="6" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1" />
                  <text x={dataPoints[hoveredDay].x} y={dataPoints[hoveredDay].y - 15} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="600" fontFamily="inherit">
                    {last30[hoveredDay].weekday} {last30[hoveredDay].day} · {last30[hoveredDay].done ? "Done" : "Missed"}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Bottom row: Heatmap + Weekly Bars */}
        <div className="analytics-bottom-row">
          <div className="modal-heatmap-section">
            <h4>Completion Heatmap</h4>
            <div className="modal-heatmap-grid">
              {heatWeeks.map((week, wi) => (
                <div key={wi} className="heatmap-row">
                  <span className="heatmap-week-label">W{wi + 1}</span>
                  {week.map((d, di) => (
                    <div
                      key={di}
                      className={`heatmap-cell ${d.done ? "active" : ""}`}
                      title={`${d.weekday} ${d.day}: ${d.done ? "Done ✓" : "Missed"}`}
                    >
                      <span className="heatmap-day-num">{d.day}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="weekly-bars-section">
            <h4>Weekly Summary</h4>
            <div className="weekly-bars">
              {weeklyStats.map((w, i) => (
                <div key={i} className="weekly-bar-col">
                  <div className="weekly-bar-track">
                    <div
                      className="weekly-bar-fill"
                      style={{ height: `${(w.done / maxWeekDone) * 100}%` }}
                    />
                  </div>
                  <span className="weekly-bar-value">{w.done}/{w.total}</span>
                  <span className="weekly-bar-label">{w.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(AnalyticsModal);
