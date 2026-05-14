import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const sql = neon(process.env.DATABASE_URL!)

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false

  const token = authHeader.substring(7)
  try {
    verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const settings = await sql`SELECT * FROM site_settings ORDER BY id DESC LIMIT 1`

    return NextResponse.json({
      success: true,
      settings: settings[0] || {},
    })
  } catch (error) {
    console.error("Error retrieving settings:", error)
    return NextResponse.json({ success: false, message: "Parametrləri əldə etmək mümkün olmadı" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const {
      title,
      favicon,
      meta_description,
      meta_keywords,
      social_title,
      social_image,
      header_snippet,
      footer_snippet,
      analytics_code,
    } = await request.json()

    // Validate required fields
    if (!title || !meta_description) {
      return NextResponse.json({ success: false, message: "Başlıq və meta təsvir tələb olunur" }, { status: 400 })
    }

    // Check if settings exist
    const existingSettings = await sql`SELECT id FROM site_settings LIMIT 1`

    let result
    if (existingSettings.length > 0) {
      // Update existing settings
      result = await sql`
        UPDATE site_settings SET
          title = ${title},
          favicon = ${favicon || "/favicon.ico"},
          meta_description = ${meta_description},
          meta_keywords = ${meta_keywords || ""},
          social_title = ${social_title || ""},
          social_image = ${social_image || ""},
          header_snippet = ${header_snippet || ""},
          footer_snippet = ${footer_snippet || ""},
          analytics_code = ${analytics_code || ""},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingSettings[0].id}
        RETURNING *
      `
    } else {
      // Insert new settings
      result = await sql`
        INSERT INTO site_settings (
          title, favicon, meta_description, meta_keywords, social_title, 
          social_image, header_snippet, footer_snippet, analytics_code
        ) VALUES (
          ${title}, ${favicon || "/favicon.ico"}, ${meta_description}, ${meta_keywords || ""}, 
          ${social_title || ""}, ${social_image || ""}, ${header_snippet || ""}, 
          ${footer_snippet || ""}, ${analytics_code || ""}
        ) RETURNING *
      `
    }

    return NextResponse.json({
      success: true,
      message: "Parametrlər uğurla yeniləndi",
      settings: result[0],
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, message: "Parametrləri yeniləmək mümkün olmadı" }, { status: 500 })
  }
}
