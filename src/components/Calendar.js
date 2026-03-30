import { useState, memo } from "react";

function Calendar({ habits }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getCompletionLevel = (dateStr) => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter((h) =>
      h.completedDates.includes(dateStr)
    ).length;
    if (completedCount === 0) return 0;
    if (completedCount === habits.length) return 3;
    if (completedCount >= habits.length / 2) return 2;
    return 1;
  };

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, -startDay + i + 1);
    cells.push({ day: prevDate.getDate(), inMonth: false, dateStr: prevDate.toISOString().split("T")[0] });
  }
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, inMonth: true, dateStr });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      cells.push({ day: i, inMonth: false, dateStr: nextDate.toISOString().split("T")[0] });
    }
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const thisMonthCompletions = habits.reduce((sum, h) => {
    return sum + h.completedDates.filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length;
  }, 0);
  const perfectDays = cells.filter(
    (c) => c.inMonth && getCompletionLevel(c.dateStr) === 3
  ).length;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav" onClick={prevMonth}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="calendar-month">{monthName}</h2>
        <button className="calendar-nav" onClick={nextMonth}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      <div className="calendar-stats-row">
        <div className="cal-stat">
          <span className="cal-stat-value">{totalCompletions}</span>
          <span className="cal-stat-label">Total Check-ins</span>
        </div>
        <div className="cal-stat">
          <span className="cal-stat-value">{thisMonthCompletions}</span>
          <span className="cal-stat-label">This Month</span>
        </div>
        <div className="cal-stat">
          <span className="cal-stat-value">{perfectDays}</span>
          <span className="cal-stat-label">Perfect Days</span>
        </div>
      </div>

      <div className="calendar-grid">
        {dayLabels.map((d) => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const level = getCompletionLevel(cell.dateStr);
          const isToday = cell.dateStr === todayStr;
          return (
            <div
              key={i}
              className={`calendar-cell ${!cell.inMonth ? "other-month" : ""} ${isToday ? "today" : ""} level-${level}`}
            >
              <span className="cell-day">{cell.day}</span>
              {level > 0 && cell.inMonth && <span className="cell-dot" />}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span className="legend-label">Less</span>
        <span className="legend-box level-0" />
        <span className="legend-box level-1" />
        <span className="legend-box level-2" />
        <span className="legend-box level-3" />
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}

export default memo(Calendar);
