
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  MessagesSquare, Reply, Filter, Search, MessageCircleQuestion, Loader2, Smartphone, Users as UsersIconLucide, Languages, Tv, ListFilter, Image as ImageIconSvg, Video as VideoIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Consultation, ConsultationSource } from "@/lib/types";
import { db, serverTimestamp, Timestamp as FirestoreTimestamp } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { format, parseISO, subDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const MOCK_DOCTOR_ID = "doctorUser456";

const getStatusText = (status: Consultation['status']): string => {
    const map: Record<Consultation['status'], string> = {
        scheduled: '已安排',
        completed: '已完成',
        pending_reply: '待回复',
        replied: '已回复',
        closed: '已关闭',
        pending_confirmation: '待确认',
        cancelled: '已取消'
    };
    return map[status] || status;
};

const getStatusBadgeColor = (status: Consultation['status']): string => {
    switch (status) {
      case 'pending_reply': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      case 'pending_confirmation': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
};

const getSourceTextAndIcon = (source?: ConsultationSource): { text: string; icon: React.ElementType } => {
    switch (source) {
      case 'app': return { text: 'APP端', icon: Smartphone };
      case 'wechat_mini_program': return { text: '小程序', icon: Tv };
      case 'wechat_personal': return { text: '个人微信', icon: MessageCircleQuestion };
      case 'wechat_group': return { text: '微信群', icon: UsersIconLucide };
      default: return { text: '未知来源', icon: Languages };
    }
};

const mockDoctorConsultations: Consultation[] = [
    {
        id: "mockPending1",
        patientId: "patientMock001",
        patientName: "模拟患者A (演示)",
        doctorName: "当前医生",
        date: format(subDays(new Date(), 1), "yyyy-MM-dd"),
        timestamp: subDays(new Date(), 1),
        question: "医生您好，我最近感觉有些头晕，早上起来血糖有点高，大概在8.5左右，我应该怎么办？这是模拟的问题。",
        status: 'pending_reply',
        attachments: [{ name: "血糖记录示例.jpg", type: 'image'}],
        source: 'app'
    },
    {
        id: "mockReplied1",
        patientId: "patientMock002",
        patientName: "模拟患者B (演示)",
        doctorName: "当前医生",
        date: format(subDays(new Date(), 2), "yyyy-MM-dd"),
        timestamp: subDays(new Date(), 2),
        question: "我按照您上次的建议调整了饮食，感觉好多了，谢谢医生！这是另一个模拟问题。",
        status: 'replied',
        reply: "不客气，继续保持良好的生活习惯，定期监测。这是模拟的回复。",
        doctorReplyTimestamp: subDays(new Date(), 1),
        source: 'wechat_mini_program'
    },
    {
        id: "mockPending2",
        patientId: "patientMock003",
        patientName: "模拟患者C (演示)",
        doctorName: "当前医生",
        date: format(new Date(), "yyyy-MM-dd"),
        timestamp: new Date(),
        question: "昨天晚上吃了火锅，今天早上起来感觉有点不舒服，需要注意什么吗？",
        status: 'pending_reply',
        source: 'wechat_personal'
    }
];


export default function DoctorConsultationsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<Consultation['status'] | "all">("all");
  const [filterSource, setFilterSource] = useState<ConsultationSource | "all">("all");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReplying, setIsReplying] = useState<boolean>(false);

  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    let fetchedConsultationsFromDB: Consultation[] = [];
    let fetchErrorOccurred = false;
    try {
      const q = query(
        collection(db, "consultations"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docTimestamp = data.timestamp;
        let processedTimestamp: Date | null = null;

        if (docTimestamp && typeof docTimestamp.toDate === 'function') {
          processedTimestamp = docTimestamp.toDate();
        } else if (docTimestamp instanceof Date) {
          processedTimestamp = docTimestamp;
        } else if (docTimestamp && typeof docTimestamp.seconds === 'number' && typeof docTimestamp.nanoseconds === 'number') {
           try {
             processedTimestamp = new FirestoreTimestamp(docTimestamp.seconds, docTimestamp.nanoseconds).toDate();
           } catch (e) {
             console.warn(`Error converting plain object timestamp for doc ${docSnap.id}:`, e);
           }
        }

        const docDoctorReplyTimestamp = data.doctorReplyTimestamp;
        let processedDoctorReplyTimestamp: Date | undefined = undefined;
        if (docDoctorReplyTimestamp && typeof docDoctorReplyTimestamp.toDate === 'function') {
          processedDoctorReplyTimestamp = docDoctorReplyTimestamp.toDate();
        } else if (docDoctorReplyTimestamp instanceof Date) {
          processedDoctorReplyTimestamp = docDoctorReplyTimestamp;
        } else if (docDoctorReplyTimestamp && typeof docDoctorReplyTimestamp.seconds === 'number' && typeof docDoctorReplyTimestamp.nanoseconds === 'number') {
           try {
             processedDoctorReplyTimestamp = new FirestoreTimestamp(docDoctorReplyTimestamp.seconds, docDoctorReplyTimestamp.nanoseconds).toDate();
           } catch (e) {
            console.warn(`Error converting plain object doctorReplyTimestamp for doc ${docSnap.id}:`, e);
           }
        }

        const patientId = typeof data.patientId === 'string' ? data.patientId : 'N/A';
        const patientName = typeof data.patientName === 'string' ? data.patientName : '未知患者';
        const question = typeof data.question === 'string' ? data.question : '无问题描述';
        const status = ['pending_reply', 'replied', 'closed', 'scheduled', 'completed', 'cancelled', 'pending_confirmation'].includes(data.status) ? data.status as Consultation['status'] : 'pending_reply';

        if (processedTimestamp) {
          fetchedConsultationsFromDB.push({
            id: docSnap.id,
            patientId,
            patientName,
            doctorName: data.doctorName || "未分配",
            doctorId: data.doctorId,
            date: format(processedTimestamp, "yyyy-MM-dd"),
            timestamp: processedTimestamp,
            question,
            status,
            reply: data.reply,
            doctorReplyTimestamp: processedDoctorReplyTimestamp,
            attachments: Array.isArray(data.attachments) ? data.attachments : [],
            source: data.source || 'app',
          });
        } else {
          console.warn(`Consultation document ${docSnap.id} has invalid or missing timestamp. Skipping.`);
        }
      });
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({ title: "获取咨询列表失败", description: "请稍后重试。", variant: "destructive" });
      fetchErrorOccurred = true;
    } finally {
      setIsLoading(false);
    }

    if (!fetchErrorOccurred && fetchedConsultationsFromDB.length === 0) {
      setConsultations(mockDoctorConsultations);
      toast({ title: "提示", description: "已加载模拟咨询数据用于演示。", variant: "default" });
    } else if (!fetchErrorOccurred) {
      setConsultations(fetchedConsultationsFromDB);
    }
  }, [toast]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(consult =>
      (consult.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || consult.question.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || consult.status === filterStatus) &&
      (filterSource === "all" || consult.source === filterSource)
    );
  }, [consultations, searchTerm, filterStatus, filterSource]);

  const selectedConsultation = useMemo(() => {
    return filteredConsultations.find(c => c.id === selectedConsultationId);
  }, [filteredConsultations, selectedConsultationId]);

  useEffect(() => {
    if (selectedConsultation) {
        setReplyContent(selectedConsultation.reply || "");
    } else {
        setReplyContent("");
    }
  }, [selectedConsultation]);

  const handleSendReply = useCallback(async () => {
    if (!selectedConsultationId || !replyContent.trim()) {
        toast({ title: "请输入回复内容", variant: "destructive" });
        return;
    }
    setIsReplying(true);

    const currentConsultation = consultations.find(c => c.id === selectedConsultationId);
    if (!currentConsultation) {
        setIsReplying(false);
        toast({ title: "错误", description: "未找到选中的咨询。", variant: "destructive" });
        return;
    }

    const isMock = selectedConsultationId.startsWith("mock");

    if (isMock) {
        setConsultations(prev => prev.map(c =>
            c.id === selectedConsultationId
            ? { ...c, reply: replyContent, status: "replied" as Consultation['status'], doctorReplyTimestamp: new Date(), doctorId: MOCK_DOCTOR_ID, doctorName: "当前医生" }
            : c
          ));
        toast({ title: "模拟回复已发送"});
        setIsReplying(false);
        setReplyContent("");
        setSelectedConsultationId(null);
        return;
    }

    try {
      const consultationRef = doc(db, "consultations", selectedConsultationId);
      await updateDoc(consultationRef, {
        reply: replyContent,
        status: "replied",
        doctorReplyTimestamp: serverTimestamp(),
        doctorId: MOCK_DOCTOR_ID,
        doctorName: "当前医生"
      });

       setConsultations(prev => prev.map(c =>
        c.id === selectedConsultationId
        ? { ...c, reply: replyContent, status: "replied" as Consultation['status'], doctorReplyTimestamp: new Date(), doctorId: MOCK_DOCTOR_ID, doctorName: "当前医生" }
        : c
      ));
      setReplyContent("");
      setSelectedConsultationId(null);
      toast({ title: "回复已发送"});
    } catch (error) {
        console.error("Error sending reply:", error);
        toast({ title: "回复发送失败", variant: "destructive" });
    } finally {
        setIsReplying(false);
    }
  }, [selectedConsultationId, replyContent, toast, consultations]);
  
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
            <div className="space-y-2 mt-2">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="搜索病人/问题" className="pl-8 h-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Consultation['status'] | "all")}>
                        <SelectTrigger className="w-full h-9">
                            <ListFilter className="mr-1 h-3 w-3" />
                            <SelectValue placeholder="状态" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部状态</SelectItem>
                            <SelectItem value="pending_reply">待回复</SelectItem>
                            <SelectItem value="replied">已回复</SelectItem>
                            <SelectItem value="closed">已关闭</SelectItem>
                            <SelectItem value="pending_confirmation">待确认</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterSource} onValueChange={(value) => setFilterSource(value as ConsultationSource | "all")}>
                        <SelectTrigger className="w-full h-9">
                            <ListFilter className="mr-1 h-3 w-3" />
                            <SelectValue placeholder="来源" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">所有来源</SelectItem>
                            <SelectItem value="app">APP端</SelectItem>
                            <SelectItem value="wechat_mini_program">小程序</SelectItem>
                            <SelectItem value="wechat_personal">个人微信</SelectItem>
                            <SelectItem value="wechat_group">微信群</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ): filteredConsultations.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-24rem)] md:h-[calc(100vh-28rem)] lg:h-[600px]">
                {filteredConsultations.map(consult => {
                    const sourceInfo = getSourceTextAndIcon(consult.source);
                    const SourceIcon = sourceInfo.icon;
                    return (
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
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                                <span className="inline-flex items-center">
                                    <SourceIcon className="inline h-3 w-3 mr-1 opacity-70"/>
                                    {sourceInfo.text}
                                </span>
                                <span>
                                    {consult.timestamp instanceof Date ? format(consult.timestamp, "yy-MM-dd HH:mm") : String(consult.timestamp)}
                                </span>
                            </div>
                        </div>
                    );
                })}
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
                  <div className="text-sm text-muted-foreground">
                    <p>时间: {selectedConsultation.timestamp instanceof Date ? format(selectedConsultation.timestamp, "yyyy-MM-dd HH:mm") : String(selectedConsultation.timestamp)}</p>
                    {selectedConsultation.source && (
                        <p className="flex items-center">来源: <getSourceTextAndIcon(selectedConsultation.source).icon className="inline h-3.5 w-3.5 mx-1 opacity-80"/> {getSourceTextAndIcon(selectedConsultation.source).text}</p>
                    )}
                  </div>
                </div>
                <ScrollArea className="p-3 border rounded-md bg-background max-h-40">
                  <p className="text-sm whitespace-pre-wrap">{selectedConsultation.question}</p>
                  {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-medium">附件:</p>
                        {selectedConsultation.attachments.map((att, idx) => (
                             <span key={idx} className="mr-2 p-1 bg-muted rounded text-muted-foreground text-xs">
                                {att.type === 'image' && <ImageIconSvg className="inline h-3 w-3 mr-1"/>}
                                {att.type === 'video' && <VideoIcon className="inline h-3 w-3 mr-1"/>}
                                {att.name}
                            </span>
                        ))}
                    </div>
                  )}
                </ScrollArea>

                {selectedConsultation.reply && (
                     <ScrollArea className="p-3 border rounded-md bg-primary/10 max-h-40">
                        <h5 className="text-sm font-semibold text-primary mb-1">回复 ({selectedConsultation.doctorName || '医生'}):</h5>
                        <p className="text-sm whitespace-pre-wrap">{selectedConsultation.reply}</p>
                        {selectedConsultation.doctorReplyTimestamp && (
                             <p className="text-xs text-primary/70 text-right mt-1">
                                回复于: {selectedConsultation.doctorReplyTimestamp instanceof Date ? format(selectedConsultation.doctorReplyTimestamp, "yyyy-MM-dd HH:mm") : String(selectedConsultation.doctorReplyTimestamp)}
                            </p>
                        )}
                    </ScrollArea>
                )}

                <div className="space-y-2 pt-2">
                    <Label htmlFor="replyTextarea" className="text-base">回复内容</Label>
                    <Textarea
                        id="replyTextarea"
                        placeholder={selectedConsultation.status === 'closed' ? "此咨询已关闭，无法回复。" : "输入您的回复..."}
                        rows={selectedConsultation.status === 'closed' ? 2 : 5}
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        disabled={isReplying || selectedConsultation.status === 'closed'}
                        className="text-sm"
                    />
                    {selectedConsultation.status !== 'closed' && (
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled><ImageIconSvg className="mr-1 h-4 w-4"/> 图片</Button>
                                <Button variant="outline" size="sm" disabled><VideoIcon className="mr-1 h-4 w-4"/> 视频</Button>
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

    