export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { files } = await request.json();

    console.log("Project ID:", id);
    console.log("Updated Files:", files);

    return Response.json({ success: true });
  } catch (error) {
    console.error("File save error:", error);

    return Response.json({ error: "Failed to save files" }, { status: 500 });
  }
}
