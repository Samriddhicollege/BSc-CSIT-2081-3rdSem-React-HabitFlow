import { memo } from "react";
import { calculateStreak } from "../utils/streak";

function TodayProtocol({ habits, completeHabit, today }) {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", { day: "numeric", month: "short" });

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  const sortedHabits = [...habits]
    .map((h) => {
      const time = h.scheduledTime || "08:00";
      const [hh, mm] = time.split(":").map(Number);
      return { ...h, _sortMinutes: hh * 60 + mm };
    })
    .sort((a, b) => a._sortMinutes - b._sortMinutes);

  const getActiveIndex = () => {
    for (let i = sortedHabits.length - 1; i >= 0; i--) {
      if (sortedHabits[i]._sortMinutes <= currentTimeMinutes) return i;
    }
    return 0;
  };

  const activeIndex = sortedHabits.length > 0 ? getActiveIndex() : -1;

  return (
    <aside className="protocol-panel">
      <div className="protocol-header">
        <div>
          <h2>Today's Protocol</h2>
          <span className="protocol-date">{dayName}, {dateStr}</span>
        </div>
        <button className="protocol-expand" title="Expand">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      <div className="protocol-timeline">
        {sortedHabits.length === 0 ? (
          <div className="protocol-empty">
            <svg viewBox="0 0 64 64" width="56" height="56" fill="none" style={{ marginBottom: 12 }}>
              <circle cx="32" cy="32" r="30" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="5 3" />
              <path d="M32 16c-3 5-8 10-8 18a8 8 0 0016 0c0-4-1.5-6.5-3.5-9C34.5 21 32 16 32 16z" fill="var(--accent-dim)" stroke="var(--accent-mid)" strokeWidth="1" />
            </svg>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No Protocols Yet</p>
            <p>Add your first habit to see your daily timeline here.</p>
          </div>
        ) : (
          sortedHabits.map((habit, index) => {
            const time = habit.scheduledTime || "08:00";
            const isDone = habit.completedDates.includes(today);
            const isActive = index === activeIndex && !isDone;
            const streak = calculateStreak(habit.completedDates);
            const progress = Math.min(100, Math.round((streak / (habit.goal || 30)) * 100));
            const category = habit.category || "General";

            return (
              <div key={habit.id} className="timeline-item">
                <span className="timeline-time">{time}</span>
                <div className="timeline-track">
                  <div className={`timeline-dot ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                    {isDone && (
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="timeline-line" />
                </div>
                <div
                  className={`timeline-card ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                  onClick={() => completeHabit(habit.id, today)}
                >
                  <span className="timeline-category">{category}</span>
                  <h4>{habit.name}</h4>
                  {habit.description && <p className="timeline-desc">{habit.description}</p>}
                  {isActive && (
                    <div className="timeline-progress">
                      <div className="timeline-progress-track">
                        <div className="timeline-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="timeline-progress-label">{progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default memo(TodayProtocol);
