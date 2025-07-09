import { NextRequest, NextResponse } from "next/server"
import { onboardUserTableland } from "@/services/tablelandservice"

export async function POST(req: NextRequest) {
  // only POST is allowed here
  const body = await req.json()
  try {
    const meta = await onboardUserTableland(body)
    return NextResponse.json({ success: true, txn: meta })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Onboarding failed" },
      { status: 500 }
    )
  }
}
