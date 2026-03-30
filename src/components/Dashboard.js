import { memo } from "react";

function Dashboard({ stats, habits }) {
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
    const completed = habits
      ? habits.filter((h) => h.completedDates.includes(dateStr)).length
      : 0;
    return { dayLabel, completed, dateStr };
  });

  const maxCompleted = Math.max(1, ...last7.map((d) => d.completed));

  const statItems = [
    {
      label: "Total Habits",
      value: stats.totalHabits,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: "Done Today",
      value: stats.completedToday,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Best Streak",
      value: stats.bestStreak,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: "Rate",
      value: `${stats.completionRate}%`,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        {statItems.map((item, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{item.icon}</div>
            <div className="stat-info">
              <p className="stat-value">{item.value}</p>
              <h4>{item.label}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-chart">
        <h4 className="chart-title">Weekly Activity</h4>
        <div className="bar-chart">
          <svg viewBox="0 0 280 130" width="100%" height="130" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8ff57" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <filter id="barGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Grid lines */}
            {[0, 0.5, 1].map((pct, i) => (
              <line key={i} x1="8" y1={90 - pct * 80} x2="272" y2={90 - pct * 80} stroke="var(--border)" strokeWidth="0.5" strokeDasharray={i === 1 ? "4 4" : "0"} />
            ))}
            {last7.map((d, i) => {
              const barH = (d.completed / maxCompleted) * 80;
              const x = i * 38 + 14;
              const barW = 22;
              const active = d.completed > 0;
              return (
                <g key={i} className="bar-group">
                  {/* Bar shadow */}
                  {active && (
                    <rect x={x} y={90 - barH + 2} width={barW} height={barH} rx="5" fill="var(--accent)" opacity="0.1" filter="url(#barGlow)" />
                  )}
                  {/* Bar */}
                  <rect
                    x={x} y={90 - barH} width={barW} height={Math.max(barH, 3)} rx="5"
                    fill={active ? "url(#barGrad)" : "var(--accent-dim)"}
                    className={active ? "bar-animated" : ""}
                  />
                  {/* Count on top */}
                  {active && (
                    <text x={x + barW / 2} y={90 - barH - 6} textAnchor="middle" fill="var(--accent)" fontSize="9" fontWeight="700" fontFamily="inherit">
                      {d.completed}
                    </text>
                  )}
                  {/* Day label */}
                  <text x={x + barW / 2} y="108" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="500" fontFamily="inherit">
                    {d.dayLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default memo(Dashboard);
