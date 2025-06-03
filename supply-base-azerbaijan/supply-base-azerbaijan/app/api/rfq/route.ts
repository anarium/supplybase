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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const rfqData = {
      company_name: formData.get("companyName"),
      contact_person: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      industry: formData.get("industry"),
      urgency: formData.get("urgency"),
      project_description: formData.get("projectDescription"),
      additional_comments: formData.get("additionalComments"),
      language: formData.get("language"),
      files: [],
    }

    // Handle file uploads
    const files = formData.getAll("files") as File[]
    for (const file of files) {
      if (file.size > 0) {
        // In production, you would upload files to cloud storage (AWS S3, Cloudinary, etc.)
        // For demo, we'll just store file metadata
        rfqData.files.push({
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        })
      }
    }

    // Save to database
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      INSERT INTO rfq_submissions (
        company_name, contact_person, email, phone, industry, urgency, 
        project_description, additional_comments, language, files
      ) VALUES (
        ${rfqData.company_name}, ${rfqData.contact_person}, ${rfqData.email}, 
        ${rfqData.phone}, ${rfqData.industry}, ${rfqData.urgency}, 
        ${rfqData.project_description}, ${rfqData.additional_comments}, 
        ${rfqData.language}, ${JSON.stringify(rfqData.files)}
      ) RETURNING id
    `

    const requestId = result[0]?.id

    return NextResponse.json({
      success: true,
      message: "RFQ request submitted successfully",
      requestId,
    })
  } catch (error) {
    console.error("Error processing RFQ request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit RFQ request" }, { status: 500 })
  }
}

// GET endpoint to retrieve RFQ requests (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ success: false, message: "Yetki yoxdur" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)
    const requests = await sql`SELECT * FROM rfq_submissions ORDER BY submitted_at DESC`

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length,
    })
  } catch (error) {
    console.error("Error retrieving RFQ requests:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve requests" }, { status: 500 })
  }
}
