
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ListCollapse, FileImage, Video } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConsultationEntry {
  id: string;
  doctorName: string; // In a real app, this might be selected or assigned
  date: string;
  question: string;
  status: 'pending_reply' | 'replied' | 'closed';
  reply?: string;
  attachments?: { name: string, type: 'image' | 'video' | 'document' }[];
}

const mockConsultations: ConsultationEntry[] = [
  { id: "cons1", doctorName: "王医生 (内分泌科)", date: "2024-05-18", question: "医生您好，我最近血糖有点波动，附上近三天的血糖记录图片，麻烦您看一下。", status: "replied", reply: "张先生您好，根据您的血糖记录，建议餐后适当增加运动量。如有不适请及时复诊。", attachments: [{name: "血糖记录.jpg", type: "image"}] },
  { id: "cons2", doctorName: "李医生 (心内科)", date: "2024-05-15", question: "关于上次开的降压药，我感觉有点头晕，是否需要调整？", status: "pending_reply" },
  { id: "cons3", doctorName: "赵医生 (全科)", date: "2024-05-10", question: "体检报告有些指标看不懂，想咨询一下。", status: "closed", reply: "已电话沟通并解答。" },
];

export default function ConsultationsPage() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<ConsultationEntry[]>(mockConsultations);
  const [newConsultation, setNewConsultation] = useState({ doctor: "", question: "", files: [] as File[] });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewConsultation(prev => ({ ...prev, files: Array.from(event.target.files || []) }));
    }
  };

  const handleInitiateConsultation = (e: FormEvent) => {
    e.preventDefault();
    if (!newConsultation.question.trim()) {
      toast({ title: "请输入您的问题", variant: "destructive" });
      return;
    }
    // Mock submission
    const newEntry: ConsultationEntry = {
      id: `cons${Date.now()}`,
      doctorName: newConsultation.doctor || "系统分配医生",
      date: new Date().toISOString().split('T')[0],
      question: newConsultation.question,
      status: 'pending_reply',
      attachments: newConsultation.files.map(f => ({name: f.name, type: f.type.startsWith("image") ? 'image' : (f.type.startsWith("video") ? 'video' : 'document')}))
    };
    setConsultations(prev => [newEntry, ...prev]);
    setNewConsultation({ doctor: "", question: "", files: [] });
    toast({ title: "咨询已发起 (模拟)", description: "您的咨询请求已发送，请耐心等待医生回复。" });
  };

  const getStatusBadge = (status: ConsultationEntry['status']) => {
    switch(status) {
        case 'pending_reply': return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">待回复</span>;
        case 'replied': return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">已回复</span>;
        case 'closed': return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">已关闭</span>;
        default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MessageSquare className="mr-3 h-7 w-7 text-primary" />
            在线医生咨询
          </CardTitle>
          <CardDescription>
            向您的医生发起在线咨询、预约咨询时间，并查看历史咨询记录。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="newConsultation" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="newConsultation"><Send className="mr-2 h-4 w-4" /> 发起新咨询</TabsTrigger>
          <TabsTrigger value="history"><ListCollapse className="mr-2 h-4 w-4" /> 咨询记录</TabsTrigger>
        </TabsList>

        <TabsContent value="newConsultation">
          <Card>
            <CardHeader>
              <CardTitle>发起新的在线咨询</CardTitle>
              <CardDescription>请详细描述您的问题，如有需要可上传附件。</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitiateConsultation} className="space-y-4">
                <div>
                  <Label htmlFor="doctorSelect">选择医生 (可选)</Label>
                  <Input 
                    id="doctorSelect" 
                    placeholder="输入医生姓名或选择科室 (功能建设中)" 
                    value={newConsultation.doctor}
                    onChange={(e) => setNewConsultation(prev => ({...prev, doctor: e.target.value}))}
                    className="mt-1" 
                    disabled 
                  />
                   <p className="text-xs text-muted-foreground mt-1">如不选择，系统将为您分配医生。</p>
                </div>
                <div>
                  <Label htmlFor="consultQuestion">您的问题</Label>
                  <Textarea
                    id="consultQuestion"
                    placeholder="请详细描述您的症状、疑问或需要咨询的内容..."
                    rows={6}
                    value={newConsultation.question}
                    onChange={(e) => setNewConsultation(prev => ({...prev, question: e.target.value}))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="attachments">上传附件 (图片/文档/视频)</Label>
                  <Input id="attachments" type="file" multiple onChange={handleFileChange} className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {newConsultation.files.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      已选择文件: {newConsultation.files.map(f => f.name).join(", ")}
                    </div>
                  )}
                </div>
                 <div className="flex justify-between items-center pt-2">
                    <p className="text-sm text-muted-foreground">支持预约视频/电话咨询 (功能建设中)</p>
                    <Button type="submit">
                        <Send className="mr-2 h-4 w-4" /> 发送咨询请求
                    </Button>
                 </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>历史咨询记录</CardTitle>
              <CardDescription>查看您过往的在线咨询和医生的回复。</CardDescription>
            </CardHeader>
            <CardContent>
              {consultations.length > 0 ? (
                <ScrollArea className="h-[500px] pr-3">
                  <div className="space-y-3">
                    {consultations.map(consult => (
                      <Card key={consult.id} className="p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-primary">咨询医生: {consult.doctorName}</p>
                          {getStatusBadge(consult.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">日期: {consult.date}</p>
                        <p className="text-sm mb-1"><strong>您的问题:</strong> {consult.question}</p>
                        {consult.attachments && consult.attachments.length > 0 && (
                            <div className="text-xs mb-2">
                                <strong>附件: </strong>
                                {consult.attachments.map((att, idx) => (
                                    <span key={idx} className="mr-2 p-1 bg-muted rounded text-muted-foreground">
                                        {att.type === 'image' && <FileImage className="inline h-3 w-3 mr-1"/>}
                                        {att.type === 'video' && <Video className="inline h-3 w-3 mr-1"/>}
                                        {att.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        {consult.reply && <p className="text-sm p-2 bg-muted/50 rounded-md"><strong>医生回复:</strong> {consult.reply}</p>}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无历史咨询记录。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
