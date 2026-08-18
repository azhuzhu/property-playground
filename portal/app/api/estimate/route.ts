import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

const PYTHON_API_URL = process.env.PYTHON_API_URL ?? "http://localhost:8001";

export async function POST(request: NextRequest) {
  return proxyRequest(request, `${PYTHON_API_URL}/api/estimates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}
