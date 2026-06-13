import initialData from "./portfolio.json";
import { prisma } from "@/lib/prisma";

export async function getPortfolioData() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is not set. Returning initial data.");
      return initialData;
    }
    const record = await prisma.portfolioData.findUnique({
      where: { id: "singleton" },
    });

    const settingsRecords = await prisma.siteSettings.findMany();
    const settingsObj = settingsRecords.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    if (record) {
      const data = record.data as unknown as typeof initialData;
      return {
        ...data,
        siteSettings: {
          ...data.siteSettings,
          ...settingsObj,
          // Map siteName to title if it exists, since the UI uses siteName
          title: settingsObj.siteName || data.siteSettings.title,
          description: settingsObj.siteDescription || data.siteSettings.description,
        }
      };
    }
    
    return {
      ...initialData,
      siteSettings: {
        ...initialData.siteSettings,
        ...settingsObj,
        title: settingsObj.siteName || initialData.siteSettings.title,
        description: settingsObj.siteDescription || initialData.siteSettings.description,
      }
    };
  } catch (error) {
    console.error("Error fetching portfolio data from DB:", error);
    return initialData;
  }
}

export default getPortfolioData;
