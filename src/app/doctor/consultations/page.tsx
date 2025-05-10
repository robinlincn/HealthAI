
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessagesSquare, Reply, Image as ImageIcon, Video, Filter, Search, MessageCircleQuestion, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Consultation } from "@/lib/types";
import { db, serverTimestamp, Timestamp as FirestoreTimestamp } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export default function DoctorConsultationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Consultation['status'] | "all">("all");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    try {
      // For now, fetch all. In a real app, filter by doctorId or team.
      const q = query(collection(db, "consultations"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedConsultations: Consultation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const docTimestamp = data.timestamp;
        let processedTimestamp: Date | null = null;
        if (docTimestamp && typeof docTimestamp.toDate === 'function') {
          processedTimestamp = docTimestamp.toDate();
        } else if (docTimestamp instanceof Date) {
          processedTimestamp = docTimestamp;
        } else if (docTimestamp && docTimestamp._seconds !== undefined && docTimestamp._nanoseconds !== undefined) {
          // Handle cases where it might be a plain object from Firestore Admin SDK or similar
           try {
             processedTimestamp = new FirestoreTimestamp(docTimestamp._seconds, docTimestamp._nanoseconds).toDate();
           } catch (e) {
             console.warn(`Error converting plain object timestamp for doc ${doc.id}:`, e);
           }
        }


        const docDoctorReplyTimestamp = data.doctorReplyTimestamp;
        let processedDoctorReplyTimestamp: Date | undefined = undefined;
        if (docDoctorReplyTimestamp && typeof docDoctorReplyTimestamp.toDate === 'function') {
          processedDoctorReplyTimestamp = docDoctorReplyTimestamp.toDate();
        } else if (docDoctorReplyTimestamp instanceof Date) {
          processedDoctorReplyTimestamp = docDoctorReplyTimestamp;
        } else if (docDoctorReplyTimestamp && docDoctorReplyTimestamp._seconds !== undefined && docDoctorReplyTimestamp._nanoseconds !== undefined) {
           try {
             processedDoctorReplyTimestamp = new FirestoreTimestamp(docDoctorReplyTimestamp._seconds, docDoctorReplyTimestamp._nanoseconds).toDate();
           } catch (e) {
            console.warn(`Error converting plain object doctorReplyTimestamp for doc ${doc.id}:`, e);
           }
        }
        
        const patientId = typeof data.patientId === 'string' ? data.patientId : 'N/A';
        const patientName = typeof data.patientName === 'string' ? data.patientName : '未知患者';
        const question = typeof data.question === 'string' ? data.question : '无问题描述';
        const status = ['pending_reply', 'replied', 'closed'].includes(data.status) ? data.status as Consultation['status'] : 'pending_reply';


        if (processedTimestamp) { // Only add if the main timestamp is valid
          fetchedConsultations.push({
            id: doc.id,
            patientId,
            patientName,
            doctorName: data.doctorName, 
            doctorId: data.doctorId, 
            date: format(processedTimestamp, "yyyy-MM-dd"), 
            timestamp: processedTimestamp, 
            question,
            status,
            reply: data.reply, 
            doctorReplyTimestamp: processedDoctorReplyTimestamp, 
            attachments: Array.isArray(data.attachments) ? data.attachments : [], 
          });
        } else {
          console.warn(`Consultation document ${doc.id} has invalid or missing timestamp. Skipping.`);
        }
      });
      setConsultations(fetchedConsultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({ title: "获取咨询列表失败", description: "请稍后重试。", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const filteredConsultations = consultations.filter(consult => 
    (consult.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || consult.question.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || consult.status === filterStatus)
  );

  const selectedConsultation = filteredConsultations.find(c => c.id === selectedConsultationId);

  useEffect(() => {
    if (selectedConsultation) {
        setReplyContent(selectedConsultation.reply || "");
    } else {
        setReplyContent("");
    }
  }, [selectedConsultation]);


  const handleSendReply = async () => {
    if (!selectedConsultationId || !replyContent.trim()) {
        toast({ title: "请输入回复内容", variant: "destructive" });
        return;
    }
    setIsReplying(true);
    try {
      const consultationRef = doc(db, "consultations", selectedConsultationId);
      await updateDoc(consultationRef, {
        reply: replyContent,
        status: "replied",
        doctorReplyTimestamp: serverTimestamp(),
      });

      setConsultations(prev => prev.map(c => 
        c.id === selectedConsultationId 
        ? { ...c, reply: replyContent, status: "replied", doctorReplyTimestamp: new Date() } 
        : c
      ));
      
      toast({ title: "回复已发送"});
    } catch (error) {
        console.error("Error sending reply:", error);
        toast({ title: "回复发送失败", variant: "destructive" });
    } finally {
        setIsReplying(false);
    }
  };
  
  const getStatusText = (status: Consultation['status']) => {
    const map = {
        scheduled: '已安排', // Though not typical for consultations, good to have a map
        completed: '已完成', // More for appointments
        pending_reply: '待回复',
        replied: '已回复',
        closed: '已关闭',
    }
    return map[status] || status;
  }

  const getStatusBadgeColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending_reply': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700'; // Default for any other status like 'scheduled' or 'completed'
    }
  };


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
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">咨询列表</CardTitle>
            <div className="flex gap-2 mt-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="搜索病人/问题" className="pl-8 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Consultation['status'] | "all")}>
                    <SelectTrigger className="w-[130px] h-9">
                        <Filter className="mr-1 h-3 w-3" />
                        <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="pending_reply">待回复</SelectItem>
                        <SelectItem value="replied">已回复</SelectItem>
                        <SelectItem value="closed">已关闭</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ): filteredConsultations.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-25rem)] lg:h-[600px]"> {/* Adjusted height */}
                {filteredConsultations.map(consult => (
                    <div 
                        key={consult.id} 
                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedConsultationId === consult.id ? 'bg-primary/10' : ''}`}
                        onClick={() => setSelectedConsultationId(consult.id)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-primary">{consult.patientName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeColor(consult.status)}`}>
                               {getStatusText(consult.status)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{consult.question}</p>
                        <p className="text-xs text-muted-foreground text-right">
                            {consult.timestamp instanceof Date ? format(consult.timestamp, "yyyy-MM-dd HH:mm") : 'N/A'}
                        </p>
                    </div>
                ))}
              </ScrollArea>
            ) : (
                 <p className="p-4 text-sm text-muted-foreground text-center">无匹配的咨询记录。</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">咨询详情与回复</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConsultation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">病人: {selectedConsultation.patientName} ({selectedConsultation.patientId})</h4>
                  <p className="text-sm text-muted-foreground">时间: {selectedConsultation.timestamp instanceof Date ? format(selectedConsultation.timestamp, "yyyy-MM-dd HH:mm") : 'N/A'}</p>
                </div>
                <ScrollArea className="p-3 border rounded-md bg-background max-h-40"> {/* Made question scrollable */}
                  <p className="text-sm whitespace-pre-wrap">{selectedConsultation.question}</p>
                  {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-medium">附件:</p>
                        {selectedConsultation.attachments.map((att, idx) => (
                             <span key={idx} className="mr-2 p-1 bg-muted rounded text-muted-foreground text-xs">
                                {att.type === 'image' && <ImageIcon className="inline h-3 w-3 mr-1"/>}
                                {att.type === 'video' && <Video className="inline h-3 w-3 mr-1"/>}
                                {att.name}
                            </span>
                        ))}
                    </div>
                  )}
                </ScrollArea>

                {selectedConsultation.reply && (
                     <ScrollArea className="p-3 border rounded-md bg-primary/10 max-h-40"> {/* Made reply scrollable */}
                        <h5 className="text-sm font-semibold text-primary mb-1">您的回复:</h5>
                        <p className="text-sm whitespace-pre-wrap">{selectedConsultation.reply}</p>
                        {selectedConsultation.doctorReplyTimestamp && (
                             <p className="text-xs text-primary/70 text-right mt-1">
                                回复于: {selectedConsultation.doctorReplyTimestamp instanceof Date ? format(selectedConsultation.doctorReplyTimestamp, "yyyy-MM-dd HH:mm") : 'N/A'}
                            </p>
                        )}
                    </ScrollArea>
                )}

                <div className="space-y-2 pt-2">
                    <Label htmlFor="replyTextarea" className="text-base">回复内容</Label>
                    <Textarea 
                        id="replyTextarea"
                        placeholder={selectedConsultation.status === 'closed' ? "此咨询已关闭，无法回复。" : "输入您的回复..."}
                        rows={selectedConsultation.status === 'closed' ? 2 : 5} // Increased rows
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        disabled={isReplying || selectedConsultation.status === 'closed'}
                        className="text-sm"
                    />
                    {selectedConsultation.status !== 'closed' && (
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled><ImageIcon className="mr-1 h-4 w-4"/> 图片</Button>
                                <Button variant="outline" size="sm" disabled><Video className="mr-1 h-4 w-4"/> 视频</Button>
                            </div>
                            <Button onClick={handleSendReply} disabled={isReplying || !replyContent.trim()}>
                                {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Reply className="mr-2 h-4 w-4" />}
                                {isReplying ? "发送中..." : (selectedConsultation.status === 'replied' ? "更新回复" : "发送回复")}
                            </Button>
                        </div>
                    )}
                </div>
                {selectedConsultation.status === 'closed' && (
                     <p className="text-xs text-muted-foreground text-center pt-2">此咨询已关闭，无法进行新的回复。</p>
                )}
                 <p className="text-xs text-muted-foreground text-center pt-2">支持文字、图片、视频等多种回复方式 (功能建设中)。</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
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


    