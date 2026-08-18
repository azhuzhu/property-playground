import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  return proxyRequest(request, `${JAVA_API_URL}/api/market/what-if`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}
