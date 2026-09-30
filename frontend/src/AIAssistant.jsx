import React, { useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello Neha! 👋 I'm CodeLens AI. Ask me anything about programming, debugging, DSA, Java, C++, JavaScript or web development."
    }
  ]);

  const [loading, setLoading] = useState(false);

  // ==============================
  // SEND MESSAGE TO AI
  // ==============================

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage
      }
    ]);

    // Clear input
    setMessage("");

    // Start loading
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userMessage
          })
        }
      );

      const data = await response.json();

      // ==============================
      // SUCCESS RESPONSE
      // ==============================

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: data.answer
          }
        ]);
      }

      // ==============================
      // BACKEND ERROR
      // ==============================

      else {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: "❌ " + (data.message || "Something went wrong.")
          }
        ]);
      }
    }

    // ==============================
    // CONNECTION ERROR
    // ==============================

    catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "❌ Backend se connection nahi ho raha. Check karo ki server.js port 5000 par running hai."
        }
      ]);
    }

    // ==============================
    // STOP LOADING
    // ==============================

    finally {
      setLoading(false);
    }
  };

  // ==============================
  // CLEAR CHAT
  // ==============================

  const clearChat = () => {
    setMessages([
      {
        type: "ai",
        text: "Hello Neha! 👋 I'm CodeLens AI. Ask me anything about programming."
      }
    ]);
  };

  // ==============================
  // SUGGESTED QUESTIONS
  // ==============================

  const askSuggestion = (question) => {
    setMessage(question);
  };

  return (
    <div className="ai-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

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

      {/* =========================
          CHAT CARD
      ========================= */}

      <div className="ai-chat glass-card">

        {/* =========================
            CHAT HEADER
        ========================= */}

        <div className="chat-header">

          <div className="chat-profile">

            <div className="chat-avatar">
              🤖
            </div>

            <div className="chat-user-info">

              <strong>
                CodeLens AI
              </strong>

              <span>
                <i></i> Online
              </span>

            </div>

          </div>

          <div className="ai-status">
            AI Assistant
          </div>

        </div>

        {/* =========================
            SUGGESTIONS
        ========================= */}

        {messages.length === 1 && !loading && (
          <div className="ai-suggestions">

            <p>Try asking:</p>

            <div className="suggestion-buttons">

              <button
                onClick={() =>
                  askSuggestion(
                    "Explain Java OOP concepts in simple language."
                  )
                }
              >
                💡 Explain Java OOP
              </button>

              <button
                onClick={() =>
                  askSuggestion(
                    "How can I improve my coding logic?"
                  )
                }
              >
                🧠 Improve coding logic
              </button>

              <button
                onClick={() =>
                  askSuggestion(
                    "Explain time complexity with examples."
                  )
                }
              >
                ⚡ Time Complexity
              </button>

              <button
                onClick={() =>
                  askSuggestion(
                    "Give me some important JavaScript interview questions."
                  )
                }
              >
                💻 JavaScript Interview
              </button>

            </div>

          </div>
        )}

        {/* =========================
            CHAT MESSAGES
        ========================= */}

        <div className="chat-messages">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message-row ${msg.type}`}
            >

              {/* AI Avatar */}

              {msg.type === "ai" && (
                <div className="message-avatar">
                  🤖
                </div>
              )}

              {/* Message */}

              <div
                className={`message ${msg.type}`}
              >
                {msg.text}
              </div>

              {/* User Avatar */}

              {msg.type === "user" && (
                <div className="message-avatar user-avatar">
                  👤
                </div>
              )}

            </div>

          ))}

          {/* =========================
              THINKING
          ========================= */}

          {loading && (

            <div className="message-row ai">

              <div className="message-avatar">
                🤖
              </div>

              <div className="message ai thinking">

                <span>CodeLens AI is thinking</span>

                <div className="typing-dots">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            </div>

          )}

        </div>

        {/* =========================
            INPUT AREA
        ========================= */}

        <div className="chat-input">

          <input
            type="text"
            placeholder="Ask something about your code..."
            value={message}
            disabled={loading}
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
              loading ||
              !message.trim()
            }
          >
            {loading ? "..." : "Send →"}
          </button>

        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="chat-footer">

          🔒 Your conversations are processed securely through the AI backend.

        </div>

      </div>

    </div>
  );
}

export default AIAssistant;