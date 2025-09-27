import { LoginForm } from "@/components/login-form"
import { useTheme } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full flex flex-1 items-center justify-center">
      <div className="absolute top-5 right-5 z-9">
        <ModeToggle />
      </div>

      <LoginForm />

      <Toaster
        theme={theme}
        toastOptions={{
          classNames: {
            closeButton: 'close-button',
          },
        }}
        closeButton
        richColors
        position="bottom-center"
        duration={4000}
      />
    </div>
  )
}

export default Home;
