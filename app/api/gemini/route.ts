import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
})

export async function POST(req: NextRequest) {
  const { taskTitle, taskDescription } = await req.json()

  const prompt = `Break this task into 3–5 clear subtasks.\n\nTitle: ${taskTitle}\nDescription: ${taskDescription}\n\nSubtasks:`

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    const text = response.text || ""

    const subtasks = text
      .split("\n")
      .map((line: string) => line.replace(/^\d+\.?\s*/, "").trim())
      .filter((line: string) => !!line)

    return NextResponse.json({ subtasks })
  } catch (err) {
    console.error("[Gemini API Error]", err)
    return NextResponse.json({ error: "Gemini call failed", subtasks: [] }, { status: 500 })
  }
}
