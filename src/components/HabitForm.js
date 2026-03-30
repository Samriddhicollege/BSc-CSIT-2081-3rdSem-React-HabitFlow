import { useState } from "react";

const CATEGORY_SUGGESTIONS = [
  "Body Protocol",
  "Focus State",
  "Learning",
  "Mindfulness",
  "Fitness",
  "Nutrition",
  "Sleep",
  "Social",
];

function HabitForm({ addHabit }) {
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(30);
  const [category, setCategory] = useState("");
  const [scheduledTime, setScheduledTime] = useState(getCurrentTime);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a habit name.");
      return;
    }
    if (goal < 1) {
      setError("Goal must be at least 1 day.");
      return;
    }

    setError("");
    addHabit(name, goal, category || "General", scheduledTime || "08:00", description);
    setName("");
    setGoal(30);
    setCategory("");
    setScheduledTime(getCurrentTime());
    setDescription("");
    setExpanded(false);
  };

  if (!expanded) {
    return (
      <button className="form-expand-btn" onClick={() => setExpanded(true)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Protocol
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-header">
        <h3>Add New Protocol</h3>
        <button type="button" className="form-close" onClick={() => setExpanded(false)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="form-row">
        <div className="form-field full">
          <label>Habit Name</label>
          <input
            type="text"
            placeholder="e.g., Morning Meditation"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Category</label>
          <input
            type="text"
            list="category-list"
            placeholder="Select or type..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <datalist id="category-list">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div className="form-field">
          <label>Scheduled Time</label>
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Goal (days)</label>
          <input
            type="number"
            min="1"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field full">
          <label>Description <span className="optional">(optional)</span></label>
          <textarea
            placeholder="Brief description of your habit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
          />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="form-cancel" onClick={() => setExpanded(false)}>Cancel</button>
        <button type="submit" className="form-submit">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Protocol
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
