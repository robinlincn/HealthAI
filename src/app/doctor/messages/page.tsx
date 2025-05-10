
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Megaphone, Users, BarChart2 } from "lucide-react"; // Using Send or Megaphone for Push
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorMessagesPage() {
  const { toast } = useToast();
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [recipientType, setRecipientType] = useState<"individual" | "group">("individual");
  const [recipientId, setRecipientId] = useState(""); // For individual patient ID or group ID

  const handleSendMessage = () => {
    if (!messageTitle || !messageContent || (recipientType === "individual" && !recipientId)) {
      toast({
        title: "信息不完整",
        description: "请填写消息标题、内容和接收者。",
        variant: "destructive",
      });
      return;
    }
    // Mock send message
    console.log("Sending message:", { title: messageTitle, content: messageContent, recipientType, recipientId });
    toast({
      title: "消息已发送 (模拟)",
      description: `消息 "${messageTitle}" 已成功推送。`,
    });
    setMessageTitle("");
    setMessageContent("");
    setRecipientId("");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Send className="mr-3 h-7 w-7 text-primary" />
            消息推送 (医生端)
          </CardTitle>
          <CardDescription>
            向特定病人或病人群体推送个性化的健康建议、治疗提醒或通知。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">创建新消息推送</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="recipientType" className="block text-sm font-medium mb-1">接收对象</label>
                <div className="flex space-x-4">
                  <Button variant={recipientType === "individual" ? "default" : "outline"} onClick={() => setRecipientType("individual")}>
                    <Users className="mr-2 h-4 w-4" /> 单个病人
                  </Button>
                  <Button variant={recipientType === "group" ? "default" : "outline"} onClick={() => setRecipientType("group")}>
                    <Megaphone className="mr-2 h-4 w-4" /> 病人群组 (功能建设中)
                  </Button>
                </div>
              </div>
              {recipientType === "individual" && (
                <div>
                  <label htmlFor="recipientId" className="block text-sm font-medium mb-1">病人ID/姓名</label>
                  <Input 
                    id="recipientId" 
                    placeholder="输入病人ID或搜索姓名 (功能建设中)" 
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                  />
                </div>
              )}
              <div>
                <label htmlFor="messageTitle" className="block text-sm font-medium mb-1">消息标题</label>
                <Input 
                  id="messageTitle" 
                  placeholder="请输入消息标题"
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="messageContent" className="block text-sm font-medium mb-1">消息内容</label>
                <Textarea 
                  id="messageContent" 
                  placeholder="请输入消息内容..." 
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              <Button onClick={handleSendMessage} className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" /> 发送消息
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-muted-foreground" />
                消息发送统计
              </CardTitle>
              <CardDescription>查看消息的发送和阅读情况，评估沟通效果。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-col items-center text-center">
                <BarChart2 className="w-20 h-20 text-primary/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground/70">统计功能建设中</h3>
                <p className="text-foreground/50 max-w-md">
                  详细的消息发送数量、阅读率等统计图表即将在此展示。
                </p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="text-lg">已发送消息记录 (示例)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">历史消息列表功能建设中。</p>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
