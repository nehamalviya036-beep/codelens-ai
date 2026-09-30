function Settings() {

    const [name, setName] = React.useState(
        localStorage.getItem("codelens_name") || "Neha Malviya"
    );

    const [email] = React.useState(
        localStorage.getItem("codelens_email") ||
        "nehamalviya036@gmail.com"
    );

    const [saved, setSaved] = React.useState(false);

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

                <h1>
                    Settings
                </h1>

                <p>
                    Manage your CodeLens AI profile
                    and preferences.
                </p>

            </div>


            {/* PROFILE */}

            <div className="settings-card">

                <div className="settings-card-header">

                    <div>

                        <h2>
                            👤 Profile
                        </h2>

                        <p>
                            Update your personal information.
                        </p>

                    </div>

                </div>


                {/* PROFILE AVATAR */}

                <div className="profile-preview">

                    <div className="profile-avatar">

                        {name
                            ? name.charAt(0).toUpperCase()
                            : "N"}

                    </div>

                    <div>

                        <h3>
                            {name || "Your Name"}
                        </h3>

                        <span>
                            CodeLens AI User
                        </span>

                    </div>

                </div>


                {/* NAME */}

                <div className="setting-field">

                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter your name"
                    />

                </div>


                {/* EMAIL */}

                <div className="setting-field">

                    <label>
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        disabled
                    />

                    <small>
                        Email cannot be changed from this page.
                    </small>

                </div>


                {/* SAVE */}

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

                <h2>
                    🔐 Account
                </h2>

                <div className="account-row">

                    <div>

                        <strong>
                            Account Status
                        </strong>

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

                <h2>
                    ℹ️ About CodeLens AI
                </h2>

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
