export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "A prompt is required" }, { status: 400 });
    }

    return Response.json({
      message: "Prompt received successfully",
      prompt,
    });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
