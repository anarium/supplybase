import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const rfqData = {
      company_name: formData.get("companyName") as string,
      contact_person: formData.get("contactPerson") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      industry: formData.get("industry") as string,
      urgency: formData.get("urgency") as string,
      project_description: formData.get("projectDescription") as string,
      additional_comments: formData.get("additionalComments") as string,
      language: (formData.get("language") as string) || "az",
    }

    // Handle file uploads
    const files = formData.getAll("files") as File[]
    const fileData = []

    for (const file of files) {
      if (file.size > 0) {
        fileData.push({
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        })
      }
    }

    // Save to database
    const result = await sql`
      INSERT INTO rfq_submissions (
        company_name, contact_person, email, phone, industry, urgency,
        project_description, additional_comments, language, files
      ) VALUES (
        ${rfqData.company_name}, ${rfqData.contact_person}, ${rfqData.email}, 
        ${rfqData.phone}, ${rfqData.industry}, ${rfqData.urgency},
        ${rfqData.project_description}, ${rfqData.additional_comments}, 
        ${rfqData.language}, ${JSON.stringify(fileData)}
      ) RETURNING id
    `

    console.log("New RFQ Request saved to database:", result[0].id)

    return NextResponse.json({
      success: true,
      message: "RFQ request submitted successfully",
      requestId: result[0].id,
    })
  } catch (error) {
    console.error("Error processing RFQ request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit RFQ request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const requests = await sql`
      SELECT 
        id::text,
        company_name as "companyName",
        contact_person as "contactPerson", 
        email,
        phone,
        industry,
        urgency,
        project_description as "projectDescription",
        additional_comments as "additionalComments",
        language,
        files,
        created_at as "submittedAt"
      FROM rfq_submissions 
      ORDER BY created_at DESC
    `

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
