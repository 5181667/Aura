import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auratest.cn";

export const metadata: Metadata = {
  title: {
    default: "AuraTest - 专业心理测试平台 | MBTI、大五人格、九型人格测评",
    template: "%s | AuraTest"
  },
  description: "AuraTest 提供专业的 MBTI 16型人格测试、大五人格测评、九型人格、DISC 行为风格、霍兰德职业兴趣等心理测试，AI 智能深度分析，帮助你发现真实的自我。",
  keywords: [
    "MBTI测试", "MBTI人格测试", "性格测试", "心理测评", "人格测试",
    "大五人格", "九型人格", "DISC测试", "霍兰德测试", "职业测试",
    "心理咨询", "自我认知", "性格分析", "免费测试", "在线测评"
  ],
  authors: [{ name: "AuraTest" }],
  creator: "AuraTest",
  publisher: "AuraTest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName: "AuraTest",
    title: "AuraTest - 专业心理测试平台",
    description: "MBTI、大五人格、九型人格等专业心理测评，AI智能分析，帮助你深入了解自己",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "AuraTest - 专业心理测试平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraTest - 专业心理测试平台",
    description: "MBTI、大五人格、九型人格等专业心理测评，AI智能分析",
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // 添加搜索引擎验证码（需要注册后获取）
    // google: "你的Google验证码",
    // other: { "baidu-site-verification": "你的百度验证码" }
  },
  category: "psychology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

