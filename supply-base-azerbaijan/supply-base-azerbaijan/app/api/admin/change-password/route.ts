import { type NextRequest, NextResponse } from "next/server"

// Import the current password (in production, use proper database)
let adminPassword = "admin123"

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
    const decoded = verifyToken(token)

    if (!decoded) {
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
