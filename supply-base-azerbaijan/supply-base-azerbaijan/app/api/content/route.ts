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

// GET all content
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const content = await sql`SELECT * FROM site_content ORDER BY content_key, language`

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ success: false, message: "Məzmunu əldə etmək mümkün olmadı" }, { status: 500 })
  }
}

// POST new or update content
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { contentKey, language, contentValue } = await request.json()

    if (!contentKey || !language || contentValue === undefined) {
      return NextResponse.json({ success: false, message: "Məzmun açarı, dil və dəyər tələb olunur" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if content already exists
    const existingContent = await sql`
      SELECT * FROM site_content 
      WHERE content_key = ${contentKey} AND language = ${language}
    `

    if (existingContent.length > 0) {
      // Update existing content
      await sql`
        UPDATE site_content 
        SET content_value = ${contentValue}, updated_at = NOW() 
        WHERE content_key = ${contentKey} AND language = ${language}
      `
    } else {
      // Insert new content
      await sql`
        INSERT INTO site_content (content_key, language, content_value) 
        VALUES (${contentKey}, ${language}, ${contentValue})
      `
    }

    return NextResponse.json({
      success: true,
      message: "Məzmun uğurla saxlanıldı",
    })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ success: false, message: "Məzmunu saxlamaq mümkün olmadı" }, { status: 500 })
  }
}
