import { useState, memo } from "react";
import confetti from "canvas-confetti";
import {
  calculateStreak,
  calculateLongestStreak,
} from "../utils/streak";

function HabitCard({
  habit,
  completeHabit,
  deleteHabit,
  editHabit,
  openAnalytics,
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(habit.name);

  const today = new Date().toISOString().split("T")[0];
  const streak = calculateStreak(habit.completedDates);
  const longest = calculateLongestStreak(habit.completedDates);
  const isDoneToday = habit.completedDates.includes(today);

  const progress = Math.min(100, Math.round((streak / (habit.goal || 30)) * 100));
  const category = habit.category || "General";
  const scheduledTime = habit.scheduledTime || "";

  const handleComplete = () => {
    completeHabit(habit.id, today);
    if (streak === 6 || streak === 29) {
      confetti({ colors: ["#b8ff57", "#4ade80", "#22d3ee"] });
    }
  };

  const getDayLabel = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    return d.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  return (
    <div className={`habit-card ${isDoneToday ? "completed" : ""}`}>
      {isDoneToday && (
        <div className="card-completed-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      <div className="card-top">
        <span className="card-category">{category}</span>
        {scheduledTime && <span className="card-time">{scheduledTime}</span>}
      </div>

      {editing ? (
        <input
          className="card-edit-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={() => {
            editHabit(habit.id, newName);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editHabit(habit.id, newName);
              setEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <h3 className="card-name" onDoubleClick={() => setEditing(true)}>
          {habit.name}
        </h3>
      )}

      {habit.description && <p className="card-desc">{habit.description}</p>}

      <div className="card-stats">
        <div className="card-stat">
          <span className="card-stat-num">
            {streak}
            {streak >= 7 && <span className="streak-fire" title={`${streak} day streak!`}>🔥</span>}
            {streak >= 3 && streak < 7 && <span className="streak-fire small" title={`${streak} day streak!`}>⚡</span>}
          </span>
          <span className="card-stat-label">Streak</span>
        </div>
        <div className="card-stat">
          <span className="card-stat-num">{longest}</span>
          <span className="card-stat-label">Best</span>
        </div>
        <div className="card-stat">
          <span className="card-stat-num">{habit.completedDates.length}</span>
          <span className="card-stat-label">Total</span>
        </div>
      </div>

      <div className="card-progress">
        <div className="card-progress-bar">
          <div className="card-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="card-progress-text">{progress}%</span>
      </div>

      <div className="card-week">
        {[...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dateStr = d.toISOString().split("T")[0];
          const done = habit.completedDates.includes(dateStr);
          return (
            <div key={i} className="card-week-day" onClick={() => completeHabit(habit.id, dateStr)}>
              <span className="card-week-label">{getDayLabel(i)}</span>
              <div className={`card-week-dot ${done ? "done" : ""}`} />
            </div>
          );
        })}
      </div>

      <div className="card-actions">
        <button className={`card-btn primary ${isDoneToday ? "undo" : ""}`} onClick={handleComplete}>
          {isDoneToday ? (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9"/><polyline points="3 3 3 7 7 7"/></svg>
              Undo
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Done
            </>
          )}
        </button>
        <button className="card-btn secondary" onClick={() => openAnalytics(habit)} title="Analytics">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </button>
        <button className="card-btn danger" onClick={() => deleteHabit(habit.id)} title="Delete">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>
  );
}

export default memo(HabitCard);
