import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const AIG = new GoogleGenAI({});

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }
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
        prompt: "Generate a creative writing topic for a high school essay."
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate topic");
    }
    */

    const response = await AIG.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate one Essay Topic",
    });

    //const data = await response.json();
    return NextResponse.json({ topic: response.text });
  }
  catch (error: any){
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

