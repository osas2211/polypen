import { NextResponse } from "next/server"
import { fetchAllUsersTableland } from "@/services/tablelandservice"

export async function GET() {
  try {
    const users = await fetchAllUsersTableland()
    return NextResponse.json({ users })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Failed to load users" },
      { status: 500 }
    )
  }
}
