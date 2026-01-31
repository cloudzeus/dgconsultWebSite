import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getCustomerConfirmationEmail, getAdminNotificationEmail } from "@/lib/email";

// Required for dynamic API routes
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, company, phone, email, message } = body;

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Save to database first (even if email fails, we don't lose the data)
    const submission = await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        company: company || null,
        phone: phone || null,
        email,
        message,
      },
    });

    // Send emails asynchronously (don't block the response)
    const emailPromises = [];

    // 1. Send confirmation email to customer
    try {
      const customerEmailPromise = sendEmail({
        to: email,
        subject: "Επιβεβαίωση Λήψης Μηνύματος - DGCONSULT",
        htmlContent: getCustomerConfirmationEmail(firstName, lastName),
        from: "comm@dgconsult.gr",
      });
      emailPromises.push(customerEmailPromise);
    } catch (error) {
      console.error("Error queuing customer email:", error);
    }

    // 2. Send notification email to admin
    try {
      const adminEmailPromise = sendEmail({
        to: "comm@dgconsult.gr",
        subject: `🔔 Νέα Αίτηση Επικοινωνίας από ${firstName} ${lastName}`,
        htmlContent: getAdminNotificationEmail({
          firstName,
          lastName,
          email,
          phone,
          company,
          message,
        }),
        from: "comm@dgconsult.gr",
      });
      emailPromises.push(adminEmailPromise);
    } catch (error) {
      console.error("Error queuing admin email:", error);
    }

    // Wait for all emails to be sent (but don't fail if they don't)
    try {
      await Promise.allSettled(emailPromises);
    } catch (error) {
      console.error("Error sending emails:", error);
      // Continue anyway - data is saved
    }

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        message: "Το μήνυμά σας εστάλη με επιτυχία. Θα επικοινωνήσουμε μαζί σας σύντομα!"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Παρουσιάστηκε σφάλμα. Παρακαλώ δοκιμάστε ξανά." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This would typically be protected by authentication
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

