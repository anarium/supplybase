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

// GET all images
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const images = await sql`SELECT * FROM site_images ORDER BY uploaded_at DESC`

    return NextResponse.json({
      success: true,
      images,
    })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ success: false, message: "Şəkilləri əldə etmək mümkün olmadı" }, { status: 500 })
  }
}

// POST new image
export async function POST(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const formData = await request.formData()
    const imageKey = formData.get("imageKey") as string
    const imageUrl = formData.get("imageUrl") as string
    const altText = formData.get("altText") as string

    if (!imageKey || !imageUrl) {
      return NextResponse.json({ success: false, message: "Şəkil açarı və URL tələb olunur" }, { status: 400 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if image key already exists
    const existingImage = await sql`SELECT * FROM site_images WHERE image_key = ${imageKey}`

    if (existingImage.length > 0) {
      // Update existing image
      await sql`
        UPDATE site_images 
        SET image_url = ${imageUrl}, alt_text = ${altText}, uploaded_at = NOW() 
        WHERE image_key = ${imageKey}
      `
    } else {
      // Insert new image
      await sql`
        INSERT INTO site_images (image_key, image_url, alt_text) 
        VALUES (${imageKey}, ${imageUrl}, ${altText})
      `
    }

    return NextResponse.json({
      success: true,
      message: "Şəkil uğurla saxlanıldı",
    })
  } catch (error) {
    console.error("Error saving image:", error)
    return NextResponse.json({ success: false, message: "Şəkili saxlamaq mümkün olmadı" }, { status: 500 })
  }
}
