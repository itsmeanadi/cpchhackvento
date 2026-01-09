import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getAdminDb } from "@/lib/firebase-admin";

const calendar = google.calendar("v3");

// OAuth2 client configuration
const getOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/calendar/callback`;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

// GET - Fetch upcoming interviews
export async function GET(req: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const interviewsRef = adminDb.collection("interviews");
    const snapshot = await interviewsRef.orderBy("dateTime", "asc").get();

    const interviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to ISO string for JSON serialization
        dateTime: data.dateTime?.toDate ? data.dateTime.toDate().toISOString() : data.dateTime,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });

    return NextResponse.json({ success: true, interviews });
  } catch (error: any) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

// POST - Schedule new interview
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studentEmail,
      companyName,
      interviewType,
      dateTime,
      duration,
      meetingLink,
      notes,
      scheduledBy,
    } = body;

    // Validate required fields
    if (!studentEmail || !companyName || !dateTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();

    // Create interview record in Firestore
    const interviewData = {
      studentEmail,
      companyName,
      interviewType: interviewType || "technical",
      dateTime: new Date(dateTime),
      duration: duration || 60,
      meetingLink: meetingLink || "",
      notes: notes || "",
      scheduledBy: scheduledBy || "admin",
      status: "scheduled",
      createdAt: new Date(),
    };

    const docRef = await adminDb.collection("interviews").add(interviewData);

    // Optional: Create Google Calendar event if OAuth is configured
    // This would require additional OAuth flow implementation
    // For now, we'll just store in Firestore

    return NextResponse.json({
      success: true,
      interviewId: docRef.id,
      message: "Interview scheduled successfully",
    });
  } catch (error: any) {
    console.error("Error scheduling interview:", error);
    return NextResponse.json(
      { error: error.message || "Failed to schedule interview" },
      { status: 500 }
    );
  }
}

// PUT - Update interview
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { interviewId, ...updateData } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    const interviewRef = adminDb.collection("interviews").doc(interviewId);

    await interviewRef.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Interview updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update interview" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel interview
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("id");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    await adminDb.collection("interviews").doc(interviewId).delete();

    return NextResponse.json({
      success: true,
      message: "Interview cancelled successfully",
    });
  } catch (error: any) {
    console.error("Error cancelling interview:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel interview" },
      { status: 500 }
    );
  }
}
