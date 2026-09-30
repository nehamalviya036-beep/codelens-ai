import React from "react";

function Analytics() {
  return (
    <div className="extra-page">
      <div className="extra-header">
        <div>
          <h1>📊 Analytics</h1>
          <p>Track your coding and debugging performance.</p>
        </div>
      </div>

      <div className="analytics-cards">

        <div className="analytics-card">
          <div className="analytics-icon">🐞</div>
          <h2>42</h2>
          <p>Total Errors</p>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">✅</div>
          <h2>35</h2>
          <p>Errors Solved</p>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">💻</div>
          <h2>128</h2>
          <p>Code Analyses</p>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">🔥</div>
          <h2>87%</h2>
          <p>Success Rate</p>
        </div>

      </div>

      <div className="analytics-box">
        <h2>Programming Languages</h2>

        <div className="language-row">
          <div className="language-title">
            <span>Java</span>
            <span>75%</span>
          </div>

          <div className="bar">
            <div style={{ width: "75%" }}></div>
          </div>
        </div>

        <div className="language-row">
          <div className="language-title">
            <span>JavaScript</span>
            <span>65%</span>
          </div>

          <div className="bar">
            <div style={{ width: "65%" }}></div>
          </div>
        </div>

        <div className="language-row">
          <div className="language-title">
            <span>Python</span>
            <span>50%</span>
          </div>

          <div className="bar">
            <div style={{ width: "50%" }}></div>
          </div>
        </div>

        <div className="language-row">
          <div className="language-title">
            <span>C++</span>
            <span>60%</span>
          </div>

          <div className="bar">
            <div style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>

      <div className="analytics-box">
        <h2>Weekly Activity</h2>

        <div className="chart">
          <div className="chart-column" style={{ height: "45%" }}>
            <span>Mon</span>
          </div>

          <div className="chart-column" style={{ height: "70%" }}>
            <span>Tue</span>
          </div>

          <div className="chart-column" style={{ height: "55%" }}>
            <span>Wed</span>
          </div>

          <div className="chart-column" style={{ height: "85%" }}>
            <span>Thu</span>
          </div>

          <div className="chart-column" style={{ height: "65%" }}>
            <span>Fri</span>
          </div>

          <div className="chart-column" style={{ height: "90%" }}>
            <span>Sat</span>
          </div>

          <div className="chart-column" style={{ height: "40%" }}>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;