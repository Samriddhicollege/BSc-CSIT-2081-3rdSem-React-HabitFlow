import { useState, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import HabitForm from "./components/HabitForm";
import HabitCard from "./components/HabitCard";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import TodayProtocol from "./components/TodayProtocol";
import AnalyticsModal from "./components/AnalyticsModal";
import useLocalStorage from "./hooks/useLocalStorage";
import { useTheme } from "./context/ThemeContext";
import { calculateStreak, calculateLongestStreak } from "./utils/streak";

function App() {
  const [habits, setHabits] = useLocalStorage("habits", []);
  const { darkMode, toggleDarkMode } = useTheme();
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const addHabit = useCallback((name, goal, category, scheduledTime, description) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      completedDates: [],
      goal: goal || 30,
      category: category || "General",
      scheduledTime: scheduledTime || "08:00",
      description: description || "",
    };
    setHabits((prev) => [...prev, newHabit]);
  }, [setHabits]);

  const completeHabit = useCallback((id, dateStr) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedDates: h.completedDates.includes(dateStr)
                ? h.completedDates.filter((d) => d !== dateStr)
                : [...h.completedDates, dateStr],
            }
          : h
      )
    );
  }, [setHabits]);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, [setHabits]);

  const editHabit = useCallback((id, newName) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
    );
  }, [setHabits]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Night Owl";
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Night Owl";
  };

  const incompleteToday = useMemo(
    () => habits.filter((h) => !h.completedDates.includes(today)).length,
    [habits, today]
  );

  const filteredHabits = useMemo(
    () => habits.filter((h) => h.name.toLowerCase().includes(search.toLowerCase())),
    [habits, search]
  );

  const stats = useMemo(() => ({
    totalHabits: habits.length,
    completedToday: habits.filter((h) => h.completedDates.includes(today)).length,
    bestStreak: Math.max(0, ...habits.map((h) => calculateLongestStreak(h.completedDates))),
    completionRate:
      habits.length === 0
        ? 0
        : Math.round(
            (habits.filter((h) => h.completedDates.includes(today)).length / habits.length) * 100
          ),
  }), [habits, today]);

  const renderMainContent = () => {
    switch (activeNav) {
      case "calendar":
        return (
          <div className="main-view fade-in">
            <Calendar habits={habits} />
          </div>
        );
      case "dashboard":
        return (
          <div className="main-view fade-in">
            <h2 className="view-title">Dashboard</h2>
            <Dashboard stats={stats} habits={habits} />
          </div>
        );
      case "analytics":
        return (
          <div className="main-view fade-in">
            <h2 className="view-title">Analytics Overview</h2>
            <Dashboard stats={stats} habits={habits} />
            <div className="analytics-cards">
              {habits.map((habit) => (
                <div key={habit.id} className="analytics-habit-row" onClick={() => setSelectedHabit(habit)}>
                  <span className="ahr-category">{habit.category || "General"}</span>
                  <span className="ahr-name">{habit.name}</span>
                  <span className="ahr-streak">{calculateStreak(habit.completedDates)} day streak</span>
                  <span className="ahr-total">{habit.completedDates.length} completions</span>
                </div>
              ))}
              {habits.length === 0 && <p className="empty-analytics">Add habits to see analytics.</p>}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="main-view fade-in">
            <h2 className="view-title">Settings</h2>
            <div className="settings-card">
              <div className="settings-row">
                <div>
                  <h4>Appearance</h4>
                  <p>Toggle between dark and light mode</p>
                </div>
                <button className="theme-toggle-btn" onClick={toggleDarkMode}>
                  {darkMode ? (
                    <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Light Mode</>
                  ) : (
                    <><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> Dark Mode</>
                  )}
                </button>
              </div>
              <div className="settings-row">
                <div>
                  <h4>Data</h4>
                  <p>Your data is stored locally in your browser</p>
                </div>
                <span className="settings-badge">{habits.length} habits saved</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="main-view fade-in">
            <Dashboard stats={stats} habits={habits} />
            <HabitForm addHabit={addHabit} />
            <div className="habit-grid">
              {filteredHabits.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" viewBox="0 0 80 80" width="80" height="80" fill="none">
                    <circle cx="40" cy="40" r="38" stroke="var(--border)" strokeWidth="2" strokeDasharray="6 4" />
                    <path d="M40 20C36 26 30 32 30 40a10 10 0 0020 0c0-4-2-7-4.5-10.5C43 26 40 20 40 20z" fill="var(--accent-dim)" stroke="var(--accent-mid)" strokeWidth="1.5" />
                    <line x1="40" y1="55" x2="40" y2="60" stroke="var(--accent-mid)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="empty-title">
                    {habits.length === 0 ? "Ignite Your First Protocol" : "No Matches Found"}
                  </p>
                  <p className="empty-subtitle">
                    {habits.length === 0
                      ? "Build momentum by adding your first daily habit"
                      : "Try adjusting your search terms"}
                  </p>
                </div>
              ) : (
                filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completeHabit={completeHabit}
                    deleteHabit={deleteHabit}
                    editHabit={editHabit}
                    openAnalytics={setSelectedHabit}
                  />
                ))
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} incompleteCount={incompleteToday} />

      <main className="main-content">
        <header className="main-header">
          <div className="main-header-left">
            <h1 className="main-title">{getGreeting()} 👋</h1>
            <span className="main-subtitle">
              {stats.completedToday === stats.totalHabits && stats.totalHabits > 0
                ? "All protocols completed — you're on fire!"
                : stats.totalHabits === 0
                  ? "Start your journey — add your first protocol"
                  : `${stats.totalHabits - stats.completedToday} protocols remaining today`}
            </span>
          </div>
          <div className="main-header-right">
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        {renderMainContent()}
      </main>

      <TodayProtocol habits={habits} completeHabit={completeHabit} today={today} />

      <AnalyticsModal
        habit={selectedHabit}
        onClose={() => setSelectedHabit(null)}
      />
    </div>
  );
}

export default App;
