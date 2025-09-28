"use client"; // Required for useState and other React hooks

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");

  const generateTopic = async () => {
    const res = await fetch("/api/generateTopic");
    const data = await res.json();
    setTopic(data.topic);
    setEssay("");
    setFeedback("");
  };

  const gradeEssay = async () => {
    const res = await fetch("/api/gradeEssay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, essay }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>AI Writing Tutor</h1>
      <button onClick={generateTopic}>Generate Topic</button>

      {topic && <h2>Topic: {topic}</h2>}

      {topic && (
        <>
          <textarea
            rows={10}
            cols={80}
            placeholder="Write your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />
          <br />
          <button onClick={gradeEssay}>Submit Essay</button>
        </>
      )}

      {feedback && (
        <div
          style={{
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>Feedback:</h3>
          {feedback}
        </div>
      )}
    </div>
  );
}
