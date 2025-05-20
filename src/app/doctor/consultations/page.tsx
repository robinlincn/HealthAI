
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MessagesSquare, Send, UserCircle, Phone, Video, FileText as FileTextIcon, Loader2, MessageCircle, Users, Filter, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, differenceInDays, isToday, isYesterday } from "date-fns";
import type { Consultation, ConsultationSource } from "@/lib/types";
import { db, serverTimestamp, Timestamp as FirestoreTimestamp } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp as firestoreServerTimestamp } from "firebase/firestore";

// Mock doctor ID for sending replies
const MOCK_DOCTOR_ID = "doctorUser789";
const MOCK_DOCTOR_NAME = "王医生";

const mockDoctorConsultations: Consultation[] = [
  { id: "consult-001", patientId: "pat001", patientName: "张三", doctorId: MOCK_DOCTOR_ID, doctorName: MOCK_DOCTOR_NAME, date: new Date(Date.now() - 86400000 * 2).toISOString(), timestamp: new Date(Date.now() - 86400000 * 2), question: "医生您好，我最近感觉血糖控制不太好，餐后经常超过10mmol/L，应该怎么办？这是我最近一周的血糖记录附件。", status: "pending_reply", attachments: [{ name: "血糖记录.pdf", type: "document" }], source: "app" },
  { id: "consult-002", patientId: "pat002", patientName: "李四", doctorId: MOCK_DOCTOR_ID, doctorName: MOCK_DOCTOR_NAME, date: new Date(Date.now() - 86400000 * 1).toISOString(), timestamp: new Date(Date.now() - 86400000 * 1), question: "我按照您上次的建议调整了饮食，感觉好多了，谢谢医生！", status: "replied", reply: "不客气，李女士。很高兴听到您的反馈，请继续保持良好的生活习惯，如有不适随时联系。", doctorReplyTimestamp: new Date(Date.now() - 86400000 * 0.8), source: "wechat_personal" },
  { id: "consult-003", patientId: "pat003", patientName: "王五", doctorId: MOCK_DOCTOR_ID, doctorName: MOCK_DOCTOR_NAME, date: new Date(Date.now() - 86400000 * 5).toISOString(), timestamp: new Date(Date.now() - 86400000 * 5), question: "这个药吃了以后有点头晕，是副作用吗？", status: "closed", reply: "王先生您好，轻微头晕可能是药物初期反应，一般几天后会缓解。如果持续不适或加重，请及时停药并联系我或就近就医。我们也可以考虑调整用药方案。", doctorReplyTimestamp: new Date(Date.now() - 86400000 * 4.5), source: "app" },
  { id: "consult-004", patientId: "pat004", patientName: "赵六", doctorId: MOCK_DOCTOR_ID, doctorName: MOCK_DOCTOR_NAME, date: new Date().toISOString(), timestamp: new Date(), question: "预约明天下午的视频复诊，麻烦确认一下。", status: "pending_confirmation", source: "wechat_mini_program" },
];

const getStatusText = (status: Consultation['status']): string => {
  const map: Record<Consultation['status'], string> = {
    pending_reply: "待回复",
    replied: "已回复",
    closed: "已关闭",
    scheduled: "已安排",
    completed: "已完成",
    cancelled: "已取消",
    pending_confirmation: "待确认",
  };
  return map[status] || status;
};

const getStatusBadgeColor = (status: Consultation['status']): string => {
  switch (status) {
    case 'pending_reply': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'replied': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'closed': return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'pending_confirmation': return 'bg-orange-100 text-orange-700 border-orange-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getSourceTextAndIcon = (source?: ConsultationSource): { text: string; icon: React.ElementType | null } => {
  if (!source) return { text: "未知来源", icon: AlertTriangle };
  switch (source) {
    case 'app': return { text: "App端", icon: MessageCircle };
    case 'wechat_mini_program': return { text: "微信小程序", icon: MessageCircle }; // Could use a specific WeChat icon if available
    case 'wechat_personal': return { text: "个人微信", icon: Users };
    case 'wechat_group': return { text: "微信群", icon: Users };
    default: return { text: source, icon: AlertTriangle };
  }
};


export default function DoctorConsultationsPage() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>(mockDoctorConsultations);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Consultation['status'] | "all">("all");
  const [filterSource, setFilterSource] = useState<ConsultationSource | "all">("all");

  const fetchConsultations = useCallback(() => {
    setIsLoading(true);
    // Simulating fetch, in real app this would be an API call or Firestore listener
    // For Firestore real-time updates:
    const q = query(collection(db, "consultations"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedConsultations: Consultation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedConsultations.push({
          ...data,
          id: doc.id,
          // Ensure timestamps are converted to Date objects
          timestamp: data.timestamp instanceof FirestoreTimestamp ? data.timestamp.toDate() : new Date(data.timestamp as string),
          doctorReplyTimestamp: data.doctorReplyTimestamp && (data.doctorReplyTimestamp instanceof FirestoreTimestamp ? data.doctorReplyTimestamp.toDate() : new Date(data.doctorReplyTimestamp as string)),
        } as Consultation);
      });
      setConsultations(prevConsultations => {
        // Basic merge to avoid full replacement if not desired,
        // or use a more sophisticated merging strategy
        const newConsultationsMap = new Map(fetchedConsultations.map(c => [c.id, c]));
        const updated = prevConsultations.map(pc => newConsultationsMap.get(pc.id) || pc);
        const added = fetchedConsultations.filter(fc => !prevConsultations.some(pc => pc.id === fc.id));
        return [...updated, ...added].sort((a,b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime());
      });
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching consultations:", error);
      toast({ title: "获取咨询列表失败", description: "请检查网络连接或稍后重试。", variant: "destructive" });
      setIsLoading(false);
    });
    return unsubscribe; // Return unsubscribe function for cleanup
  }, [toast]);


  useEffect(() => {
    // Set initial mock data and then start listening or simulate initial fetch
    setConsultations(mockDoctorConsultations.sort((a,b) => (b.timestamp as Date).getTime() - (a.timestamp as Date).getTime()));
    setIsLoading(false); // Assume mock data is loaded
    
    // Uncomment below to use real Firestore listener
    // const unsubscribe = fetchConsultations();
    // return () => unsubscribe(); 
  }, []); // Removed fetchConsultations from dependency array to avoid re-triggering on every render

  const selectedConsultation = useMemo(() => {
    return consultations.find(c => c.id === selectedConsultationId) || null;
  }, [selectedConsultationId, consultations]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      const nameMatch = c.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "all" || c.status === filterStatus;
      const sourceMatch = filterSource === "all" || c.source === filterSource;
      return nameMatch && statusMatch && sourceMatch;
    });
  }, [consultations, searchTerm, filterStatus, filterSource]);

  const handleSelectConsultation = (consultationId: string) => {
    setSelectedConsultationId(consultationId);
    setReplyContent(""); // Clear reply input when selecting a new consultation
  };

  const handleSendReply = useCallback(async () => {
    if (!selectedConsultationId || !replyContent.trim()) {
      toast({ title: "请输入回复内容", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const consultationRef = doc(db, "consultations", selectedConsultationId);
      await updateDoc(consultationRef, {
        reply: replyContent,
        status: 'replied',
        doctorReplyTimestamp: firestoreServerTimestamp(),
        doctorId: MOCK_DOCTOR_ID,
        doctorName: MOCK_DOCTOR_NAME,
      });

      // Optimistically update UI, or rely on Firestore listener from fetchConsultations
       setConsultations(prev => prev.map(c => c.id === selectedConsultationId ? {
           ...c, 
           reply: replyContent, 
           status: 'replied', 
           doctorReplyTimestamp: new Date(),
           doctorId: MOCK_DOCTOR_ID,
           doctorName: MOCK_DOCTOR_NAME,
       } : c));
      
      setReplyContent("");
      toast({ title: "回复已发送", description: "您的回复已成功发送给病人。" });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ title: "发送回复失败", description: "请稍后重试。", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedConsultationId, replyContent, toast]);
  
  const formatDisplayDate = (isoDate: string | Date) => {
    const date = typeof isoDate === 'string' ? parseISO(isoDate) : isoDate;
    if (isToday(date)) return `今天 ${format(date, "HH:mm")}`;
    if (isYesterday(date)) return `昨天 ${format(date, "HH:mm")}`;
    if (differenceInDays(new Date(), date) < 7) return format(date, "EEEE HH:mm");
    return format(date, "yyyy-MM-dd HH:mm");
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="搜索病人姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as Consultation['status'] | "all")}>
              <SelectTrigger><Filter className="mr-2 h-4 w-4"/>状态筛选</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="pending_reply">待回复</SelectItem>
                <SelectItem value="replied">已回复</SelectItem>
                <SelectItem value="closed">已关闭</SelectItem>
                <SelectItem value="pending_confirmation">待确认</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={(value) => setFilterSource(value as ConsultationSource | "all")}>
              <SelectTrigger><Filter className="mr-2 h-4 w-4"/>来源筛选</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有来源</SelectItem>
                <SelectItem value="app">App端</SelectItem>
                <SelectItem value="wechat_mini_program">微信小程序</SelectItem>
                <SelectItem value="wechat_personal">个人微信</SelectItem>
                <SelectItem value="wechat_group">微信群</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CardTitle className="text-lg mb-2">咨询列表</CardTitle>
              {isLoading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : filteredConsultations.length > 0 ? (
                <ScrollArea className="h-[500px] border rounded-md">
                  {filteredConsultations.map((consult) => (
                    <div
                      key={consult.id}
                      className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-muted/50 ${selectedConsultationId === consult.id ? 'bg-primary/10' : ''}`}
                      onClick={() => handleSelectConsultation(consult.id)}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm">{consult.patientName}</span>
                        <Badge variant="outline" className={`text-xs ${getStatusBadgeColor(consult.status)}`}>{getStatusText(consult.status)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5" title={consult.question}>{consult.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDisplayDate(consult.timestamp)}</p>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-10">暂无匹配的咨询记录。</p>
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedConsultation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">咨询详情: {selectedConsultation.patientName}</CardTitle>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{formatDisplayDate(selectedConsultation.timestamp)}</span>
                      <Badge variant="outline" className="capitalize text-xs">{getSourceTextAndIcon(selectedConsultation.source).text}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-semibold">病人问题:</Label>
                      <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md mt-1">{selectedConsultation.question}</p>
                      {selectedConsultation.attachments && selectedConsultation.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">附件:</p>
                          <ul className="list-none space-y-1 mt-1">
                            {selectedConsultation.attachments.map((att, idx) => {
                              const Icon = att.type === 'image' ? ImageIcon : att.type === 'video' ? Video : FileTextIcon;
                              return (
                                <li key={idx} className="text-xs flex items-center p-1.5 bg-muted/20 rounded-md hover:bg-muted/40">
                                  <Icon className="h-3.5 w-3.5 mr-1.5 text-primary shrink-0" />
                                  <span className="truncate" title={att.name}>{att.name}</span>
                                  {/* <Button variant="link" size="xs" className="ml-auto h-auto p-0 text-xs">查看</Button> */}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>

                    {selectedConsultation.reply && (
                      <div>
                        <Label className="font-semibold">医生回复 ({selectedConsultation.doctorName || '医生'}):</Label>
                        <p className="text-sm whitespace-pre-wrap bg-primary/5 p-3 rounded-md mt-1">{selectedConsultation.reply}</p>
                        {selectedConsultation.doctorReplyTimestamp && (
                          <p className="text-xs text-muted-foreground text-right mt-1">
                            回复于: {formatDisplayDate(selectedConsultation.doctorReplyTimestamp)}
                          </p>
                        )}
                      </div>
                    )}

                    {(selectedConsultation.status === 'pending_reply' || selectedConsultation.status === 'replied') && (
                      <div className="pt-4 border-t">
                        <Label htmlFor="replyContent" className="font-semibold block mb-1">
                          {selectedConsultation.reply ? "修改回复:" : "回复病人:"}
                        </Label>
                        <Textarea
                          id="replyContent"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="输入您的回复..."
                          rows={4}
                          className="text-sm"
                        />
                        <Button onClick={handleSendReply} disabled={isSubmitting || !replyContent.trim()} className="mt-3 w-full sm:w-auto">
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSubmitting ? "发送中..." : (selectedConsultation.reply ? "更新回复" : "发送回复")}
                        </Button>
                      </div>
                    )}
                    {selectedConsultation.status === 'closed' && (
                       <p className="text-sm text-muted-foreground border-t pt-3 mt-3">此咨询已关闭。</p>
                    )}
                     {selectedConsultation.status === 'pending_confirmation' && (
                       <div className="pt-4 border-t text-sm text-muted-foreground">
                          <p>病人请求预约，等待您的确认。</p>
                          <div className="mt-2 space-x-2">
                            <Button size="sm" onClick={() => toast({title:"操作模拟", description:"已确认预约。"})}>确认预约</Button>
                            <Button size="sm" variant="outline" onClick={() => toast({title:"操作模拟", description:"已拒绝预约。"})}>拒绝/另约</Button>
                          </div>
                       </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground border rounded-md p-8">
                  <MessagesSquare className="h-16 w-16 mb-4 text-gray-300" />
                  <p>请从左侧列表选择一个咨询以查看详情和回复。</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    