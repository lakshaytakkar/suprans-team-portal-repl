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
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] flex-shrink-0">
        <Sidebar className="fixed w-[280px] h-full" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Menu Trigger */}
        <div className="md:hidden flex items-center p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="ml-4 font-bold text-primary">Clario</span>
        </div>

        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8F9FB]">
          <div className="mx-auto max-w-[1600px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
