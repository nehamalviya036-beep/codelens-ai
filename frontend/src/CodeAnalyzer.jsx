import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeAnalyzer() {

    const [language, setLanguage] = useState("javascript");

    const [code, setCode] = useState(
`function add(a, b) {
    return a + b;
}

console.log(add(5, 10));`
    );

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // =====================================
    // ANALYZE CODE
    // =====================================

    const analyzeCode = async () => {

        if (!code.trim()) {

            setError("Please enter some code.");

            return;
        }

        setLoading(true);

        setError("");

        setResult(null);

        try {

            const response = await fetch(
                "http://localhost:5000/api/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        code: code,
                        language: language
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Code analysis failed"
                );

            }

            setResult(data.result);

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to connect to backend"
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================
    // CLEAR
    // =====================================

    const clearCode = () => {

        setCode("");

        setResult(null);

        setError("");

    };

    // =====================================
    // LANGUAGE CHANGE
    // =====================================

    const handleLanguageChange = (e) => {

        setLanguage(e.target.value);

        setResult(null);

    };

    return (

        <div className="analyzer-page">

            {/* =================================
                HEADER
            ================================= */}

            <div className="analyzer-header">

                <div>

                    <h1>
                        AI Code Analyzer
                    </h1>

                    <p>
                        Analyze your code for bugs,
                        security issues and optimization.
                    </p>

                </div>

                <div className="analyzer-actions">

                    <select
                        value={language}
                        onChange={handleLanguageChange}
                    >

                        <option value="javascript">
                            JavaScript
                        </option>

                        <option value="python">
                            Python
                        </option>

                        <option value="java">
                            Java
                        </option>

                        <option value="cpp">
                            C++
                        </option>

                        <option value="c">
                            C
                        </option>

                        <option value="typescript">
                            TypeScript
                        </option>

                    </select>

                    <button
                        className="clear-btn"
                        onClick={clearCode}
                    >
                        Clear
                    </button>

                    <button
                        className="analyze-btn"
                        onClick={analyzeCode}
                        disabled={loading}
                    >

                        {loading
                            ? "Analyzing..."
                            : "⚡ Analyze Code"}

                    </button>

                </div>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="error-box">

                    ⚠️ {error}

                </div>

            )}


            {/* =================================
                EDITOR
            ================================= */}

            <div className="code-editor-card">

                <div className="editor-topbar">

                    <span>
                        💻 {language.toUpperCase()}
                    </span>

                    <span>
                        {code.length} characters
                    </span>

                </div>

                <Editor

                    height="430px"

                    language={language}

                    theme="vs-dark"

                    value={code}

                    onChange={(value) =>
                        setCode(value || "")
                    }

                    options={{

                        minimap: {
                            enabled: false
                        },

                        fontSize: 15,

                        automaticLayout: true,

                        wordWrap: "on",

                        padding: {
                            top: 15
                        }

                    }}

                />

            </div>


            {/* =================================
                LOADING
            ================================= */}

            {loading && (

                <div className="loading-card">

                    <div className="loader"></div>

                    <h3>
                        CodeLens AI is analyzing your code...
                    </h3>

                    <p>
                        Checking bugs, complexity,
                        security and optimization.
                    </p>

                </div>

            )}


            {/* =================================
                RESULT
            ================================= */}

            {result && !loading && (

                <div className="analysis-result">

                    {/* SCORE */}

                    <div className="result-summary">

                        <div className="score-card">

                            <div className="score-circle">

                                <strong>
                                    {result.score}
                                </strong>

                                <span>
                                    /100
                                </span>

                            </div>

                            <h3>
                                Code Quality
                            </h3>

                        </div>


                        <div className="result-stat">

                            <span>
                                🐞
                            </span>

                            <strong>
                                {result.bugs}
                            </strong>

                            <small>
                                Issues Found
                            </small>

                        </div>


                        <div className="result-stat">

                            <span>
                                ⏱️
                            </span>

                            <strong>
                                {result.complexity?.time || "N/A"}
                            </strong>

                            <small>
                                Time Complexity
                            </small>

                        </div>


                        <div className="result-stat">

                            <span>
                                💾
                            </span>

                            <strong>
                                {result.complexity?.space || "N/A"}
                            </strong>

                            <small>
                                Space Complexity
                            </small>

                        </div>

                    </div>


                    {/* ISSUES */}

                    <div className="result-section">

                        <h2>
                            🐞 Issues Found
                        </h2>

                        {result.issues &&
                        result.issues.length > 0 ? (

                            result.issues.map(
                                (issue, index) => (

                                    <div
                                        className="issue-card"
                                        key={index}
                                    >

                                        <div className="issue-header">

                                            <strong>
                                                {issue.title}
                                            </strong>

                                            <span>
                                                {issue.severity}
                                            </span>

                                        </div>

                                        <p>
                                            {issue.description}
                                        </p>

                                        <div className="issue-fix">

                                            <strong>
                                                💡 Fix:
                                            </strong>

                                            <span>
                                                {issue.fix}
                                            </span>

                                        </div>

                                        {issue.line && (

                                            <small>
                                                Line: {issue.line}
                                            </small>

                                        )}

                                    </div>

                                )
                            )

                        ) : (

                            <div className="success-box">

                                ✅ No major issues found!

                            </div>

                        )}

                    </div>


                    {/* OPTIMIZATIONS */}

                    <div className="result-section">

                        <h2>
                            🚀 Optimizations
                        </h2>

                        {result.optimizations &&
                        result.optimizations.length > 0 ? (

                            <ul>

                                {result.optimizations.map(
                                    (item, index) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p>
                                No optimization suggestions.
                            </p>

                        )}

                    </div>


                    {/* SECURITY */}

                    <div className="result-section">

                        <h2>
                            🔐 Security Analysis
                        </h2>

                        {result.security &&
                        result.security.length > 0 ? (

                            <ul>

                                {result.security.map(
                                    (item, index) => (

                                        <li key={index}>
                                            {item}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <div className="success-box">

                                ✅ No major security issues detected.

                            </div>

                        )}

                    </div>


                    {/* EXPLANATION */}

                    <div className="result-section">

                        <h2>
                            🧠 AI Explanation
                        </h2>

                        <p>
                            {result.explanation}
                        </p>

                    </div>


                    {/* FIXED CODE */}

                    {result.fixedCode && (

                        <div className="result-section">

                            <div className="fixed-code-header">

                                <h2>
                                    ✨ AI Fixed Code
                                </h2>

                                <button
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            result.fixedCode
                                        )
                                    }
                                >
                                    Copy Code
                                </button>

                            </div>

                            <pre className="fixed-code">

                                <code>
                                    {result.fixedCode}
                                </code>

                            </pre>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}

export default CodeAnalyzer;