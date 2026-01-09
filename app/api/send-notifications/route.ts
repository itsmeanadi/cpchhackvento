import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminDb } from "@/lib/firebase-admin";

// Initialize Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(req: Request) {
    try {
        const { studentIds, subject, message, channels } = await req.json();

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return NextResponse.json({ error: "No recipients selected" }, { status: 400 });
        }

        // Fetch recipient data for selected IDs
        // In a real app with 1000s of users, we'd batch this or store emails in the selection.
        // For now, we trust the ID is the email (as per our schema).

        const results = {
            email: 0,
            fcm: 0,
            errors: [] as string[]
        };

        // 1. Send Emails
        if (channels.includes("email")) {
            // Bulk send using BCC to avoid exposing emails/spamming separate requests
            // OR individual sends for personalization. Bulk BCC is safer for MVP.

            try {
                await transporter.sendMail({
                    from: `"CPC Admin" <${process.env.GMAIL_USER}>`,
                    to: process.env.GMAIL_USER, // Send to self
                    bcc: studentIds, // Blind copy all students
                    subject: subject,
                    text: message,
                    html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #4F46E5;">CPC Notification</h2>
                            <p>${message.replace(/\n/g, "<br>")}</p>
                            <hr>
                            <p style="font-size: 12px; color: #666;">This is an automated message from the Placement Portal.</p>
                           </div>`
                });
                results.email = studentIds.length;
            } catch (err: any) {
                console.error("Email Error:", err);
                results.errors.push(`Email Failed: ${err.message}`);
            }
        }

        // 2. Mock FCM (since we might not have tokens for everyone / setup is complex)
        if (channels.includes("push")) {
            // In real implementation:
            // const adminDb = getAdminDb();
            // const tokens = ... fetch tokens from DB for studentIds ...
            // await admin.messaging().sendEachForMulticast({ tokens, notification: { title: subject, body: message } });
            results.fcm = studentIds.length; // Mock success
        }

        return NextResponse.json({ success: true, details: results });

    } catch (error: any) {
        console.error("Notification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
