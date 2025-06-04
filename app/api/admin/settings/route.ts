import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
// In production, you would use a proper database
let siteSettings = {
  title: "Supply Base Azerbaijan - Procurement as a Service",
  favicon: "/favicon.ico",
  metaDescription:
    "Supply Base Azerbaijan provides comprehensive procurement and supply chain solutions for various industries. Professional sourcing, quality assurance, and reliable delivery services.",
  metaKeywords:
    "procurement, supply chain, Azerbaijan, sourcing, industrial supplies, construction materials, oil gas equipment",
  socialTitle: "Supply Base Azerbaijan - Satınalma və Təchizat Xidməti",
  socialImage: "/images/sba-logo.webp",
  headerSnippet: "",
  footerSnippet: "",
  analyticsCode: "",
}

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

    return NextResponse.json({
      success: true,
      settings: siteSettings,
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

    // Update settings
    siteSettings = { ...siteSettings, ...newSettings }

    console.log("Settings updated:", siteSettings)

    return NextResponse.json({
      success: true,
      message: "Parametrlər uğurla yeniləndi",
      settings: siteSettings,
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ success: false, message: "Parametrləri yeniləmək mümkün olmadı" }, { status: 500 })
  }
}

// Export settings for use in layout
export { siteSettings }
