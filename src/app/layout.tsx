import React from "react";
import "../styles/globals.css";

export const metadata = {
  title: "Zaptask",
  description: "description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}