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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = `SELECT * FROM site_content ORDER BY category, key`
    let params: any[] = []

    if (category) {
      query = `SELECT * FROM site_content WHERE category = $1 ORDER BY key`
      params = [category]
    }

    const content = await sql(query, params)

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ success: false, message: "Məzmunu əldə etmə xətası" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { key, content_az, content_en, content_ru, category } = await request.json()

    if (!key) {
      return NextResponse.json({ success: false, message: "Açar tələb olunur" }, { status: 400 })
    }

    // Update or insert content
    const result = await sql`
      INSERT INTO site_content (key, content_az, content_en, content_ru, category, updated_at)
      VALUES (${key}, ${content_az || ""}, ${content_en || ""}, ${content_ru || ""}, ${category || "general"}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET 
        content_az = ${content_az || ""},
        content_en = ${content_en || ""},
        content_ru = ${content_ru || ""},
        category = ${category || "general"},
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      content: result[0],
      message: "Məzmun uğurla saxlanıldı",
    })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ success: false, message: "Məzmun saxlama xətası" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ success: false, message: "Açar tələb olunur" }, { status: 400 })
    }

    await sql`DELETE FROM site_content WHERE key = ${key}`

    return NextResponse.json({
      success: true,
      message: "Məzmun uğurla silindi",
    })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ success: false, message: "Məzmun silmə xətası" }, { status: 500 })
  }
}
