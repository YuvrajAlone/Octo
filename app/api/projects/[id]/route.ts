import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Demo only: simulate a successful deletion.
  return NextResponse.json({
    success: true,
    message: `Project ${id} deleted successfully`,
  });
}
