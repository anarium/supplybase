import { type NextRequest, NextResponse } from "next/server"

// Simple password storage - in production, use proper hashing
const adminPassword = "admin123" // Default password

// Simple token generation without external dependencies
function generateToken() {
  const payload = {
    admin: true,
    timestamp: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Parol tələb olunur",
        },
        { status: 400 },
      )
    }

    if (password === adminPassword) {
      // Generate simple token
      const token = generateToken()

      return NextResponse.json({
        success: true,
        token,
        message: "Giriş uğurlu",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Yanlış parol",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Giriş xətası",
      },
      { status: 500 },
    )
  }
}

// Export the password for use in other routes
export { adminPassword }
