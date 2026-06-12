import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total Messages & Unread
    const messages = await prisma.contactMessage.findMany({
      select: { isRead: true }
    });
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => !m.isRead).length;

    // Total Views
    const visitorStats = await prisma.visitorStat.findMany();
    const totalViews = visitorStats.reduce((sum, stat) => sum + stat.views, 0);

    // Engagement Rate (Calculated as messages / views)
    const engagementRate = totalViews > 0 
      ? ((totalMessages / totalViews) * 100).toFixed(1) 
      : "0.0";

    // Since we don't track time-series views, the chart data will be basic
    // We can just return a basic flat structure to prevent errors
    const chartData = [
      { name: 'Mon', views: 0, unique: 0 },
      { name: 'Tue', views: 0, unique: 0 },
      { name: 'Wed', views: 0, unique: 0 },
      { name: 'Thu', views: 0, unique: 0 },
      { name: 'Fri', views: 0, unique: 0 },
      { name: 'Sat', views: 0, unique: 0 },
      { name: 'Sun', views: totalViews, unique: visitorStats.length }, // Current data
    ];

    return NextResponse.json({
      messages: totalMessages,
      unreadMessages,
      views: totalViews,
      unique: visitorStats.length, // Number of unique paths visited
      engagementRate,
      chartData
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
