
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Send, ListCollapse, FileImage, Video, Loader2 } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Consultation } from "@/lib/types";
import { db, serverTimestamp, Timestamp as FirestoreTimestamp } from "@/lib/firebase"; // Corrected Timestamp import alias
import { collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore"; // Removed specific Timestamp import
import { format } from "date-fns";

const MOCK_PATIENT_ID = "patientUser123";
const MOCK_PATIENT_NAME = "示例用户"; 

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
        patientName: MOCK_PATIENT_NAME,
        doctorName: newConsultation.doctor || "系统分配医生",
        date: format(new Date(), "yyyy-MM-dd"),
        timestamp: serverTimestamp(),
        question: newConsultation.question,
        status: 'pending_reply',
        attachments: newConsultation.files.map(f => ({
          name: f.name,
          type: f.type.startsWith("image") ? 'image' : (f.type.startsWith("video") ? 'video' : 'document')
        }))
      };
      const docRef = await addDoc(collection(db, "consultations"), consultationData);
      
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
        case 'pending_reply': return <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700">待回复</span>;
        case 'replied': return <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">已回复</span>;
        case 'closed': return <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">已关闭</span>;
        default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="newConsultation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-sm h-10">
          <TabsTrigger value="newConsultation" className="py-2 px-1"><Send className="mr-1 h-4 w-4" /> 发起咨询</TabsTrigger>
          <TabsTrigger value="history" className="py-2 px-1"><ListCollapse className="mr-1 h-4 w-4" /> 咨询记录</TabsTrigger>
        </TabsList>

        <TabsContent value="newConsultation">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">发起新的在线咨询</CardTitle>
              <CardDescription className="text-xs">请详细描述您的问题，如有需要可上传附件。</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleInitiateConsultation} className="space-y-3">
                <div>
                  <Label htmlFor="doctorSelect" className="text-sm">选择医生 (可选)</Label>
                  <Input 
                    id="doctorSelect" 
                    placeholder="输入医生姓名 (功能建设中)" 
                    value={newConsultation.doctor}
                    onChange={(e) => setNewConsultation(prev => ({...prev, doctor: e.target.value}))}
                    className="mt-1 h-9 text-sm" 
                    disabled 
                  />
                   <p className="text-xs text-muted-foreground mt-1">如不选择，系统将为您分配医生。</p>
                </div>
                <div>
                  <Label htmlFor="consultQuestion" className="text-sm">您的问题</Label>
                  <Textarea
                    id="consultQuestion"
                    placeholder="请详细描述您的症状、疑问..."
                    rows={4} // Reduced rows for mobile
                    value={newConsultation.question}
                    onChange={(e) => setNewConsultation(prev => ({...prev, question: e.target.value}))}
                    className="mt-1 text-sm"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="attachments" className="text-sm">上传附件</Label>
                  <Input id="attachments" type="file" multiple onChange={handleFileChange} className="mt-1 text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {newConsultation.files.length > 0 && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      已选: {newConsultation.files.map(f => f.name).join(", ")}
                    </div>
                  )}
                </div>
                 <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-muted-foreground">支持预约视频/电话 (建设中)</p>
                    <Button type="submit" disabled={isSubmitting} size="sm" className="text-sm h-9">
                        {isSubmitting ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Send className="mr-1 h-3 w-3" />}
                         {isSubmitting ? "发送中..." : "发送咨询"}
                    </Button>
                 </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">历史咨询记录</CardTitle>
              <CardDescription className="text-xs">查看您过往的在线咨询和医生的回复。</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-[150px]">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : consultations.length > 0 ? (
                <ScrollArea className="h-[300px] pr-2">
                  <div className="space-y-3">
                    {consultations.map(consult => (
                      <Card key={consult.id} className="p-3 shadow-xs">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-semibold text-primary">咨询医生: {consult.doctorName}</p>
                          {getStatusBadge(consult.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">
                          日期: {consult.date} ({consult.timestamp instanceof Date ? format(consult.timestamp, "HH:mm") : 'N/A'})
                        </p>
                        <p className="text-sm mb-1 line-clamp-3"><strong>您:</strong> {consult.question}</p>
                        {consult.attachments && consult.attachments.length > 0 && (
                            <div className="text-xs mb-1.5">
                                <strong>附件: </strong>
                                {consult.attachments.map((att, idx) => (
                                    <span key={idx} className="mr-1.5 p-0.5 bg-muted rounded text-muted-foreground text-xs">
                                        {att.type === 'image' && <FileImage className="inline h-2.5 w-2.5 mr-0.5"/>}
                                        {att.type === 'video' && <Video className="inline h-2.5 w-2.5 mr-0.5"/>}
                                        {att.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        {consult.reply && <p className="text-sm p-2 bg-muted/50 rounded-md line-clamp-3"><strong>医生回复:</strong> {consult.reply}</p>}
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
                <p className="text-muted-foreground text-center py-4 text-sm">暂无历史咨询记录。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
