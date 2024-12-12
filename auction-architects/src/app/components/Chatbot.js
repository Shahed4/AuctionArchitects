"use client";

import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [cars, setCars] = useState([]); // Store all cars
  const [filteredCars, setFilteredCars] = useState([]); // Store filtered cars
  const messagesEndRef = useRef(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Auto-scroll to the bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch car data from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars"); // Fetch from API
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
      }
    };

    fetchCars();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message to the state
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    console.log("User Message:", userMessage); // Debugging: Log user's message
    setMessages(updatedMessages);
    setInput("");

    // Add a loading message
    const loadingMessage = { role: "assistant", content: "Fetching data..." };
    setMessages((prev) => [...prev, loadingMessage]);

    if (input.toLowerCase().includes("show cars")) {
      try {
        if (cars.length > 0) {
          const carList = cars
            .map(
              (car) =>
                `- ${car.make} ${car.model} (${car.year}): $${car.price.toFixed(
                  2
                )}`
            )
            .join("\n");

          const carResponse = {
            role: "assistant",
            content: `Here are some available cars:\n${carList}`,
          };

          console.log("Car Response:", carResponse); // Debugging: Log bot response

          // Update state with bot's response
          setMessages((prev) => [...prev.slice(0, -1), carResponse]); // Replace loading message
        } else {
          const noCarsMessage = {
            role: "assistant",
            content: "No cars are currently available.",
          };
          setMessages((prev) => [...prev.slice(0, -1), noCarsMessage]); // Replace loading message
        }
      } catch (error) {
        console.error("Error displaying cars:", error);
        const errorMessage = {
          role: "assistant",
          content: "Sorry, I couldn't fetch car listings at the moment.",
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]); // Replace loading message
      }
    } else {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are an assistant for the \"Auction Architects\" platform.`,
              },
              ...updatedMessages,
            ],
          }),
        });

        const data = await res.json();
        console.log("OpenAI Response:", data); // Debugging: Log OpenAI API response

        const botMessage = data.response
          ? data.response
          : { role: "assistant", content: "Sorry, something went wrong." };

        setMessages((prev) => [...prev.slice(0, -1), botMessage]); // Replace loading message
      } catch (error) {
        console.error("Error with OpenAI Chat API:", error);
        const errorMessage = {
          role: "assistant",
          content: "Sorry, I couldn't process your request.",
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]); // Replace loading message
      }
    }
  };

  return (
    <div
      style={
        isOpen
          ? {
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
              width: "300px",
              height: "400px",
            }
          : {
              position: "fixed",
              bottom: "20px",
              right: "20px",
              background: "#0070f3",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 9999,
            }
      }
      onClick={!isOpen ? toggleOpen : undefined}
    >
      {isOpen ? (
        <>
          {/* Header */}
          <div
            style={{
              background: "#0070f3",
              color: "#fff",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Chatbot</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
              }}
              style={{ background: "none", border: "none", color: "#fff" }}
            >
              Close
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              color: "#000000",
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

          {/* Input Container */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, border: "none", padding: "10px" }}
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              style={{
                border: "none",
                padding: "10px",
                background: "#0070f3",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <div style={{ color: "#fff", fontSize: "24px" }}>💬</div>
      )}
    </div>
  );
}
