import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "../../../../lib/auth/request";

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  return NextResponse.json({ admin: { email: admin.email } });
}