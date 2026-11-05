export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { prompt } = await request.json();

    console.log("Project ID:", id);
    console.log("User Prompt:", prompt);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
