import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { PollPopup } from "@/components/PollPopup";
import { ChatWidget } from "@/components/Chat";

export const metadata: Metadata = {
  title: "mitreden – Saarbrücken",
  description: "Projekte deiner Stadt verfolgen, kommentieren und mitbestimmen.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <StoreProvider>
          <Nav />
          <main className="mx-auto max-w-[1128px] px-0 pb-24 pt-5 sm:px-4 md:pb-10">{children}</main>
          <PollPopup />
          <ChatWidget />
        </StoreProvider>
      </body>
    </html>
  );
}
