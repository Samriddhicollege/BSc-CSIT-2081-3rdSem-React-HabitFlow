# 🔥 HabitFlow – Modern Habit Tracking App


## Student Information

* **Name:** Karan Sunar
* **Roll Number:** 11
* **Course / Program:** Bachelor of Science in Computer Science and Information Technology
* **Semester / Year:** 3rd Semester / 2026

---


## Instructor Information

* **Instructor Name:** **Mr. Dipak Shrestha**
* **Course Title:** React Development / Full Stack Development
* **College Name:** Samriddhi College

---

## Project Overview


HabitFlow is a modern habit tracking web application built with React 19.  
It helps users build consistency through daily streak tracking, goal-based progress, detailed analytics, and a clean, responsive interface with dark mode support.

This project was created to demonstrate frontend development skills, including state management, Context API, custom hooks, derived data logic, and modular component architecture.

---

## ✨ Features

### 🔥 Habit Management
- Add new habits with name, goal, category, scheduled time, and description
- Edit habit names (inline editing)
- Delete habits
- Set custom goal (in days) for each habit
- Category support with autocomplete suggestions
- Search and filter habits

### 📅 Streak Tracking
- Automatic consecutive-day streak calculation
- Longest streak tracking
- Prevents duplicate completion for the same day
- Undo completion (toggle) support
- 🔥 and ⚡ streak badges on habit cards

### 🗓 Weekly Tracker
- 7-day mini calendar on each habit card with day labels
- Visual daily completion indicators
- GitHub-style activity tracking

### 📆 Calendar View
- Full monthly calendar with completion heat mapping
- Month-to-month navigation
- Completion levels (0–3) based on percentage of habits completed
- Monthly stats: total check-ins, this month's completions, perfect days

### 📊 Dashboard & Analytics
- Summary dashboard with 4 stat cards (Total Habits, Done Today, Best Streak, Completion Rate %)
- Weekly activity bar chart showing last 7 days
- Per-habit analytics modal with:
  - 6 detailed stats (current streak, longest streak, total check-ins, completion rate, goal progress, created date)
  - 30-day line chart with area fill
  - Completion heatmap grid

### 🕐 Today Protocol
- Daily timeline panel showing scheduled habits for today
- Habits sorted by scheduled time
- Visual indicators for active/completed habits
- Progress percentage for active habits
- Displays category and description

### 🏆 Achievements
- Confetti animation on habit completion celebration

### 🌗 Dark Mode
- Full dark/light mode toggle
- Theme persisted to localStorage
- Managed via React Context API

### 🎨 UI & Experience
- Modern gradient design
- Glassmorphism cards
- Custom SVG logo with animated progress indicator
- Sidebar navigation (Home, Dashboard, Calendar, Analytics, Settings)
- Responsive layout (mobile friendly)
- Smooth hover and fade-in animations
- Empty state UI with contextual messages
- Dynamic greeting based on time of day

### 💾 Data Persistence
- Uses localStorage via custom `useLocalStorage` hook
- No backend required
- All streaks calculated dynamically from stored completion dates

---

## 🧠 Technical Highlights

- React 19 (Functional Components)
- React Hooks (`useState`, `useEffect`, `useContext`, custom hooks)
- Context API for theme management (`ThemeContext`)
- Custom Hook (`useLocalStorage`) for persistent state
- Derived state calculations (streaks computed from raw dates, never stored)
- Utility-based streak logic (`calculateStreak`, `calculateLongestStreak`)
- Modular, reusable component architecture
- Clean CSS styling with CSS variables for theming
- Lightweight, zero-backend architecture

---

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── AnalyticsModal.js    # Per-habit detailed analytics modal
 │    ├── Calendar.js          # Monthly calendar view with heat mapping
 │    ├── Dashboard.js         # Summary stats and weekly bar chart
 │    ├── HabitCard.js         # Individual habit card with streaks & history
 │    ├── HabitForm.js         # Expandable form to create new habits
 │    ├── Sidebar.js           # Navigation sidebar with logo
 │    └── TodayProtocol.js     # Daily scheduled habits timeline
 │
 ├── context/
 │    └── ThemeContext.js       # Dark/light mode context provider
 │
 ├── hooks/
 │    └── useLocalStorage.js   # Custom hook for localStorage sync
 │
 ├── utils/
 │    └── streak.js            # Streak calculation utilities
 │
 ├── App.js                    # Main application component & routing
 ├── App.css
 ├── styles.css                # Global styles
 ├── index.js                  # Entry point
 └── index.css
```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/your-username/habitflow.git
cd habitflow
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start development server

```bash
npm start
```

The application will run at:

```
http://localhost:3000
```

### 4️⃣ Build for production

```bash
npm run build
```

---

## GitHub & Live Demo

* **GitHub Repository:** https://github.com/Samriddhicollege/BSc-CSIT-2081-3rdSem-React-HabitFlow.git
* **Live URL (if deployed):** https://agent-69ca875ce922d9c85f12bddc--habitflow-react.netlify.app/


## 🎯 Purpose of This Project

HabitFlow was built as a portfolio-level frontend application to simulate a real-world productivity SaaS product.

It demonstrates:

- State management with React Hooks and Context API
- UI/UX thinking with dark mode, responsive design, and animations
- Component-based architecture with reusable modules
- Data-driven rendering with derived state
- Custom hooks for data persistence
- Clean project organization
- Feature-rich frontend logic without a backend

---

## 🚀 Future Enhancements

* Improve UI/UX design with advanced animations and transitions
* Add real-time habit sync and collaboration (multi-device support)
* Implement notification system for daily habit reminders
* Drag-and-drop habit reordering
* PWA support for offline access
* Backend integration with user authentication
* Export/import habit data

---

## Acknowledgement

> I would like to thank my instructor **Mr. Dipak Shrestha** for guidance and support throughout this project.

---

## Declaration

> I hereby declare that this project is my original work and has been completed as part of my academic submission.

---

## 🛠 Built With

- **React 19** – UI library
- **JavaScript (ES6+)** – Language
- **CSS3** – Styling with CSS variables and glassmorphism
- **Canvas Confetti** – Celebration animations
- **localStorage** – Client-side data persistence

---


⭐ If you found this project helpful or interesting, feel free to star the repository.
