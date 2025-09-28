"use client"; // Required for useState and other React hooks

import { useState } from "react";
import  ReactMarkdown from "react-markdown";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  const generateTopic = async () => {
    const res = await fetch("/api/generateTopic");
    const data = await res.json();
    console.log(typeof(data.topic));
    setTopic(data.topic);
    setEssay("");
    setFeedback("");
    //setCustomTopic("");
  };

  const gradeEssay = async () => {

    const chosenTopic = customTopic !== "" ? customTopic : topic;
    console.log("CHOSEN TOPIC: ", chosenTopic )

    const res = await fetch("/api/gradeEssay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chosenTopic, essay }),
    });
    console.log(res);
    const data = await res.json();
    setFeedback(data.feedback);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>AI Writing Tutor</h1>
      <textarea
        rows = {3}
        cols={80}
        placeholder="Enter your custom prompt here:"
        value = {customTopic}
        onChange={(e) => setCustomTopic(e.target.value)}
      />
      <button onClick={generateTopic}>Generate Topic</button>

      <ReactMarkdown>{topic}</ReactMarkdown>

  
      <textarea
        rows={10}
        cols={80}
        placeholder="Write your essay here..."
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
      />
      <br />
      <button onClick={gradeEssay}>Submit Essay</button>
        
      

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
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
