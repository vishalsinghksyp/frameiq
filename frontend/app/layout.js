import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata = {
  title: "FrameIQ",
  description:
    "AI-powered video summarizer & chat. Turn any video into summaries, key insights, action items, and an interactive knowledge base.",
  keywords: [
    "FrameIQ",
    "AI Video Summarizer",
    "Video Analysis",
    "Video Chat",
    "Whisper AI",
    "Mistral AI",
    "Video Intelligence",
  ],
  authors: [{ name: "Vishal Singh" }],
  creator: "Vishal Singh",
  applicationName: "FrameIQ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />

        {/* Theme Color */}
        <meta name="theme-color" content="#0a0a0f" />

        {/* Open Graph */}
        <meta property="og:title" content="FrameIQ" />
        <meta
          property="og:description"
          content="AI-powered video summarizer & chat."
        />
        <meta property="og:type" content="website" />
      </head>

      <body style={{ margin: 0 }}>
        <ThemeProvider>{children}</ThemeProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#e2e8f0",
              border: "1px solid rgba(99,102,241,0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
