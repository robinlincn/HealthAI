
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ListCollapse, FileImage, Video, Loader2 } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Consultation } from "@/lib/types";
import { db, serverTimestamp, Timestamp } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { format } from "date-fns";

// Mock current patient ID - replace with actual auth user ID in a real app
const MOCK_PATIENT_ID = "patientUser123";
const MOCK_PATIENT_NAME = "示例用户"; // Should come from user profile

export default function ConsultationsPage() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [newConsultation, setNewConsultation] = useState({ doctor: "", question: "", files: [] as File[] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "consultations"),
          where("patientId", "==", MOCK_PATIENT_ID),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedConsultations: Consultation[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedConsultations.push({
            ...data,
            id: doc.id,
            timestamp: (data.timestamp as FirestoreTimestamp).toDate(),
            doctorReplyTimestamp: data.doctorReplyTimestamp ? (data.doctorReplyTimestamp as FirestoreTimestamp).toDate() : undefined,
          } as Consultation);
        });
        setConsultations(fetchedConsultations);
      } catch (error) {
        console.error("Error fetching consultations:", error);
        toast({ title: "获取咨询记录失败", description: "请稍后重试。", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewConsultation(prev => ({ ...prev, files: Array.from(event.target.files || []) }));
    }
  };

  const handleInitiateConsultation = async (e: FormEvent) => {
    e.preventDefault();
    if (!newConsultation.question.trim()) {
      toast({ title: "请输入您的问题", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const consultationData: Omit<Consultation, "id" | "timestamp" | "doctorReplyTimestamp"> & { timestamp: any } = {
        patientId: MOCK_PATIENT_ID,
        patientName: MOCK_PATIENT_NAME, // Store patient name for doctor's convenience
        doctorName: newConsultation.doctor || "系统分配医生",
        date: format(new Date(), "yyyy-MM-dd"),
        timestamp: serverTimestamp(),
        question: newConsultation.question,
        status: 'pending_reply',
        attachments: newConsultation.files.map(f => ({
          name: f.name,
          type: f.type.startsWith("image") ? 'image' : (f.type.startsWith("video") ? 'video' : 'document')
          // In a real app, upload file to Firebase Storage and store URL here
        }))
      };
      const docRef = await addDoc(collection(db, "consultations"), consultationData);
      
      // Add to local state for immediate UI update
      setConsultations(prev => [{ ...consultationData, id: docRef.id, timestamp: new Date() } as Consultation, ...prev]);

      setNewConsultation({ doctor: "", question: "", files: [] });
      toast({ title: "咨询已发起", description: "您的咨询请求已发送，请耐心等待医生回复。" });
    } catch (error) {
      console.error("Error initiating consultation:", error);
      toast({ title: "发起咨询失败", description: "请稍后重试。", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Consultation['status']) => {
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
                    required
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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                         {isSubmitting ? "发送中..." : "发送咨询请求"}
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
              {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : consultations.length > 0 ? (
                <ScrollArea className="h-[500px] pr-3">
                  <div className="space-y-3">
                    {consultations.map(consult => (
                      <Card key={consult.id} className="p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-primary">咨询医生: {consult.doctorName}</p>
                          {getStatusBadge(consult.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          日期: {consult.date} ({consult.timestamp instanceof Date ? format(consult.timestamp, "HH:mm") : 'N/A'})
                        </p>
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
                         {consult.doctorReplyTimestamp && consult.reply && (
                            <p className="text-xs text-muted-foreground text-right mt-1">
                                回复于: {consult.doctorReplyTimestamp instanceof Date ? format(consult.doctorReplyTimestamp, "yyyy-MM-dd HH:mm") : 'N/A'}
                            </p>
                        )}
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
