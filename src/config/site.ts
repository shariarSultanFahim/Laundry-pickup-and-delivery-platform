import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

export const siteConfig: SiteConfig = {
  name: "LaundryLink",
  description:
    "A modern laundry pickup and delivery platform built with Next.js, TypeScript, and Tailwind CSS. This project serves as a boilerplate for building scalable and maintainable web applications.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "",
  locale: "en",
  themeColor: "#a6d3e9",
  keywords: ["laundry", "pickup", "delivery", "platform", "dry cleaning"],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/logo.png",
  favicon: "/logo.png"
} as const;
