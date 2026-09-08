import { NextResponse } from "next/server";
import { LEAGUES } from "@/lib/config";

export async function GET() {
  return NextResponse.json(LEAGUES);
}
