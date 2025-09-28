import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const AIG = new GoogleGenAI({});

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const { topic, essay } = await req.json();

  try {
    /*
    const response = await fetch("https://api.google.com/gemini/v1/models/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        prompt: `Grade this essay on the topic "${topic}": ${essay}`
      }),
    });

    if (!response.ok) throw new Error("Failed to grade essay");
    */

    let query = "Given this topic " + topic + " grade the following essay:\n" + essay;

    const response = await AIG.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });

    //const data = await response.json();
    return NextResponse.json({ feedback: response.text });
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to grade essay" }, { status: 500 });
  }
}
