import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
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

export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const altText = formData.get("altText") as string

    if (!file) {
      return NextResponse.json({ success: false, message: "Fayl seçilməyib" }, { status: 400 })
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Fayl ölçüsü 10MB-dan böyük ola bilməz" }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Yalnız şəkil faylları qəbul edilir" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const blob = await put(filename, file, {
      access: "public",
    })

    // Save to database
    const result = await sql`
      INSERT INTO site_images (name, original_name, url, alt_text, category, size, mime_type)
      VALUES (${filename}, ${file.name}, ${blob.url}, ${altText || ""}, ${category || "general"}, ${file.size}, ${file.type})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      image: result[0],
      message: "Şəkil uğurla yükləndi",
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ success: false, message: "Şəkil yükləmə xətası" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = `SELECT * FROM site_images ORDER BY created_at DESC`
    let params: any[] = []

    if (category) {
      query = `SELECT * FROM site_images WHERE category = $1 ORDER BY created_at DESC`
      params = [category]
    }

    const images = await sql(query, params)

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ success: false, message: "Şəkilləri əldə etmə xətası" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "Şəkil ID-si tələb olunur" }, { status: 400 })
    }

    // Delete from database
    await sql`DELETE FROM site_images WHERE id = ${id}`

    return NextResponse.json({
      success: true,
      message: "Şəkil uğurla silindi",
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ success: false, message: "Şəkil silmə xətası" }, { status: 500 })
  }
}
