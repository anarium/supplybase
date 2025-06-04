import { type NextRequest, NextResponse } from "next/server"

function verifyToken(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (payload.exp && Date.now() > payload.exp) {
      return null
    }

    return payload.admin === true ? payload : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Token yoxdur",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (decoded) {
      return NextResponse.json({
        success: true,
        user: decoded,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Yanlış token",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Token yoxlama xətası",
      },
      { status: 500 },
    )
  }
}
