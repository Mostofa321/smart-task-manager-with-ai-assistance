// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { taskTitle, taskDescription } = await req.json()

  const prompt = `Break this task into 3–5 clear subtasks.\n\nTitle: ${taskTitle}\nDescription: ${taskDescription}\n\nSubtasks:`

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    console.log('[Gemini Free Response]', JSON.stringify(data, null, 2))

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ subtasks: [] })
    }

    const subtasks = text
      .split('\n')
      .map((line: string) => line.replace(/^\d+\.?\s*/, '').trim())
      .filter(Boolean)

    return NextResponse.json({ subtasks })
  } catch (err) {
    console.error('[Gemini Error]', err)
    return NextResponse.json({ error: 'Gemini API failed' }, { status: 500 })
  }
}
