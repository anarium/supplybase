import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Verify token function
function verifyToken(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())
    if (payload.exp && Date.now() > payload.exp) {
      return null
    }
    return payload.admin === true ? payload : null
  } catch {
    return null
  }
}

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }
  const token = authHeader.substring(7)
  return verifyToken(token) !== null
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { id } = params
    const sql = neon(process.env.DATABASE_URL!)

    // Check if request exists
    const existingRequest = await sql`SELECT * FROM rfq_submissions WHERE id = ${id}`

    if (existingRequest.length === 0) {
      return NextResponse.json({ success: false, message: "Sorğu tapılmadı" }, { status: 404 })
    }

    // Delete request
    await sql`DELETE FROM rfq_submissions WHERE id = ${id}`

    return NextResponse.json({
      success: true,
      message: "Sorğu uğurla silindi",
    })
  } catch (error) {
    console.error("Error deleting RFQ request:", error)
    return NextResponse.json({ success: false, message: "Failed to delete request" }, { status: 500 })
  }
}
