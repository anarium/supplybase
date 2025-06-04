import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
// In production, you would use a proper database like PostgreSQL, MongoDB, etc.
const rfqRequests: any[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const rfqData = {
      id: Date.now().toString(),
      companyName: formData.get("companyName"),
      contactPerson: formData.get("contactPerson"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      industry: formData.get("industry"),
      urgency: formData.get("urgency"),
      projectDescription: formData.get("projectDescription"),
      additionalComments: formData.get("additionalComments"),
      language: formData.get("language"),
      submittedAt: new Date().toISOString(),
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

    // Save to "database" (in production, use proper database)
    rfqRequests.push(rfqData)

    // Log for demo purposes
    console.log("New RFQ Request:", rfqData)
    console.log("Total requests in database:", rfqRequests.length)

    // In production, you might also:
    // 1. Send email notifications to admin
    // 2. Send confirmation email to customer
    // 3. Integrate with CRM systems
    // 4. Store files in cloud storage

    return NextResponse.json({
      success: true,
      message: "RFQ request submitted successfully",
      requestId: rfqData.id,
    })
  } catch (error) {
    console.error("Error processing RFQ request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit RFQ request" }, { status: 500 })
  }
}

// GET endpoint to retrieve RFQ requests (for admin purposes)
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      requests: rfqRequests,
      total: rfqRequests.length,
    })
  } catch (error) {
    console.error("Error retrieving RFQ requests:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve requests" }, { status: 500 })
  }
}
