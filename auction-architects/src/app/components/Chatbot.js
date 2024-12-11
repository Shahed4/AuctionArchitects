"use client";

import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Scroll to the bottom of the chat when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Loading message
    const loadingMessage = { role: "assistant", content: "Bot is thinking..." };
    setMessages((prev) => [...prev, loadingMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are an assistant deeply familiar with the "Auction Architects" platform. Always respond in a friendly, informative manner. Keep responses to only a few sentences so the user can read them easily.  
                Platform Overview (Short Recap):
                - Users: Visitor, User, Super-User.
                - Features: Create/Browse Listings, View Profile(includes listings, bids placed), Place Bids, Secure Transactions, Detailed Vehicle History, Ratings/Feedback.
                - Security & Admin: Verified accounts, admin oversight.
                - Provide short, helpful answers.` 
          },
          ...updatedMessages
        ]
      })
    });

    const data = await res.json();

    let finalMessages = [...updatedMessages];
    if (data.response) {
      finalMessages.push(data.response);
    } else {
      finalMessages.push({
        role: "assistant",
        content: "Sorry, something went wrong."
      });
    }

    setMessages(finalMessages);
  };

  const containerBaseStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    zIndex: 9999,
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
    transition: "width 0.3s, height 0.3s"
  };

  const minimizedStyle = {
    ...containerBaseStyle,
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#0070f3",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center"
  };

  const expandedStyle = {
    ...containerBaseStyle,
    width: "300px",
    height: "400px"
  };

  return (
    <div 
      style={isOpen ? expandedStyle : minimizedStyle}
      onClick={!isOpen ? toggleOpen : undefined} // Only toggle when minimized
    >
      {isOpen ? (
        <>
          {/* Header (fixed at top, no scrolling) */}
          <div
            style={{
              background: "#0070f3",
              color: "#fff",
              padding: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0
            }}
          >
            <span style={{ fontWeight: "bold" }}>Chatbot</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold"
              }}
            >
              –
            </button>
          </div>

          {/* Messages Container (scrollable) */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              color: "#000000",
              wordWrap: "break-word",
              overflowWrap: "break-word"
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <strong>{m.role === "user" ? "You:" : "Bot:"}</strong>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{m.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Container (fixed at bottom, no scrolling) */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc", flexShrink: 0 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, border: "none", padding: "10px" }}
              placeholder="Ask a question..."
            />
            <button
              onClick={sendMessage}
              style={{
                border: "none",
                padding: "10px",
                background: "#0070f3",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        // Minimized State
        <div style={{ color: "#fff", fontSize: "24px" }}>
          💬
        </div>
      )}
    </div>
  );
}
