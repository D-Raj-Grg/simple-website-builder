import { Toaster } from "@/components/ui/sonner";

export default function EditorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <Toaster />
    </div>
  );
}