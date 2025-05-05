import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";

const previousChats = [
  {
    id: 1,
    title: "Business Analysis Report",
    date: "2024-01-02",
    preview: "Complete analysis of Q4 2023...",
  },
  {
    id: 2,
    title: "Sales Strategy Discussion",
    date: "2024-01-01",
    preview: "Review of current sales targets...",
  },
  {
    id: 3,
    title: "Expense Management",
    date: "2023-12-30",
    preview: "Monthly expense breakdown...",
  },
  {
    id: 4,
    title: "Inventory Analysis",
    date: "2023-12-29",
    preview: "Stock level optimization...",
  },
  // Add more previous chats as needed
];

export function PrevChats({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Previous Chats</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="flex flex-col gap-1 p-2">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                className="flex items-start gap-3 rounded-lg p-3 text-left text-sm transition-colors hover:bg-muted"
              >
                <MessageSquare className="h-5 w-5 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium leading-none">{chat.title}</p>
                  <p className="text-xs text-muted-foreground">{chat.date}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {chat.preview}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
