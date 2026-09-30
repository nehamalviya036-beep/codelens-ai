// =====================================
// CODELENS AI - BACKEND SERVER
// GEMINI + MYSQL VERSION
// =====================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const { GoogleGenAI } = require("@google/genai");

// =====================================
// LOAD ENVIRONMENT VARIABLES
// =====================================

dotenv.config();

// =====================================
// CREATE EXPRESS APP
// =====================================

const app = express();

// =====================================
// CONFIGURATION
// =====================================

const PORT = process.env.PORT || 5000;

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(
    express.json({
        limit: "5mb"
    })
);

// =====================================
// MYSQL CONNECTION
// =====================================

const db = mysql.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port:
        Number(process.env.DB_PORT) || 3306,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

// =====================================
// GEMINI AI
// =====================================

let ai = null;

if (process.env.GEMINI_API_KEY) {

    ai = new GoogleGenAI({

        apiKey:
            process.env.GEMINI_API_KEY

    });

    console.log(
        "✅ Gemini API configured"
    );

} else {

    console.log(
        "⚠️ GEMINI_API_KEY not found"
    );

}

// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "🚀 CodeLens AI Backend is running",

        ai:
            ai
                ? "Gemini configured"
                : "Gemini not configured"

    });

});

// =====================================
// TEST DATABASE
// =====================================

app.get(
    "/api/test-db",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(
                    "SELECT 1 AS test"
                );

            res.json({

                success: true,

                message:
                    "✅ MySQL Connected",

                data:
                    rows

            });

        } catch (error) {

            console.error(
                "❌ Database Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Database connection failed",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// AI CHAT
// =====================================

app.post(
    "/api/ai/chat",
    async (req, res) => {

        try {

            const {
                message
            } = req.body;

            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (
                !message ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Message is required"

                });

            }

            // -----------------------------
            // CHECK GEMINI
            // -----------------------------

            if (!ai) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Gemini API key is not configured"

                });

            }

            // -----------------------------
            // GEMINI REQUEST
            // -----------------------------

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3.8-flash",

                    contents:
                        message,

                    config: {

                        systemInstruction:
                            `
You are CodeLens AI,
an expert programming assistant.

Help students with:

- Java
- C++
- Python
- JavaScript
- React
- Node.js
- Express
- MySQL
- SQL
- DBMS
- DSA
- OOPS
- Debugging
- Web Development
- Software Development

Give simple,
practical and accurate explanations.

When explaining code,
explain the logic first,
then provide code.
`

                    }

                });

            // -----------------------------
            // GET RESPONSE
            // -----------------------------

            const answer =
                response.text ||
                "Sorry, I could not generate a response.";

            // -----------------------------
            // SAVE CHAT HISTORY
            // -----------------------------

            try {

                await db.query(

                    `
                    INSERT INTO chat_history
                    (user_message, ai_response)
                    VALUES (?, ?)
                    `,

                    [
                        message,
                        answer
                    ]

                );

            } catch (dbError) {

                console.log(
                    "⚠️ Chat history save error:",
                    dbError.message
                );

            }

            // -----------------------------
            // RESPONSE
            // -----------------------------

            res.json({

                success: true,

                message:
                    answer

            });

        } catch (error) {

            console.error(
                "❌ Gemini Chat Error:"
            );

            console.error(
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "AI chat failed",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// AI CODE ANALYZER
// =====================================

app.post(
    "/api/analyze",
    async (req, res) => {

        try {

            const {
                code,
                language
            } = req.body;

            // =================================
            // VALIDATION
            // =================================

            if (
                !code ||
                !code.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Code is required"

                });

            }

            if (
                !language ||
                !language.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Programming language is required"

                });

            }

            // =================================
            // CHECK GEMINI
            // =================================

            if (!ai) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Gemini API key is not configured"

                });

            }

            // =================================
            // AI PROMPT
            // =================================

            const prompt = `

You are CodeLens AI.

You are an expert:

- Software Engineer
- Debugger
- Code Reviewer
- Security Analyst
- Performance Analyst

Analyze the following
${language} code.

==============================
CODE
==============================

${code}

==============================
TASK
==============================

Find:

1. Syntax errors
2. Logical errors
3. Runtime errors
4. Performance problems
5. Security problems
6. Code quality problems
7. Possible improvements

==============================
IMPORTANT
==============================

Return ONLY valid JSON.

Do not use markdown.

Do not use:

\`\`\`json

or

\`\`\`

Use EXACTLY this structure:

{
  "score": 0,
  "bugs": 0,
  "issues": [
    {
      "severity": "Critical",
      "line": 1,
      "title": "Issue title",
      "description": "Detailed explanation",
      "fix": "How to fix the issue"
    }
  ],
  "complexity": {
    "time": "O(?)",
    "space": "O(?)"
  },
  "optimizations": [],
  "security": [],
  "fixedCode": "Complete corrected code",
  "explanation": "Short explanation"
}

==============================
RULES
==============================

1. score must be between 0 and 100.

2. bugs must represent
the number of real bugs/issues.

3. Do not invent bugs.

4. Identify syntax errors.

5. Identify logical errors.

6. Identify runtime errors.

7. Identify performance issues.

8. Identify security issues.

9. Give line numbers whenever possible.

10. Give practical fixes.

11. Provide complete corrected
code in fixedCode.

12. If there are no bugs,
bugs must be 0.

13. issues must always be an array.

14. optimizations must always be an array.

15. security must always be an array.

16. Return JSON only.
`;

            // =================================
            // GEMINI REQUEST
            // =================================

       const response =
    await ai.models.generateContent({

        model:
            "gemini-3.5-flash-lite",

        contents:
            prompt,

        config: {

            responseMimeType:
                "application/json"

        }

    });
            // =================================
            // GET AI TEXT
            // =================================

            const aiText =
                response.text || "";

            console.log(
                "🤖 Gemini Response Received"
            );

            // =================================
            // PARSE JSON
            // =================================

            let result;

            try {

                result =
                    JSON.parse(aiText);

            } catch (parseError) {

                console.log(
                    "⚠️ AI returned invalid JSON"
                );

                console.log(
                    aiText
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "AI returned invalid JSON",

                    raw:
                        aiText

                });

            }

            // =================================
            // DEFAULT VALUES
            // =================================

            result.score =
                Number(
                    result.score
                ) || 0;

            result.bugs =
                Number(
                    result.bugs
                ) || 0;

            result.issues =
                Array.isArray(
                    result.issues
                )
                    ? result.issues
                    : [];

            result.optimizations =
                Array.isArray(
                    result.optimizations
                )
                    ? result.optimizations
                    : [];

            result.security =
                Array.isArray(
                    result.security
                )
                    ? result.security
                    : [];

            result.complexity =
                result.complexity || {

                    time: "O(?)",

                    space: "O(?)"

                };

            result.fixedCode =
                result.fixedCode || "";

            result.explanation =
                result.explanation || "";

            // =================================
            // SAVE ANALYSIS TO MYSQL
            // =================================

            try {

                await db.query(

                    `
                    INSERT INTO analyses
                    (language, code, result)
                    VALUES (?, ?, ?)
                    `,

                    [
                        language,

                        code,

                        JSON.stringify(
                            result
                        )

                    ]

                );

                console.log(
                    "✅ Analysis saved to MySQL"
                );

            } catch (dbError) {

                console.error(
                    "⚠️ Analysis save error:",
                    dbError.message
                );

            }

            // =================================
            // RESPONSE
            // =================================

            res.json({

                success: true,

                message:
                    "Code analyzed successfully",

                language:
                    language,

                result:
                    result

            });

        } catch (error) {

            console.error(
                "❌ AI Analysis Error:"
            );

            console.error(
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Code analysis failed",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// GET ALL ANALYSES
// =====================================

app.get(
    "/api/analyses",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(`

                    SELECT
                        id,
                        language,
                        code,
                        result,
                        created_at

                    FROM analyses

                    ORDER BY
                        created_at DESC

                `);

            const analyses =
                rows.map((item) => {

                    let result = {};

                    try {

                        result =
                            typeof item.result === "string"

                                ? JSON.parse(
                                    item.result
                                )

                                : item.result;

                    } catch (error) {

                        result = {};

                    }

                    return {

                        id:
                            item.id,

                        language:
                            item.language,

                        code:
                            item.code,

                        score:
                            Number(
                                result?.score || 0
                            ),

                        bugs:
                            Number(
                                result?.bugs || 0
                            ),

                        issues:
                            result?.issues || [],

                        complexity:
                            result?.complexity || {},

                        optimizations:
                            result?.optimizations || [],

                        security:
                            result?.security || [],

                        fixedCode:
                            result?.fixedCode || "",

                        explanation:
                            result?.explanation || "",

                        created_at:
                            item.created_at

                    };

                });

            res.json({

                success: true,

                count:
                    analyses.length,

                analyses:
                    analyses

            });

        } catch (error) {

            console.error(
                "❌ Get Analyses Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch analyses",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// GET CHAT HISTORY
// =====================================

app.get(
    "/api/chat-history",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(`

                    SELECT
                        id,
                        user_message,
                        ai_response,
                        created_at

                    FROM chat_history

                    ORDER BY
                        created_at DESC

                `);

            res.json({

                success: true,

                history:
                    rows

            });

        } catch (error) {

            console.error(
                "❌ Chat History Error:",
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch chat history",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// DASHBOARD LIVE DATA
// =====================================

app.get(
    "/api/dashboard-stats",
    async (req, res) => {

        try {

            // =================================
            // GET ANALYSES
            // =================================

            const [rows] =
                await db.query(`

                    SELECT
                        id,
                        language,
                        code,
                        result,
                        created_at

                    FROM analyses

                    ORDER BY
                        created_at DESC

                `);

            // =================================
            // CALCULATE STATS
            // =================================

            const totalAnalyses =
                rows.length;

            let issuesFound = 0;

            let totalScore = 0;

            rows.forEach((item) => {

                try {

                    const result =
                        typeof item.result === "string"

                            ? JSON.parse(
                                item.result
                            )

                            : item.result;

                    issuesFound +=
                        Number(
                            result?.bugs || 0
                        );

                    totalScore +=
                        Number(
                            result?.score || 0
                        );

                } catch (error) {

                    console.log(
                        "⚠️ Invalid result:",
                        item.id
                    );

                }

            });

            // =================================
            // CODE QUALITY
            // =================================

            const codeQuality =
                totalAnalyses > 0

                    ? Math.round(
                        totalScore /
                        totalAnalyses
                    )

                    : 0;

            // =================================
            // RECENT ANALYSES
            // =================================

            const recent =
                rows
                    .slice(0, 5)
                    .map((item) => {

                        let result = {};

                        try {

                            result =
                                typeof item.result === "string"

                                    ? JSON.parse(
                                        item.result
                                    )

                                    : item.result;

                        } catch (error) {

                            result = {};

                        }

                        return {

                            id:
                                item.id,

                            language:
                                item.language,

                            code:
                                item.code,

                            score:
                                Number(
                                    result?.score || 0
                                ),

                            bugs:
                                Number(
                                    result?.bugs || 0
                                ),

                            created_at:
                                item.created_at

                        };

                    });

            // =================================
            // RESPONSE
            // =================================

            res.json({

                success: true,

                stats: {

                    totalAnalyses:
                        totalAnalyses,

                    issuesFound:
                        issuesFound,

                    codeQuality:
                        codeQuality,

                    problemsSolved:
                        0

                },

                recent:
                    recent

            });

        } catch (error) {

            console.error(
                "❌ Dashboard API Error:"
            );

            console.error(
                error.message
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to load dashboard data",

                error:
                    error.message

            });

        }

    }
);

// =====================================
// 404 ROUTE
// =====================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found"

        });

    }
);

// =====================================
// START SERVER
// =====================================

async function startServer() {

    try {

        // =================================
        // TEST DATABASE CONNECTION
        // =================================

        const connection =
            await db.getConnection();

        console.log(
            "✅ MySQL Database Connected"
        );

        connection.release();

        // =================================
        // START SERVER
        // =================================

        app.listen(
            PORT,
            () => {

                console.log("");

                console.log(
                    "====================================="
                );

                console.log(
                    "🚀 CodeLens AI Backend Started"
                );

                console.log(
                    `🌐 Server: http://localhost:${PORT}`
                );

                console.log(
                    `🤖 AI API: http://localhost:${PORT}/api/analyze`
                );

                console.log(
                    `💬 AI Chat: http://localhost:${PORT}/api/ai/chat`
                );

                console.log(
                    `📊 Dashboard: http://localhost:${PORT}/api/dashboard-stats`
                );

                console.log(
                    `📚 History: http://localhost:${PORT}/api/analyses`
                );

                console.log(
                    "====================================="
                );

                console.log("");

            }
        );

    } catch (error) {

        console.error(
            "❌ Unable to start server"
        );

        console.error(
            error.message
        );

        process.exit(1);

    }

}

// =====================================
// START APPLICATION
// =====================================

startServer();