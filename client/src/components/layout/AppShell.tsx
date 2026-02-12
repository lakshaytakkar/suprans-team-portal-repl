import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-background">
      <div className="hidden md:block w-[272px] flex-shrink-0">
        <Sidebar className="fixed w-[272px] h-full" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center h-16 px-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[272px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="ml-4 text-[15px] font-semibold text-foreground tracking-tight">Suprans Portal</span>
        </div>

        <Header />
        
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="px-6 py-6 space-y-6 animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
