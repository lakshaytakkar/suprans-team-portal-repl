import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Package, 
  Truck, 
  Landmark, 
  ArrowUp, 
  ArrowDown, 
  CornerDownLeft 
} from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Search</DialogTitle>
      <CommandInput placeholder="Search" />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="JUMP TO" className="px-2">
          <CommandItem className="py-3 px-3 cursor-pointer">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#FEECED]">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[16px] font-medium text-foreground">Shipments</span>
            </div>
          </CommandItem>
          <CommandItem className="py-3 px-3 cursor-pointer">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#FEECED]">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[16px] font-medium text-foreground">Carriers</span>
            </div>
          </CommandItem>
          <CommandItem className="py-3 px-3 cursor-pointer">
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#FEECED]">
                <Landmark className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[16px] font-medium text-foreground">Warehouses</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      
      <div className="flex items-center justify-end px-4 py-3 bg-muted border-t gap-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center w-[22px] h-[22px] bg-card border rounded-[6px]">
              <ArrowUp className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center w-[22px] h-[22px] bg-card border rounded-[6px]">
              <ArrowDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
          <span className="text-[12px] font-medium text-muted-foreground">Navigate</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center px-2 py-1 bg-card border rounded-[6px]">
            <span className="text-[10px] font-medium text-muted-foreground">Enter</span>
          </div>
          <span className="text-[12px] font-medium text-muted-foreground">Select</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center px-2 py-1 bg-card border rounded-[6px]">
            <span className="text-[10px] font-medium text-muted-foreground">Esc</span>
          </div>
          <span className="text-[12px] font-medium text-muted-foreground">Quit</span>
        </div>
      </div>
    </CommandDialog>
  );
}
