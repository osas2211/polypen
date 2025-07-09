// app/api/ipfs-pinata/route.ts

import { NextResponse } from "next/server"
import { pinJSONToIPFS } from "@/utils/pinata"

export async function POST(req: Request) {
  const json = await req.json()
  try {
    const uri = await pinJSONToIPFS(json)
    return NextResponse.json({ uri })
  } catch (err: any) {
    console.error("Pinata error:", err)
    return NextResponse.json(
      { error: err.message || "Pinning failed" },
      { status: 500 }
    )
  }
}
