import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    // 1. Save to database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || "General",
        message,
      },
    });

    // 2. Email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"${name} (Portfolio)" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send notification to admin's email
        replyTo: email,
        subject: `New Portfolio Message: ${subject || "General Inquiry"}`,
        text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9fb; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Portfolio Message</h1>
              <p style="margin: 8px 0 0; color: #e2e8f0; font-size: 15px;">You have received a new inquiry</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px 24px; background-color: #ffffff;">
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 6px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Contact Details</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; width: 100px;">
                      <span style="color: #475569; font-weight: 500; font-size: 15px;">Name:</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #0f172a; font-weight: 600; font-size: 15px;">${name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #475569; font-weight: 500; font-size: 15px;">Email:</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                      <a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600; font-size: 15px;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #475569; font-weight: 500; font-size: 15px;">Subject:</span>
                    </td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #0f172a; font-weight: 600; font-size: 15px;">${subject || "General Inquiry"}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div>
                <p style="margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Message</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">Sent from your Portfolio Contact Form.</p>
              <p style="margin: 6px 0 0; color: #94a3b8; font-size: 12px;">You can reply directly to this email to respond to ${name}.</p>
            </div>
            
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error", stack: error?.stack }, { status: 500 });
  }
}

