import { NextResponse } from "next/server";

function handler() {
  return NextResponse.json({ status: "ok" });
}

export { handler as GET, handler as POST };
