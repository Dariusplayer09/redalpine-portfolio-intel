import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, desc, sector } = await req.json();

  if (!name || !desc || !sector) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const prompt = `You are a venture capital analyst at redalpine, a pan-European VC firm with $1.3B AUM backing GameChangers — software and deep science companies that transform industries. redalpine backs extraordinary founders across fintech, AI/ML, healthtech, climatetech, biotech, and frontier science. Write sharp, confident VC-style thesis memos. Be specific about why a company fits redalpine's thesis. 2-3 sentences max. No fluff.

Write a concise investment thesis memo for: ${name} — "${desc}" (sector: ${sector}). Explain why this fits redalpine's thesis as a GameChanger. Be specific, analytical, VC-grade. Max 3 sentences.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: "Gemini API error", details: data }, { status: 500 });
  }

  const memo = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Could not generate memo.";
  return NextResponse.json({ memo });
}
