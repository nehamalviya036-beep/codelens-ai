import React, { useEffect, useState } from "react";
import "./App.css";
import CodeAnalyzer from "./CodeAnalyzer";

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard({ setPage }) {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    issuesFound: 0,
    codeQuality: 0,
    problemsSolved: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            totalAnalyses: data.stats.totalAnalyses || 0,
            issuesFound: data.stats.issuesFound || 0,
            codeQuality: data.stats.codeQuality || 0,
            problemsSolved: data.stats.issuesFound || 0,
          });

          setRecent(data.recent || []);
        }
      })
      .catch((error) => {
        console.error("Dashboard API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getLanguageIcon = (language) => {
    if (!language) return "CODE";

    const lang = language.toLowerCase();

    if (lang.includes("javascript")) return "JS";
    if (lang.includes("node")) return "JS";
    if (lang.includes("python")) return "PY";
    if (lang.includes("java")) return "JA";
    if (lang.includes("c++")) return "C++";
    if (lang === "c") return "C";

    return "CODE";
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";

    const now = new Date();
    const created = new Date(date);

    const seconds = Math.floor((now - created) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} days ago`;
  };

  const getQualityType = (score) => {
    if (score >= 85) return "good";
    if (score >= 70) return "average";
    return "bad";
  };

  return (
    <>
      {/* HERO */}

      <div className="hero">
        <div>
          <h1>Good Morning,  👋</h1>

          <p>Let's make your code better today.</p>
        </div>

        <button
          className="analyze-btn"
          onClick={() => setPage("analyzer")}
        >
          <span>＋</span>
          Analyze Code
        </button>
      </div>

      {/* STATS */}

      <div className="stats-grid">
        <div className="stat-card purple-card">
          <div className="stat-icon">🔍</div>

          <div>
            <p>Total Analyses</p>

            <h2>{loading ? "..." : stats.totalAnalyses}</h2>

            <span className="green">Live database data</span>
          </div>
        </div>

        <div className="stat-card pink-card">
          <div className="stat-icon">🐞</div>

          <div>
            <p>Issues Found</p>

            <h2>{loading ? "..." : stats.issuesFound}</h2>

            <span className="red">AI detected issues</span>
          </div>
        </div>

        <div className="stat-card green-card">
          <div className="stat-icon">✓</div>

          <div>
            <p>Code Quality</p>

            <h2>
              {loading ? "..." : `${stats.codeQuality}%`}
            </h2>

            <span className="green">Average AI score</span>
          </div>
        </div>

        <div className="stat-card orange-card">
          <div className="stat-icon">⚡</div>

          <div>
            <p>Problems Solved</p>

            <h2>{loading ? "..." : stats.problemsSolved}</h2>

            <span className="orange">Great progress</span>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD */}

      <div className="dashboard-grid">
        {/* RECENT ANALYSES */}

        <div className="glass-card recent-card">
          <div className="card-heading">
            <div>
              <h2>Recent Analyses</h2>

              <p>Your latest code reviews</p>
            </div>

            <button onClick={() => setPage("history")}>
              View All →
            </button>
          </div>

          {loading ? (
            <p style={{ padding: "20px" }}>
              Loading analyses...
            </p>
          ) : recent.length === 0 ? (
            <p style={{ padding: "20px" }}>
              No analyses yet. Analyze your first code!
            </p>
          ) : (
            recent.map((item) => (
              <AnalysisRow
                key={item.id}
                icon={getLanguageIcon(item.language)}
                file={`${item.language} Code`}
                language={item.language}
                time={getTimeAgo(item.created_at)}
                quality={`${item.score}%`}
                type={getQualityType(item.score)}
              />
            ))
          )}
        </div>

        {/* AI CARD */}

        <div className="ai-big-card">
          <div className="robot">🤖</div>

          <div className="ai-content">
            <h2>🤖 CodeLens AI</h2>

            <h3>Need help with your code?</h3>

            <p>
              Ask our AI Assistant about bugs,
              optimization, errors and programming concepts.
            </p>

            <button onClick={() => setPage("ai")}>
              Ask AI Assistant →
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="glass-card quick-card">
        <div className="card-heading">
          <div>
            <h2>Quick Actions</h2>

            <p>Access your favorite tools</p>
          </div>
        </div>

        <div className="quick-grid">
          <button onClick={() => setPage("analyzer")}>
            <div className="quick-icon blue">💻</div>

            <strong>Analyze Code</strong>
          </button>

          <button onClick={() => setPage("history")}>
            <div className="quick-icon green-bg">◷</div>

            <strong>View History</strong>
          </button>

          <button onClick={() => setPage("analytics")}>
            <div className="quick-icon purple">📊</div>

            <strong>View Analytics</strong>
          </button>

          <button onClick={() => setPage("ai")}>
            <div className="quick-icon pink">🤖</div>

            <strong>Open AI Assistant</strong>
          </button>
        </div>
      </div>

      {/* BOTTOM */}

      <div className="bottom-grid">
        <div className="glass-card activity-card">
          <h2>Recent Activity</h2>

          {recent.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            recent.slice(0, 3).map((item) => (
              <Activity
                key={item.id}
                icon={item.bugs > 0 ? "⚠" : "✓"}
                text={
                  item.bugs > 0
                    ? `${item.bugs} issue(s) found`
                    : "Code analysis completed"
                }
                file={item.language}
              />
            ))
          )}
        </div>

        <div className="future-card">
          <div className="future-icon">💻</div>

          <h2>Better Code</h2>

          <h2>Brighter Future</h2>

          <p>❤️ CodeLens AI</p>
        </div>
      </div>
    </>
  );
}

/* =====================================================
   ANALYSIS ROW
===================================================== */

function AnalysisRow({
  icon,
  file,
  language,
  time,
  quality,
  type,
}) {
  return (
    <div className="analysis-row">
      <div className={`file-box ${icon.toLowerCase()}`}>
        {icon}
      </div>

      <div className="file-info">
        <strong>{file}</strong>

        <span>
          {language} • {time}
        </span>
      </div>

      <div className={`quality ${type}`}>
        {quality}
      </div>

      <span className="arrow">›</span>
    </div>
  );
}

/* =====================================================
   ACTIVITY
===================================================== */

function Activity({ icon, text, file }) {
  return (
    <div className="activity-row">
      <div className="activity-icon">{icon}</div>

      <div>
        <strong>{text}</strong>

        <span>{file} • recently</span>
      </div>
    </div>
  );
}

/* =====================================================
   HISTORY
===================================================== */

function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/analyses")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.analyses || []);
        }
      })
      .catch((error) => {
        console.error("History API Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analysis History</h1>

        <p>View all your previous code analyses.</p>
      </div>

      <div className="glass-card table-card">
        <div className="history-head">
          <span>Code</span>
          <span>Language</span>
          <span>Issues</span>
          <span>Quality</span>
          <span>Time</span>
        </div>

        {loading ? (
          <p style={{ padding: "20px" }}>
            Loading history...
          </p>
        ) : data.length === 0 ? (
          <p style={{ padding: "20px" }}>
            No analysis history available.
          </p>
        ) : (
          data.map((item) => (
            <div
              className="history-row"
              key={item.id}
            >
              <strong>
                📄 {item.language} Code
              </strong>

              <span>{item.language}</span>

              <span>{item.bugs || 0}</span>

              <span className="quality good">
                {item.score || 0}%
              </span>

              <span>
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =====================================================
   ANALYTICS
===================================================== */

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalytics(data.analytics);
        }
      })
      .catch((error) => {
        console.error("Analytics API Error:", error);
      });
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>

        <p>Track your coding performance.</p>
      </div>

      <div className="analytics-grid">
        <Metric
          title="Total Analyses"
          value={analytics?.totalAnalyses ?? "..."}
          text="Live database"
        />

        <Metric
          title="Average Quality"
          value={
            analytics
              ? `${analytics.averageScore}%`
              : "..."
          }
          text="Average AI score"
        />

        <Metric
          title="Issues Found"
          value={analytics?.totalIssues ?? "..."}
          text="Detected by AI"
        />
      </div>

      <div className="glass-card language-card">
        <h2>Language Performance</h2>

        <p>Your coding quality by language</p>

        {analytics?.languages?.length ? (
          analytics.languages.map((item) => (
            <Language
              key={item.language}
              name={item.language}
              value={Math.round(
                item.averageScore || 0
              )}
            />
          ))
        ) : (
          <p style={{ marginTop: "20px" }}>
            No language analytics available yet.
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value, text }) {
  return (
    <div className="metric-card">
      <span>{title}</span>

      <h2>{value}</h2>

      <p>{text}</p>
    </div>
  );
}

function Language({ name, value }) {
  return (
    <div className="language-item">
      <div>
        <span>{name}</span>

        <strong>{value}%</strong>
      </div>

      <div className="progress">
        <span style={{ width: `${value}%` }}></span>
      </div>
    </div>
  );
}

/* =====================================================
   AI ASSISTANT
===================================================== */

function AIAssistant() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text:
        "Hello Neha! 👋 I'm CodeLens AI. Ask me anything about programming, debugging, DSA, Java, C++, JavaScript or web development.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  /* SEND MESSAGE */

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: data.answer,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text:
              "❌ " +
              (data.message ||
                "AI response failed."),
          },
        ]);
      }
    } catch (error) {
      console.error(
        "AI Assistant Error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "❌ Backend se connection nahi ho raha. Check karo ki server.js port 5000 par running hai.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* CLEAR CHAT */

  const clearChat = () => {
    setMessages([
      {
        type: "ai",
        text:
          "Hello Neha! 👋 I'm CodeLens AI. Ask me anything about programming.",
      },
    ]);
  };

  /* SUGGESTION */

  const useSuggestion = (text) => {
    setMessage(text);
  };

  return (
    <div className="ai-page">
      <div className="ai-page-header">
        <div>
          <h1>AI Assistant 🤖</h1>

          <p>
            Your personal AI programming assistant.
          </p>
        </div>

        <button
          className="clear-chat-btn"
          onClick={clearChat}
        >
          🗑 Clear Chat
        </button>
      </div>

      <div className="ai-chat glass-card">
        {/* CHAT HEADER */}

        <div className="chat-header">
          <div className="chat-profile">
            <div className="chat-avatar">
              🤖
            </div>

            <div className="chat-user-info">
              <strong>CodeLens AI</strong>

              <span>
                <i></i> Online
              </span>
            </div>
          </div>

          <div className="ai-status">
            AI Assistant
          </div>
        </div>

        {/* SUGGESTIONS */}

        {messages.length === 1 && !loading && (
          <div className="ai-suggestions">
            <p>Try asking:</p>

            <div className="suggestion-buttons">
              <button
                onClick={() =>
                  useSuggestion(
                    "Explain Java OOP concepts in simple language."
                  )
                }
              >
                💡 Explain Java OOP
              </button>

              <button
                onClick={() =>
                  useSuggestion(
                    "How can I improve my coding logic?"
                  )
                }
              >
                🧠 Improve Coding Logic
              </button>

              <button
                onClick={() =>
                  useSuggestion(
                    "Explain time complexity with examples."
                  )
                }
              >
                ⚡ Time Complexity
              </button>

              <button
                onClick={() =>
                  useSuggestion(
                    "Give me important JavaScript interview questions."
                  )
                }
              >
                💻 JavaScript Interview
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES */}

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-row ${msg.type}`}
            >
              {msg.type === "ai" && (
                <div className="message-avatar">
                  🤖
                </div>
              )}

              <div
                className={`message ${msg.type}`}
              >
                {msg.text}
              </div>

              {msg.type === "user" && (
                <div className="message-avatar user-avatar">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* THINKING */}

          {loading && (
            <div className="message-row ai">
              <div className="message-avatar">
                🤖
              </div>

              <div className="message ai thinking">
                <span>
                  CodeLens AI is thinking
                </span>

                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="chat-input">
          <input
            type="text"
            value={message}
            disabled={loading}
            placeholder="Ask something about your code..."
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={
              loading || !message.trim()
            }
          >
            {loading ? "..." : "Send →"}
          </button>
        </div>

        <div className="chat-footer">
          🔒 CodeLens AI Assistant
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SETTINGS
===================================================== */

function Settings() {
  const [name, setName] = useState(
    localStorage.getItem("codelens_name") ||
      "Neha Malviya"
  );

  const [email] = useState(
    localStorage.getItem("codelens_email") ||
      "nehamalviya036@gmail.com"
  );

  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    localStorage.setItem(
      "codelens_name",
      name
    );

    localStorage.setItem(
      "codelens_email",
      email
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">
      {/* HEADER */}

      <div className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your CodeLens AI profile
          and preferences.
        </p>
      </div>

      {/* PROFILE */}

      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>👤 Profile</h2>

            <p>
              Update your personal information.
            </p>
          </div>
        </div>

        <div className="profile-preview">
          <div className="profile-avatar">
            {name
              ? name.charAt(0).toUpperCase()
              : "N"}
          </div>

          <div>
            <h3>{name || "Your Name"}</h3>

            <span>CodeLens AI User</span>
          </div>
        </div>

        <div className="setting-field">
          <label>Full Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your name"
          />
        </div>

        <div className="setting-field">
          <label>Email Address</label>

          <input
            type="email"
            value={email}
            disabled
          />

          <small>
            Email cannot be changed from this page.
          </small>
        </div>

        <div className="settings-actions">
          <button
            className="save-settings-btn"
            onClick={saveProfile}
          >
            💾 Save Profile
          </button>

          {saved && (
            <span className="saved-message">
              ✅ Profile saved successfully!
            </span>
          )}
        </div>
      </div>

      {/* ACCOUNT */}

      <div className="settings-card">
        <h2>🔐 Account</h2>

        <div className="account-row">
          <div>
            <strong>Account Status</strong>

            <p>
              Your CodeLens AI account is active.
            </p>
          </div>

          <span className="active-badge">
            Active
          </span>
        </div>
      </div>

      {/* ABOUT */}

      <div className="settings-card">
        <h2>ℹ️ About CodeLens AI</h2>

        <p className="about-text">
          CodeLens AI is an intelligent code
          analysis platform that helps developers
          find bugs, improve code quality,
          analyze complexity and identify
          security issues.
        </p>

        <span className="version">
          CodeLens AI • Version 1.0
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   APP
===================================================== */

function App() {
  const [page, setPage] =
    useState("dashboard");

  const [profileName, setProfileName] =
    useState(
      localStorage.getItem(
        "codelens_name"
      ) || "Neha Malviya"
    );

  useEffect(() => {
    const updateProfile = () => {
      setProfileName(
        localStorage.getItem(
          "codelens_name"
        ) || "Neha Malviya"
      );
    };

    window.addEventListener(
      "storage",
      updateProfile
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateProfile
      );
    };
  }, []);

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            ✚
          </div>

          <div>
            <h2>
              Code<span>Lens AI</span>
            </h2>

            <p>AI Code Intelligence</p>
          </div>
        </div>

        <nav>
          <button
            className={
              page === "dashboard"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("dashboard")
            }
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              page === "analyzer"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("analyzer")
            }
          >
            <span>💻</span>
            Code Analyzer
          </button>

          <button
            className={
              page === "history"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("history")
            }
          >
            <span>◴</span>
            History
          </button>

          <button
            className={
              page === "analytics"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("analytics")
            }
          >
            <span>▥</span>
            Analytics
          </button>

          <button
            className={
              page === "ai"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("ai")
            }
          >
            <span>🤖</span>
            AI Assistant
          </button>

          <button
            className={
              page === "settings"
                ? "nav active"
                : "nav"
            }
            onClick={() =>
              setPage("settings")
            }
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        {/* USER */}

        <div className="user-box">
          <div className="avatar">
            {profileName
              ? profileName
                  .charAt(0)
                  .toUpperCase()
              : "N"}
          </div>

          <div>
            <strong>
              {profileName}
            </strong>

            <span>CSE Student</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main">
        <header className="topbar">
          <div className="search">
            🔍

            <input
              placeholder="Search anything..."
            />
          </div>

          <div className="top-actions">
            <button className="notification">
              🔔
            </button>

            <div className="top-avatar">
              {profileName
                ? profileName
                    .charAt(0)
                    .toUpperCase()
                : "N"}
            </div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <Dashboard
              setPage={setPage}
            />
          )}

          {page === "analyzer" && (
            <CodeAnalyzer />
          )}

          {page === "history" && (
            <History />
          )}

          {page === "analytics" && (
            <Analytics />
          )}

          {page === "ai" && (
            <AIAssistant />
          )}

          {page === "settings" && (
            <Settings />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;