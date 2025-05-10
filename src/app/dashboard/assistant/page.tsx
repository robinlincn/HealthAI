
import { AiChatInterface } from "@/components/assistant/AiChatInterface";

export default function AssistantPage() {
  return (
    // The AiChatInterface is designed to take up available height.
    // The MobileAppLayout's main content area is flex-1 and overflow-y-auto.
    // The padding is now handled by MobileAppLayout's main content wrapper.
    // Remove explicit height calculations here, let flexbox handle it.
    <div className="flex flex-col h-full"> 
      <AiChatInterface />
    </div>
  );
}
