// app/api/users/[wallet]/route.ts
import { NextResponse } from "next/server"
import { fetchUserByWalletTableland } from "@/services/tablelandservice"

export async function GET(req: Request, body: any) {
  const { wallet } = body.params as { wallet: string } // you can still cast if you like

  try {
    const user = await fetchUserByWalletTableland(wallet)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ user })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: err.message || "Lookup failed" },
      { status: 500 }
    )
  }
}
