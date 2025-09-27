import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700 !border-none focus:!outline-none focus:!ring-0"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
