import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useLanguage } from "@/hooks/useLanguage"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const { language } = useLanguage()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...(language === "fa" && {
            fontFamily: "Vazirmatn, system-ui, -apple-system, sans-serif",
          }),
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
