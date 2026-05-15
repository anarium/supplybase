import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Simple password storage - in production, use proper hashing
const adminPassword = "admin123" // Default password

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === adminPassword) {
      // Generate JWT token
      const token = sign(
        {
          admin: true,
          timestamp: Date.now(),
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

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
