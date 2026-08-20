import type { Metadata } from "next";
import "./globals.css";
import "./planner-overrides.css";

export const metadata: Metadata = {
  title: "詩尋｜找到此刻最懂你的詩歌",
  description: "用歌名、歌詞、作者或主題，尋找適合此刻的詩歌。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}

