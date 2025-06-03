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

export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Yetki yoxdur",
        },
        { status: 401 },
      )
    }

    const sql = neon(process.env.DATABASE_URL!)
    const settingsRows = await sql`SELECT * FROM site_settings`

    // Convert array of rows to settings object
    const settings = settingsRows.reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Error retrieving settings:", error)
    return NextResponse.json({ success: false, message: "Parametrləri əldə etmək mümkün olmadı" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Yetki yoxdur",
        },
        { status: 401 },
      )
    }

    const newSettings = await request.json()

    // Validate required fields
    if (!newSettings.title || !newSettings.metaDescription) {
      return NextResponse.json({ success: false, message: "Başlıq və meta təsvir tələb olunur" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Update each setting in the database
    for (const [key, value] of Object.entries(newSettings)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at) 
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
      `
    }

    return NextResponse.json({
      success: true,
      message: "Parametrlər uğurla yeniləndi",
      settings: newSettings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, message: "Parametrləri yeniləmək mümkün olmadı" }, { status: 500 })
  }
}
