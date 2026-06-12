export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

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

    // 2. Send email notification (if configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const htmlTemplate = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background-color: #0f172a; padding: 30px 24px; text-align: center;">
                <h2 style="color: #f8fafc; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Portfolio Message</h2>
              </div>
              <div style="padding: 32px 24px; background-color: #ffffff;">
                <div style="padding-bottom: 24px; border-bottom: 1px solid #f1f5f9; margin-bottom: 24px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 80px;">From</td>
                      <td style="padding: 4px 0; color: #0f172a; font-size: 15px; font-weight: 500;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                      <td style="padding: 4px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subject</td>
                      <td style="padding: 4px 0; color: #0f172a; font-size: 15px; font-weight: 500;">${subject || "General Inquiry"}</td>
                    </tr>
                  </table>
                </div>
                
                <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">Message Content</h3>
                <div style="color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap; background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">${message}</div>
                
                <div style="text-align: center; margin-top: 32px;">
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "General")}" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; transition: background-color 0.2s;">Reply to ${name}</a>
                </div>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0;">
                Sent from your Portfolio Contact Form • Diya Vashi
              </div>
            </div>
          `;

        await transporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `New Message from ${name}: ${subject || "General"}`,
          text: `You have a new message from your portfolio!\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: htmlTemplate,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // We don't fail the request if just the email fails, the DB save succeeded
      }
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error", stack: error?.stack }, { status: 500 });
  }
}

