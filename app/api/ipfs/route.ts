// app/api/ipfs/route.ts
import { NextResponse } from "next/server"
import { uploadJSONToIPFS } from "@/utils/ipfsInfura"

export async function POST(req: Request) {
  const json = await req.json()
  try {
    const uri = await uploadJSONToIPFS(json)
    return NextResponse.json({ uri })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Upload failed" },
      { status: 500 }
    )
  }
}
