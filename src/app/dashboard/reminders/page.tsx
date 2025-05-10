
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellRing, Pill, Stethoscope, PlusCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReminderItem {
  id: string;
  type: 'medication' | 'checkup';
  title: string;
  time?: string; // For medication
  frequency?: string; // For medication
  checkupType?: string; // For checkup
  nextDueDate?: string; // For checkup
  notes?: string;
  enabled: boolean;
  lastTakenOrDone?: string; // Track medication intake or checkup completion
}

interface HealthNotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'personalized_advice';
  read: boolean;
}

const mockMedicationReminders: ReminderItem[] = [
  { id: "med1", type: "medication", title: "二甲双胍", time: "08:00", frequency: "每日两次 (早晚)", notes: "餐后服用", enabled: true, lastTakenOrDone: "今天 08:05" },
  { id: "med2", type: "medication", title: "硝苯地平", time: "07:00", frequency: "每日一次", notes: "晨起", enabled: true },
];

const mockCheckupReminders: ReminderItem[] = [
  { id: "chk1", type: "checkup", title: "空腹血糖检查", checkupType: "血糖", nextDueDate: "2024-07-01", notes: "每月初", enabled: true },
  { id: "chk2", type: "checkup", title: "眼底检查", checkupType: "眼科", nextDueDate: "2024-09-15", notes: "每年一次", enabled: false },
];

const mockNotifications: HealthNotificationItem[] = [
    {id: "n1", title: "饮食建议", content: "您近期的血糖偏高，建议减少高GI食物摄入，多吃蔬菜。", date: "2024-05-20", type: "personalized_advice", read: false},
    {id: "n2", title: "运动提醒", content: "保持适度运动有助于控制血糖，每周至少150分钟中等强度运动。", date: "2024-05-18", type: "info", read: true},
    {id: "n3", title: "高温预警", content: "夏季高温，请注意防暑降温，及时补充水分。", date: "2024-05-15", type: "warning", read: true},
];


export default function RemindersPage() {
  const { toast } = useToast();
  const [medReminders, setMedReminders] = useState<ReminderItem[]>(mockMedicationReminders);
  const [checkupReminders, setCheckupReminders] = useState<ReminderItem[]>(mockCheckupReminders);
  const [notifications, setNotifications] = useState<HealthNotificationItem[]>(mockNotifications);

  // Forms state could be added here for adding/editing reminders

  const toggleReminder = (id: string, type: 'medication' | 'checkup') => {
    const setter = type === 'medication' ? setMedReminders : setCheckupReminders;
    setter(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: "提醒状态已更新" });
  };
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const recordAction = (reminderId: string, type: 'medication' | 'checkup') => {
    const actionText = type === 'medication' ? '服药' : '检查';
    const setter = type === 'medication' ? setMedReminders : setCheckupReminders;
    setter(prev => prev.map(r => r.id === reminderId ? { ...r, lastTakenOrDone: `今天 ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` } : r));
    toast({ title: `${actionText}已记录`, description: `已记录提醒 "${medReminders.find(r=>r.id===reminderId)?.title || checkupReminders.find(r=>r.id===reminderId)?.title}" 的${actionText}情况。`});
  };


  const renderReminderCard = (reminder: ReminderItem, type: 'medication' | 'checkup') => (
    <Card key={reminder.id} className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-md">{reminder.title}</CardTitle>
            <Switch checked={reminder.enabled} onCheckedChange={() => toggleReminder(reminder.id, type)} />
        </div>
        {type === 'medication' && <p className="text-sm text-muted-foreground">{reminder.time} - {reminder.frequency}</p>}
        {type === 'checkup' && <p className="text-sm text-muted-foreground">类型: {reminder.checkupType} | 下次: {reminder.nextDueDate}</p>}
      </CardHeader>
      <CardContent className="text-sm space-y-2 pt-0 pb-3">
        {reminder.notes && <p className="text-xs text-muted-foreground">备注: {reminder.notes}</p>}
         {reminder.lastTakenOrDone && <p className="text-xs text-green-600">上次记录: {reminder.lastTakenOrDone}</p>}
      </CardContent>
      <CardContent className="pt-0 pb-3 flex justify-end">
         <Button size="sm" variant="outline" onClick={() => recordAction(reminder.id, type)}>
            <CheckCircle2 className="mr-2 h-4 w-4"/> 记录{type === 'medication' ? '服药' : '完成检查'}
        </Button>
      </CardContent>
    </Card>
  );
  
  const renderNotificationCard = (notification: HealthNotificationItem) => (
    <Card key={notification.id} className={`shadow-sm ${notification.read ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-md flex items-center">
                {notification.type === 'warning' && <AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>}
                {notification.title}
            </CardTitle>
            <span className="text-xs text-muted-foreground">{notification.date}</span>
        </div>
      </CardHeader>
      <CardContent className="text-sm pt-0 pb-3">
        <p>{notification.content}</p>
      </CardContent>
       {!notification.read && (
        <CardContent className="pt-0 pb-3 flex justify-end">
            <Button size="sm" variant="ghost" onClick={() => markNotificationRead(notification.id)}>标记为已读</Button>
        </CardContent>
       )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BellRing className="mr-3 h-7 w-7 text-primary" />
            健康提醒与通知
          </CardTitle>
          <CardDescription>
            管理您的用药和检查提醒，查看重要的健康建议和通知。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications"><BellRing className="mr-2 h-4 w-4" /> 通知中心</TabsTrigger>
          <TabsTrigger value="medication"><Pill className="mr-2 h-4 w-4" /> 服药提醒</TabsTrigger>
          <TabsTrigger value="checkup"><Stethoscope className="mr-2 h-4 w-4" /> 检查提醒</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知中心</CardTitle>
              <CardDescription>查看系统和AI助手发送的健康建议与通知。</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <ScrollArea className="h-[500px] pr-3">
                  <div className="space-y-3">
                    {notifications.map(renderNotificationCard)}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无通知。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medication">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>服药提醒</CardTitle>
                <CardDescription>设置和管理您的日常用药提醒。</CardDescription>
              </div>
              <Button variant="outline" disabled><PlusCircle className="mr-2 h-4 w-4" /> 新增服药提醒</Button>
            </CardHeader>
            <CardContent>
              {medReminders.length > 0 ? (
                <ScrollArea className="h-[500px] pr-3">
                  <div className="space-y-3">
                    {medReminders.map(rem => renderReminderCard(rem, 'medication'))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无服药提醒。点击上方按钮添加。</p>
              )}
              <p className="text-xs text-muted-foreground mt-4 text-center">提醒功能正在建设中，包括自定义铃声、重复周期等。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkup">
          <Card>
            <CardHeader className="flex justify-between items-center">
                <div>
                    <CardTitle>检查提醒</CardTitle>
                    <CardDescription>设置和管理您的定期健康检查提醒。</CardDescription>
                </div>
                 <Button variant="outline" disabled><PlusCircle className="mr-2 h-4 w-4" /> 新增检查提醒</Button>
            </CardHeader>
            <CardContent>
              {checkupReminders.length > 0 ? (
                <ScrollArea className="h-[500px] pr-3">
                  <div className="space-y-3">
                    {checkupReminders.map(rem => renderReminderCard(rem, 'checkup'))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无检查提醒。点击上方按钮添加。</p>
              )}
              <p className="text-xs text-muted-foreground mt-4 text-center">检查提醒的详细设置和记录功能正在完善。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
