'use client'
import { ThemeProvider, useTheme } from "next-themes";

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <>
      <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange>
        {children}
        </ThemeProvider>
    </>
  );
}