import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";


const AIG = new GoogleGenAI({});
const fs = require('fs');

let syllabus = "";
fs.readFile("./app/syllabus.txt","utf8", (err: any, data: any) => {
  if (err == null) {
    syllabus = data;
  }
  else {
    console.log(err)
  }
});

if (syllabus == undefined) {
  console.log("SYLLABUS IS UNDEFINED :<");
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const { chosenTopic, essay } = await req.json();

  const topic = chosenTopic;

  console.log("TOPIC: ", topic);
  

  try {

    let query = "Given this topic " + topic + " grade the following essay based on this syllabus:\n" + syllabus + "Give the grade in A-F first in the format: Grade: A-F, followed by the feedback. Also, repeat the prompt" +  "\n(ESSAY START)\n" + essay;

    const response = await AIG.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });
    
    return NextResponse.json({ feedback: response.text });
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to grade essay" }, { status: 500 });
  }
}
