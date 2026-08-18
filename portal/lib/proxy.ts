import { NextRequest, NextResponse } from "next/server";

export async function proxyRequest(request: NextRequest, target: string, init?: RequestInit) {
  try {
    const response = await fetch(target, init);
    const contentType = response.headers.get("content-type") ?? "application/json";
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ detail: "The backend service is temporarily unavailable" }, { status: 503 });
  }
}
