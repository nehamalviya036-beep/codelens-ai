function History() {

    const [analyses, setAnalyses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {

        fetch("http://localhost:5000/api/analyses")

            .then((res) => res.json())

            .then((data) => {

                if (data.success) {

                    setAnalyses(data.analyses || []);

                } else {

                    setError(
                        data.message || "Unable to load history"
                    );

                }

            })

            .catch((err) => {

                console.error(err);

                setError(
                    "Backend server se connection nahi ho raha."
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);

    // =====================================
    // FORMAT DATE
    // =====================================

    const formatDate = (date) => {

        if (!date) return "Unknown";

        return new Date(date).toLocaleString();

    };

    // =====================================
    // LANGUAGE ICON
    // =====================================

    const getIcon = (language) => {

        const lang =
            language?.toLowerCase();

        if (lang === "javascript")
            return "JS";

        if (lang === "python")
            return "PY";

        if (lang === "java")
            return "JV";

        if (lang === "cpp")
            return "C++";

        if (lang === "c")
            return "C";

        if (lang === "typescript")
            return "TS";

        return "</>";

    };

    return (

        <div className="history-page">

            {/* HEADER */}

            <div className="history-header">

                <div>

                    <h1>
                        Analysis History
                    </h1>

                    <p>
                        View all your previous code analyses.
                    </p>

                </div>

                <div className="history-count">

                    {analyses.length} Analyses

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-box">

                    ⚠️ {error}

                </div>

            )}


            {/* LOADING */}

            {loading && (

                <div className="history-loading">

                    <div className="loader"></div>

                    <p>
                        Loading analysis history...
                    </p>

                </div>

            )}


            {/* EMPTY */}

            {!loading &&
            !error &&
            analyses.length === 0 && (

                <div className="empty-history">

                    <div className="empty-icon">
                        📂
                    </div>

                    <h2>
                        No Analysis Found
                    </h2>

                    <p>
                        Analyze your first piece of code
                        to see it here.
                    </p>

                </div>

            )}


            {/* HISTORY LIST */}

            {!loading &&
            analyses.length > 0 && (

                <div className="history-list">

                    {analyses.map((item) => (

                        <div
                            className="history-card"
                            key={item.id}
                        >

                            <div className="history-icon">

                                {getIcon(item.language)}

                            </div>


                            <div className="history-info">

                                <h3>
                                    {item.language}
                                </h3>

                                <p>
                                    Analysis #{item.id}
                                </p>

                                <small>
                                    {formatDate(
                                        item.created_at
                                    )}
                                </small>

                            </div>


                            <div className="history-issues">

                                <strong>
                                    {item.bugs}
                                </strong>

                                <span>
                                    Issues
                                </span>

                            </div>


                            <div
                                className={
                                    `history-score ${
                                        item.score >= 80
                                            ? "good"
                                            : item.score >= 50
                                            ? "medium"
                                            : "bad"
                                    }`
                                }
                            >

                                {item.score}/100

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}