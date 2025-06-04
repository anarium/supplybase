import { type NextRequest, NextResponse } from "next/server"

// This would be imported from the main RFQ route in a real implementation
// For demo purposes, we'll use a simple approach
let rfqRequests: any[] = []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Find and remove the request
    const initialLength = rfqRequests.length
    rfqRequests = rfqRequests.filter((req) => req.id !== id)

    if (rfqRequests.length === initialLength) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 })
    }

    console.log(`Deleted RFQ request with ID: ${id}`)

    return NextResponse.json({
      success: true,
      message: "Request deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting RFQ request:", error)
    return NextResponse.json({ success: false, message: "Failed to delete request" }, { status: 500 })
  }
}
