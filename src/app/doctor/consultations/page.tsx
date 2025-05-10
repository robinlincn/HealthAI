
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessagesSquare, Reply, Image as ImageIcon, Video, Filter, Search, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockConsultations = [
  { id: "con001", patientName: "王五", patientId: "pat003", question: "医生您好，我最近感觉有点头晕，血压量了是145/95，需要调整降压药吗？", date: "2024-05-14 10:30", status: "待回复", doctorReply: "" },
  { id: "con002", patientName: "李四", patientId: "pat002", question: "请问我上次开的药吃完了，可以直接续方吗？", date: "2024-05-13 15:00", status: "已回复", doctorReply: "李女士您好，根据您的情况，可以继续按原剂量服用。请注意监测，如有不适随时线上或线下复诊。" },
  { id: "con003", patientName: "张三", patientId: "pat001", question: "这是我今天的血糖记录图片，麻烦您看一下。", date: "2024-05-12 09:00", status: "已回复", doctorReply: "张先生，血糖控制还可以，请继续保持。餐后血糖略高，注意饮食结构。", attachments: [{type: 'image', name: '血糖记录.jpg'}] },
];

export default function DoctorConsultationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredConsultations = mockConsultations.filter(consult => 
    (consult.patientName.includes(searchTerm) || consult.question.includes(searchTerm)) &&
    (filterStatus === "all" || consult.status === filterStatus)
  );

  const selectedConsultation = filteredConsultations.find(c => c.id === selectedConsultationId);

  const handleSendReply = () => {
    if (!selectedConsultationId || !replyContent.trim()) {
        toast({ title: "请输入回复内容", variant: "destructive" });
        return;
    }
    // Mock send reply
    console.log("Replying to:", selectedConsultationId, "with:", replyContent);
    toast({ title: "回复已发送 (模拟)"});
    // Update mock data (in a real app, this would be an API call)
    const index = mockConsultations.findIndex(c => c.id === selectedConsultationId);
    if (index !== -1) {
        mockConsultations[index].status = "已回复";
        mockConsultations[index].doctorReply = replyContent;
    }
    setReplyContent("");
    // setSelectedConsultationId(null); // Optionally close reply section or re-fetch
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessagesSquare className="mr-3 h-7 w-7 text-primary" />
            病人咨询管理
          </CardTitle>
          <CardDescription>
            查看所有病人的咨询请求，进行回复，并管理咨询记录。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Consultation List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">咨询列表</CardTitle>
            <div className="flex gap-2 mt-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="搜索病人/问题" className="pl-8 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px] h-9">
                        <Filter className="mr-1 h-3 w-3" />
                        <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="待回复">待回复</SelectItem>
                        <SelectItem value="已回复">已回复</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[600px] overflow-y-auto">
            {filteredConsultations.length > 0 ? (
                filteredConsultations.map(consult => (
                    <div 
                        key={consult.id} 
                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedConsultationId === consult.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedConsultationId(consult.id)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">{consult.patientName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${consult.status === '待回复' ? 'bg-destructive/20 text-destructive' : 'bg-green-100 text-green-700'}`}>
                                {consult.status}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{consult.question}</p>
                        <p className="text-xs text-muted-foreground text-right">{consult.date}</p>
                    </div>
                ))
            ) : (
                 <p className="p-4 text-sm text-muted-foreground text-center">无匹配的咨询记录。</p>
            )}
          </CardContent>
        </Card>

        {/* Consultation Detail & Reply */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">咨询详情与回复</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConsultation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">病人: {selectedConsultation.patientName}</h4>
                  <p className="text-sm text-muted-foreground">时间: {selectedConsultation.date}</p>
                </div>
                <div className="p-3 border rounded-md bg-background">
                  <p className="text-sm whitespace-pre-wrap">{selectedConsultation.question}</p>
                  {selectedConsultation.attachments && (
                    <div className="mt-2">
                        <p className="text-xs font-medium">附件:</p>
                        {/* Basic attachment display */}
                        {selectedConsultation.attachments.map((att, idx) => (
                            <span key={idx} className="text-xs text-blue-600 hover:underline cursor-pointer">
                                {att.type === 'image' && <ImageIcon className="inline mr-1 h-3 w-3"/>} {att.name}
                            </span>
                        ))}
                    </div>
                  )}
                </div>

                {selectedConsultation.doctorReply && (
                     <div className="p-3 border rounded-md bg-primary/10">
                        <h5 className="text-sm font-semibold text-primary mb-1">您的回复:</h5>
                        <p className="text-sm whitespace-pre-wrap">{selectedConsultation.doctorReply}</p>
                    </div>
                )}

                {selectedConsultation.status === "待回复" || selectedConsultation.doctorReply ? (
                    <div className="space-y-2 pt-2">
                        <Textarea 
                            placeholder="输入您的回复..." 
                            rows={4} 
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled><ImageIcon className="mr-1 h-4 w-4"/> 图片</Button>
                                <Button variant="outline" size="sm" disabled><Video className="mr-1 h-4 w-4"/> 视频</Button>
                            </div>
                            <Button onClick={handleSendReply}>
                                <Reply className="mr-2 h-4 w-4" /> {selectedConsultation.doctorReply ? "更新回复" : "发送回复"}
                            </Button>
                        </div>
                    </div>
                ) : null}
                <p className="text-xs text-muted-foreground text-center pt-2">支持文字、图片、视频等多种回复方式 (功能建设中)。</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageCircleQuestion className="w-16 h-16 mb-4 text-primary/30" />
                <p>请从左侧列表选择一个咨询查看详情并进行回复。</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
