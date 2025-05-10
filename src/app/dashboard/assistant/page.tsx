import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AiChatInterface } from "@/components/assistant/AiChatInterface";
import { Bot } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col"> {/* Adjust height as needed */}
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Bot className="mr-3 h-7 w-7 text-primary" />
            AI小助手
          </CardTitle>
          <CardDescription>
            与AI智能助手对话，获取健康建议、解答疑问。
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="flex-grow flex flex-col shadow-lg">
        <CardContent className="p-0 flex-grow flex flex-col">
          <AiChatInterface />
        </CardContent>
      </Card>
    </div>
  );
}
