"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { aiAssistantHealthAdvice, type AiAssistantHealthAdviceInput } from "@/ai/flows/ai-assistant-health-advice";
import type { AiAssistantMessage } from "@/lib/types";

// Mock user data - in a real app, this would come from user's profile
const mockUserData = {
  name: "示例用户",
  gender: "male",
  age: 30,
  medicalHistory: "高血压, 2型糖尿病, 对青霉素过敏",
};

export function AiChatInterface() {
  const [messages, setMessages] = useState<AiAssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial greeting from AI
  useEffect(() => {
    setMessages([
      {
        id: "initial-greeting",
        role: "assistant",
        content: `你好, ${mockUserData.name}! 我是您的AI健康助手，有什么可以帮您的吗？您可以问我关于您的健康状况、饮食或药物的问题。`,
        timestamp: new Date(),
      }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: AiAssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiInput: AiAssistantHealthAdviceInput = {
        question: input,
        name: mockUserData.name,
        gender: mockUserData.gender,
        age: mockUserData.age,
        medicalHistory: mockUserData.medicalHistory,
      };
      const response = await aiAssistantHealthAdvice(aiInput);
      const assistantMessage: AiAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.advice,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI advice:", error);
      toast({
        title: "AI助手出错",
        description: "抱歉，AI助手暂时无法回复，请稍后再试。",
        variant: "destructive",
      });
       const errorMessage: AiAssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "抱歉，我暂时无法处理您的请求。请稍后再试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-background">
      <ScrollArea className="flex-grow h-[calc(100%-5rem)] pr-4" ref={scrollAreaRef}> {/* Adjust height for input area */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end space-x-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === "user" && (
                 <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/50/50?grayscale" alt={mockUserData.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{mockUserData.name.substring(0,1)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && messages[messages.length -1]?.role === 'user' && (
            <div className="flex items-end space-x-2 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow bg-muted text-muted-foreground rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex items-center space-x-2 pt-2 border-t">
        <Input
          type="text"
          placeholder="输入您的问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
          disabled={isLoading}
          className="flex-grow"
        />
        <Button onClick={handleSend} disabled={isLoading || input.trim() === ""}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </div>
  );
}
