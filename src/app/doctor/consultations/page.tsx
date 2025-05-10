
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessagesSquare, Reply, Image as ImageIcon, Video, Filter, Search, MessageCircleQuestion, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Consultation } from "@/lib/types";
import { db, serverTimestamp, Timestamp as FirestoreTimestamp } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { format } from "date-fns";

export default function DoctorConsultationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        // For now, fetch all. In a real app, filter by doctorId or team.
        const q = query(collection(db, "consultations"), orderBy("timestamp", "desc"));
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
        toast({ title: "获取咨询列表失败", description: "请稍后重试。", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultations();
  }, [toast]);

  const filteredConsultations = consultations.filter(consult => 
    (consult.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || consult.question.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || consult.status === filterStatus)
  );

  const selectedConsultation = filteredConsultations.find(c => c.id === selectedConsultationId);

  useEffect(() => {
    // When selectedConsultation changes, prefill replyContent if there's an existing reply
    if (selectedConsultation && selectedConsultation.reply) {
        setReplyContent(selectedConsultation.reply);
    } else {
        setReplyContent(""); // Clear for new reply
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
        // In a real app, also assign doctorId if not already assigned
      });

      // Update local state
      setConsultations(prev => prev.map(c => 
        c.id === selectedConsultationId 
        ? { ...c, reply: replyContent, status: "replied", doctorReplyTimestamp: new Date() } 
        : c
      ));
      
      toast({ title: "回复已发送"});
      // Keep reply content for potential edits, or clear: setReplyContent("");
    } catch (error) {
        console.error("Error sending reply:", error);
        toast({ title: "回复发送失败", variant: "destructive" });
    } finally {
        setIsReplying(false);
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
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
              <ScrollArea className="h-[600px]">
                {filteredConsultations.map(consult => (
                    <div 
                        key={consult.id} 
                        className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedConsultationId === consult.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedConsultationId(consult.id)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">{consult.patientName}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${consult.status === 'pending_reply' ? 'bg-yellow-200 text-yellow-800' : (consult.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}`}>
                                {consult.status === 'pending_reply' ? '待回复' : (consult.status === 'replied' ? '已回复' : '已关闭')}
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
                <div className="p-3 border rounded-md bg-background max-h-60 overflow-y-auto">
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
                </div>

                {selectedConsultation.reply && (
                     <div className="p-3 border rounded-md bg-primary/10 max-h-60 overflow-y-auto">
                        <h5 className="text-sm font-semibold text-primary mb-1">您的回复:</h5>
                        <p className="text-sm whitespace-pre-wrap">{selectedConsultation.reply}</p>
                        {selectedConsultation.doctorReplyTimestamp && (
                             <p className="text-xs text-primary/70 text-right mt-1">
                                回复于: {selectedConsultation.doctorReplyTimestamp instanceof Date ? format(selectedConsultation.doctorReplyTimestamp, "yyyy-MM-dd HH:mm") : 'N/A'}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-2 pt-2">
                    <Label htmlFor="replyTextarea">回复内容</Label>
                    <Textarea 
                        id="replyTextarea"
                        placeholder="输入您的回复..." 
                        rows={selectedConsultation.status === 'closed' ? 2 : 4}
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        disabled={isReplying || selectedConsultation.status === 'closed'}
                    />
                    {selectedConsultation.status !== 'closed' && (
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled><ImageIcon className="mr-1 h-4 w-4"/> 图片</Button>
                                <Button variant="outline" size="sm" disabled><Video className="mr-1 h-4 w-4"/> 视频</Button>
                            </div>
                            <Button onClick={handleSendReply} disabled={isReplying}>
                                {isReplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Reply className="mr-2 h-4 w-4" />}
                                {isReplying ? "发送中..." : (selectedConsultation.status === 'replied' ? "更新回复" : "发送回复")}
                            </Button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">支持文字、图片、视频等多种回复方式 (功能建设中)。咨询关闭后无法回复。</p>
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

