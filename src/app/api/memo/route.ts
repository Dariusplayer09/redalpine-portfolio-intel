import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = body.name;
  const desc = body.desc;
  const sector = body.sector;
  if (!name || !desc || !sector) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const key = process.env.GEMINI_API_KEY;
  const listResp = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + key);
  const listData = await listResp.json();
  if (!listResp.ok) return NextResponse.json({ error: "Key invalid", details: listData }, { status: 500 });
  const models = (listData.models || []).map((m: {name: string}) => m.name);
  const flashModel = models.find((m: string) => m.includes("flash")) || models[0];
  if (!flashModel) return NextResponse.json({ error: "No models", models }, { status: 500 });
  const modelId = flashModel.replace("models/", "");
  const prompt = "You are a VC analyst at redalpine. Write a sharp 3-sentence investment thesis for: " + name + " sector: " + sector + ".";
  const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent?key=" + key, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await resp.json();
  if (!resp.ok) return NextResponse.json({ error: "Gemini error", model: modelId, details: data }, { status: 500 });
  const memo = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Could not generate memo.";
  return NextResponse.json({ memo });
}
