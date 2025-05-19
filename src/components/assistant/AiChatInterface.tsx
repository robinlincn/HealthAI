
"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot, Paperclip, Mic, Image as ImageIcon, Video, XCircle } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Refs for hidden file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    setMessages([
      {
        id: "initial-greeting",
        role: "assistant",
        content: `你好, ${mockUserData.name}! 我是您的AI健康助手，有什么可以帮您的吗？您可以问我关于您的健康状况、饮食、药物的问题，也可以上传图片、文档或语音进行咨询。`,
        timestamp: new Date(),
      }
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Optional: Add file size/type validation here if needed
      setSelectedFile(file);
      toast({ title: "文件已选择", description: file.name });
    }
    // Reset the input value so the same file can be selected again if needed
    event.target.value = ""; 
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    if (input.trim() === "" && !selectedFile) return;

    const userMessage: AiAssistantMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    if (selectedFile) {
      userMessage.attachment = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      };
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const aiInput: AiAssistantHealthAdviceInput = {
        question: input,
        name: mockUserData.name,
        gender: mockUserData.gender,
        age: mockUserData.age,
        medicalHistory: mockUserData.medicalHistory,
      };

      if (userMessage.attachment) {
        aiInput.attachmentInfo = {
          name: userMessage.attachment.name,
          type: userMessage.attachment.type,
          size: userMessage.attachment.size,
        };
        // In a real scenario, you'd upload the file and pass a URL or content.
        // For now, we're just passing metadata.
      }

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
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-grow pr-2">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end space-x-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 self-start">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg shadow text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                )}
              >
                {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                {message.attachment && (
                  <div className={cn("mt-2 pt-2 border-t border-white/20", !message.content && "mt-0 pt-0 border-none")}>
                    <p className="text-xs font-medium flex items-center">
                      {message.attachment.type.startsWith("image/") && <ImageIcon size={14} className="mr-1.5 shrink-0" />}
                      {message.attachment.type === "application/pdf" && <FileText size={14} className="mr-1.5 shrink-0" />}
                      {message.attachment.type.startsWith("audio/") && <Mic size={14} className="mr-1.5 shrink-0" />}
                      {message.attachment.type.startsWith("video/") && <Video size={14} className="mr-1.5 shrink-0" />}
                      附件: {message.attachment.name}
                    </p>
                    <p className="text-xs opacity-80">类型: {message.attachment.type} {message.attachment.size ? `(${(message.attachment.size / 1024).toFixed(1)} KB)` : ''}</p>
                  </div>
                )}
                <p className="text-xs text-right mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === "user" && (
                 <Avatar className="h-8 w-8 self-start">
                  <AvatarImage src="https://picsum.photos/50/50?grayscale" alt={mockUserData.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{mockUserData.name.substring(0,1)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && messages[messages.length -1]?.role === 'user' && (
            <div className="flex items-end space-x-2 justify-start">
              <Avatar className="h-8 w-8 self-start">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="max-w-xs p-3 rounded-lg shadow bg-muted text-muted-foreground rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {selectedFile && (
        <div className="p-2 border-t text-xs text-muted-foreground flex justify-between items-center">
          <span>已选文件: {selectedFile.name}</span>
          <Button variant="ghost" size="icon" onClick={clearSelectedFile} className="h-6 w-6">
            <XCircle size={16} />
            <span className="sr-only">清除文件</span>
          </Button>
        </div>
      )}

      <div className="border-t p-2 space-y-2">
        <div className="flex items-center space-x-2">
            <Input
            type="text"
            placeholder="输入您的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            disabled={isLoading}
            className="flex-grow text-sm h-10"
            />
            <Button onClick={handleSend} disabled={isLoading || (input.trim() === "" && !selectedFile)} size="icon" className="w-10 h-10 flex-shrink-0">
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Send className="h-4 w-4" />
            )}
            <span className="sr-only">发送</span>
            </Button>
        </div>
        <div className="flex justify-start space-x-1">
            <input type="file" ref={imageInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: 'none' }} />
            <Button variant="outline" size="sm" onClick={() => imageInputRef.current?.click()} disabled={isLoading} className="h-8 px-2">
                <ImageIcon size={16} className="mr-1"/> 图片
            </Button>

            <input type="file" ref={documentInputRef} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
            <Button variant="outline" size="sm" onClick={() => documentInputRef.current?.click()} disabled={isLoading} className="h-8 px-2">
                <Paperclip size={16} className="mr-1"/> 文档
            </Button>
            
            <input type="file" ref={audioInputRef} onChange={handleFileSelect} accept="audio/*" style={{ display: 'none' }} />
            <Button variant="outline" size="sm" onClick={() => audioInputRef.current?.click()} disabled={isLoading} className="h-8 px-2">
                <Mic size={16} className="mr-1"/> 语音
            </Button>

            <input type="file" ref={videoInputRef} onChange={handleFileSelect} accept="video/*" style={{ display: 'none' }} />
            <Button variant="outline" size="sm" onClick={() => videoInputRef.current?.click()} disabled={isLoading} className="h-8 px-2">
                <Video size={16} className="mr-1"/> 视频
            </Button>
        </div>
      </div>
    </div>
  );
}
