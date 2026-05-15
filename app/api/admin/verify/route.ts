import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"

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

    try {
      const decoded = verify(token, JWT_SECRET)
      return NextResponse.json({
        success: true,
        user: decoded,
      })
    } catch (jwtError) {
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
