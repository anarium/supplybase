import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

// Import the current password (in production, use proper database)
let adminPassword = "admin123"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Yetki yoxdur",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)

    try {
      verify(token, JWT_SECRET)
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          message: "Yanlış token",
        },
        { status: 401 },
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Verify current password
    if (currentPassword !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Cari parol yanlışdır",
        },
        { status: 400 },
      )
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Yeni parol ən azı 6 simvol olmalıdır",
        },
        { status: 400 },
      )
    }

    // Update password (in production, use proper hashing and database)
    adminPassword = newPassword

    console.log("Password changed successfully")

    return NextResponse.json({
      success: true,
      message: "Parol uğurla dəyişdirildi",
    })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Parol dəyişdirmə xətası",
      },
      { status: 500 },
    )
  }
}
