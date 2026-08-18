import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/proxy";

const JAVA_API_URL = process.env.JAVA_API_URL ?? "http://localhost:8080";

export async function GET(request: NextRequest) {
  return proxyRequest(request, `${JAVA_API_URL}/api/market/properties${request.nextUrl.search}`);
}
