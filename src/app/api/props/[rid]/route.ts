import { NextResponse } from "next/server";
import { fetchPlayerProps } from "@/lib/scraper";
import { parsePlayerProps } from "@/lib/parser";
import { filterAndEnrich } from "@/lib/filter";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ rid: string }> },
) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { rid } = await params;
  const url = new URL(req.url);
  const matchName = url.searchParams.get("name") || "";

  try {
    const html = await fetchPlayerProps(rid);
    const rawProps = parsePlayerProps(html);
    const result = filterAndEnrich(rawProps, matchName);
    return NextResponse.json(result);
  } catch (e) {
    console.error(`Failed to fetch props for ${rid}:`, e);
    return NextResponse.json({ error: "Failed to fetch props" }, { status: 500 });
  }
}
