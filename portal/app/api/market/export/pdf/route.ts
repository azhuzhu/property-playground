import { NextRequest, NextResponse } from "next/server";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${JAVA_API_URL}/api/market/export/pdf${request.nextUrl.search}`);
    return new NextResponse(await response.arrayBuffer(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/pdf",
        "Content-Disposition": "attachment; filename=property-market.pdf",
      },
    });
  } catch {
    return NextResponse.json({ detail: "Export service unavailable" }, { status: 503 });
  }
}
