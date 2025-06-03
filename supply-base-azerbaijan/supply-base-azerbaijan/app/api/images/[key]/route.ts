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

// DELETE image by key
export async function DELETE(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { key } = params
    const sql = neon(process.env.DATABASE_URL!)

    // Check if image exists
    const existingImage = await sql`SELECT * FROM site_images WHERE image_key = ${key}`

    if (existingImage.length === 0) {
      return NextResponse.json({ success: false, message: "Şəkil tapılmadı" }, { status: 404 })
    }

    // Delete image
    await sql`DELETE FROM site_images WHERE image_key = ${key}`

    return NextResponse.json({
      success: true,
      message: "Şəkil uğurla silindi",
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ success: false, message: "Şəkili silmək mümkün olmadı" }, { status: 500 })
  }
}

// GET image by key
export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const { key } = params
    const sql = neon(process.env.DATABASE_URL!)

    const image = await sql`SELECT * FROM site_images WHERE image_key = ${key}`

    if (image.length === 0) {
      return NextResponse.json({ success: false, message: "Şəkil tapılmadı" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      image: image[0],
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json({ success: false, message: "Şəkili əldə etmək mümkün olmadı" }, { status: 500 })
  }
}
