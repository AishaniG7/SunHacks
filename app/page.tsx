"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);

   const handleClick = async () => {
    setIsGenerating(true);
    // Simulate an asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const generateTopic = async () => {
    setIsGenerating(true);
    try{
      const res = await fetch("/api/generateTopic");
      const data = await res.json();

      let cleanTopic = data.topic.includes('"')
        ? data.topic.split('"').slice(1).join('"').replace(/"/g, "")
        : data.topic.replace(/"/g,"");

      setTopic(cleanTopic.replace(/\*/g,""));
      setEssay("");
      setFeedback("");
      setCustomTopic("");
    } catch(error) {
      console.error("Error generating topic:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const gradeEssay = async () => {
    
    const chosenTopic = customTopic !== "" ? customTopic : topic;
    console.log("CHOSEN TOPIC: ", chosenTopic );

    setIsGrading(true);
    try{
    const res = await fetch("/api/gradeEssay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chosenTopic, essay }),
    });
    console.log(res);
    const data = await res.json();
    setFeedback(data.feedback);
    } catch(error) {
      console.error("Error grading essay:", error);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div style ={{fontFamily: 'Helvetica', fontSize:"110%"}} className="h-15 mx-10 rounded-xl border-3 my-4 p-2 text-center bg-[#0f494fac]">
      <h5 className="font-bold text-4xl text-center">AI WRITING TUTOR</h5>
      
      <textarea
        style={{ fontFamily: 'Helvetica' }}
        rows = {5}
        cols={50}
        placeholder="Enter your custom prompt here:"
        className="mx-auto my-15 flex border-2 border-[#d3d9d4] p-2 rounded-lg text-[100%]"
        value={customTopic}
        onChange={(e) => setCustomTopic(e.target.value)}
      />
      <button onClick={generateTopic} className={"mt-5 mb-5 text-2xl transition duration-300 ease-in-out hover:bg-[#748d92] bg-[#003135] text-[#AFDDE5] px-5 py-2 rounded-full cursor-pointer font-['Helvetica']"} disabled={isGenerating}> 
        {isGenerating ? (
        <div className="animate-spin [animation-duration: s] rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : ('Generate Topic')}
      </button>

      {topic && customTopic === "" && (<h2 className="my-5" style={{ fontFamily: 'Helvetica', fontSize: '150%' }}><span className={"font-bold "}>Topic: </span>{topic}</h2>)}

          <textarea
            style={{ fontFamily: 'Helvetica' }}
            rows={10}
            cols={50}
            className="mx-auto flex my-5 border-2 border-[#d3d9d4] p-2 rounded-lg text-[120%]"
            placeholder="Write your essay here..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
          />
          <br />
          <button onClick={gradeEssay} className={"my-5 mx-2 text-2xl transition duration-300 ease-in-out hover:bg-[#748d92] bg-[#003135] text-[#AFDDE5] px-5 py-2 rounded-full cursor-pointer font-['Helvetica']"} disabled={isGrading}>
           {isGrading ? (
    <div className="animate-spin flex rounded-full h-5 w-5 border-b-2 border-white"></div>
  ) : (
    'Submit Essay'
  )}</button>

      {feedback && (

        <div
          style={{
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            border: "2px solid #d3d9d4",
            padding: "1rem",
            textAlign: "left",
            fontFamily: 'Helvetica', fontSize: '130%'
          }} className="rounded-xl"
        >
          <h3>Feedback:</h3>
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  
    );}
