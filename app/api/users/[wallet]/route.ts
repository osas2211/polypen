import { NextResponse } from "next/server"
import { fetchUserByWalletTableland } from "@/services/tablelandservice"

export async function GET(
  req: Request,
  { params }: { params: { wallet: string } }
) {
  const { wallet } = params

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
