function Sidebar({ activeNav, onNavChange, incompleteCount }) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo" onClick={() => onNavChange("home")}>
          <svg className="logo-icon" viewBox="0 0 40 40" width="36" height="36" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#b8ff57" />
              </linearGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="40" height="40" rx="12" fill="rgba(184,255,87,0.06)" />
            {/* Circular progress track */}
            <circle cx="20" cy="20" r="13" stroke="rgba(184,255,87,0.12)" strokeWidth="2.5" fill="none" />
            {/* Animated progress arc — ~270deg filled */}
            <circle
              cx="20" cy="20" r="13"
              stroke="url(#logoGrad)" strokeWidth="2.5" fill="none"
              strokeLinecap="round"
              strokeDasharray="61.5 20"
              transform="rotate(-90 20 20)"
              filter="url(#logoGlow)"
            />
            {/* Checkmark in center */}
            <polyline
              points="14.5,20.5 18.5,24.5 26,16"
              stroke="url(#logoGrad)" strokeWidth="2.8"
              strokeLinecap="round" strokeLinejoin="round"
              filter="url(#logoGlow)"
            />
          </svg>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${activeNav === item.id ? "active" : ""}`}
              onClick={() => onNavChange(item.id)}
              title={item.label}
            >
              <span className="nav-indicator" />
              {item.icon}
              {item.id === "home" && incompleteCount > 0 && (
                <span className="nav-badge">{incompleteCount}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <span className="sidebar-brand">HF</span>
        <div className="sidebar-avatar" title="Profile">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
