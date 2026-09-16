import "./globals.css";

export const metadata = {
  title: "WIVELI — Make It Personal",
  description: "Personalized digital gifts and interactive experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
