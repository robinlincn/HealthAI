
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BellRing, Pill, Stethoscope, PlusCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReminderItem {
  id: string;
  type: 'medication' | 'checkup';
  title: string;
  time?: string; 
  frequency?: string; 
  checkupType?: string;
  nextDueDate?: string;
  notes?: string;
  enabled: boolean;
  lastTakenOrDone?: string;
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
    const reminderList = type === 'medication' ? medReminders : checkupReminders;
    setter(prev => prev.map(r => r.id === reminderId ? { ...r, lastTakenOrDone: `今天 ${new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` } : r));
    toast({ title: `${actionText}已记录`, description: `已记录提醒 "${reminderList.find(r=>r.id===reminderId)?.title}" 的${actionText}情况。`});
  };

  const renderReminderCard = (reminder: ReminderItem, type: 'medication' | 'checkup') => (
    <Card key={reminder.id} className="shadow-xs">
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">{reminder.title}</CardTitle>
            <Switch checked={reminder.enabled} onCheckedChange={() => toggleReminder(reminder.id, type)} />
        </div>
        {type === 'medication' && <p className="text-xs text-muted-foreground">{reminder.time} - {reminder.frequency}</p>}
        {type === 'checkup' && <p className="text-xs text-muted-foreground">类型: {reminder.checkupType} | 下次: {reminder.nextDueDate}</p>}
      </CardHeader>
      <CardContent className="text-xs space-y-1 p-3 pt-0 pb-2">
        {reminder.notes && <p className="text-muted-foreground">备注: {reminder.notes}</p>}
         {reminder.lastTakenOrDone && <p className="text-green-600">上次记录: {reminder.lastTakenOrDone}</p>}
      </CardContent>
      <CardContent className="p-3 pt-0 flex justify-end">
         <Button size="sm" variant="outline" onClick={() => recordAction(reminder.id, type)} className="text-xs h-7">
            <CheckCircle2 className="mr-1 h-3 w-3"/> 记录{type === 'medication' ? '服药' : '完成'}
        </Button>
      </CardContent>
    </Card>
  );
  
  const renderNotificationCard = (notification: HealthNotificationItem) => (
    <Card key={notification.id} className={`shadow-xs ${notification.read ? 'opacity-70' : ''}`}>
      <CardHeader className="p-3 pb-1.5">
        <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium flex items-center">
                {notification.type === 'warning' && <AlertTriangle className="mr-1.5 h-4 w-4 text-destructive"/>}
                {notification.title}
            </CardTitle>
            <span className="text-xs text-muted-foreground">{notification.date}</span>
        </div>
      </CardHeader>
      <CardContent className="text-xs p-3 pt-0 pb-2">
        <p>{notification.content}</p>
      </CardContent>
       {!notification.read && (
        <CardContent className="p-3 pt-0 flex justify-end">
            <Button size="sm" variant="ghost" onClick={() => markNotificationRead(notification.id)} className="text-xs h-7">标记为已读</Button>
        </CardContent>
       )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm h-10">
          <TabsTrigger value="notifications" className="py-2 px-1"><BellRing className="mr-1 h-4 w-4" /> 通知</TabsTrigger>
          <TabsTrigger value="medication" className="py-2 px-1"><Pill className="mr-1 h-4 w-4" /> 服药</TabsTrigger>
          <TabsTrigger value="checkup" className="py-2 px-1"><Stethoscope className="mr-1 h-4 w-4" /> 检查</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card className="shadow-sm">
            <CardHeader className="p-4 flex flex-row justify-between items-center">
              <CardTitle className="text-base">通知中心</CardTitle>
              {/* Optional: Add actions like "Mark all as read" */}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {notifications.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-18rem)] sm:h-[calc(100vh-20rem)] pr-2"> {/* Adjusted height for mobile */}
                  <div className="space-y-2.5">
                    {notifications.map(renderNotificationCard)}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4 text-sm">暂无通知。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medication">
          <Card className="shadow-sm">
            <CardHeader className="p-4 flex justify-between items-center">
                <CardTitle className="text-base">服药提醒</CardTitle>
              <Button variant="outline" size="sm" className="text-xs h-8" disabled><PlusCircle className="mr-1 h-3 w-3" /> 新增</Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {medReminders.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-18rem)] sm:h-[calc(100vh-20rem)] pr-2">
                  <div className="space-y-2.5">
                    {medReminders.map(rem => renderReminderCard(rem, 'medication'))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4 text-sm">暂无服药提醒。</p>
              )}
              <p className="text-xs text-muted-foreground mt-3 text-center">提醒功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkup">
          <Card className="shadow-sm">
            <CardHeader className="p-4 flex justify-between items-center">
                <CardTitle className="text-base">检查提醒</CardTitle>
                 <Button variant="outline" size="sm" className="text-xs h-8" disabled><PlusCircle className="mr-1 h-3 w-3" /> 新增</Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {checkupReminders.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-18rem)] sm:h-[calc(100vh-20rem)] pr-2">
                  <div className="space-y-2.5">
                    {checkupReminders.map(rem => renderReminderCard(rem, 'checkup'))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-4 text-sm">暂无检查提醒。</p>
              )}
              <p className="text-xs text-muted-foreground mt-3 text-center">检查提醒功能正在完善。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
