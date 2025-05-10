
"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AppointmentForm } from "./AppointmentForm";
import type { Appointment } from "@/lib/types";
import { PlusCircle, Edit, Trash2, CalendarCheck2, XCircle } from "lucide-react";
import { format, isEqual, startOfDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const initialAppointments: Appointment[] = [
  { id: "1", patientName: "张三", date: new Date(new Date().setDate(new Date().getDate() + 1)), time: "10:00", reason: "复诊", status: "scheduled" },
  { id: "2", patientName: "李四", date: new Date(new Date().setDate(new Date().getDate() + 1)), time: "11:30", reason: "初诊", status: "scheduled" },
  { id: "3", patientName: "王五", date: new Date(new Date().setDate(new Date().getDate() + 2)), time: "14:00", reason: "体检报告解读", status: "pending_confirmation" },
  { id: "4", patientName: "赵六", date: new Date(), time: "09:00", reason: "紧急就诊", status: "scheduled" },
];


export function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching appointments
    // In a real app, fetch based on selectedDate or a range
    setAppointments(initialAppointments);
  }, []);


  const appointmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(app => isEqual(startOfDay(app.date), startOfDay(selectedDate)))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAddNewAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // Add confirmation dialog here if needed
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    toast({ title: "预约已删除", description: `预约 (ID: ${appointmentId}) 已成功删除。` });
  };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'> & { id?: string, status?: Appointment['status'] }) => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(app => app.id === editingAppointment.id ? { ...editingAppointment, ...appointmentData, id: editingAppointment.id, status: appointmentData.status || editingAppointment.status } : app));
      toast({ title: "预约已更新", description: `患者 ${appointmentData.patientName} 的预约已更新。`});
    } else {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now().toString(),
        status: appointmentData.status || 'scheduled',
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast({ title: "预约已创建", description: `患者 ${appointmentData.patientName} 的新预约已创建。`});
    }
    setIsFormOpen(false);
    setEditingAppointment(null);
  };
  
  const getStatusBadgeColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'pending_confirmation': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  const getStatusText = (status: Appointment['status']) => {
    const map = {
        scheduled: '已安排',
        completed: '已完成',
        cancelled: '已取消',
        pending_confirmation: '待确认'
    }
    return map[status] || status;
  }


  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>选择日期</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => date < startOfDay(new Date(new Date().setDate(new Date().getDate()-365))) || date > new Date(new Date().setDate(new Date().getDate()+365))} // Example: disable past dates
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>
              {selectedDate ? format(selectedDate, "yyyy年MM月dd日") : "请选择日期"} 的预约
            </CardTitle>
            <CardDescription>查看和管理当天的预约安排。</CardDescription>
          </div>
          <Button onClick={handleAddNewAppointment}>
            <PlusCircle className="mr-2 h-4 w-4" /> 新建预约
          </Button>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            appointmentsForSelectedDate.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <ul className="space-y-3">
                  {appointmentsForSelectedDate.map(app => (
                    <li key={app.id} className="p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-primary">{app.time} - {app.patientName}</p>
                          <p className="text-sm text-muted-foreground">{app.reason || "无特定事由"}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex space-x-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleEditAppointment(app)}>
                          <Edit className="mr-1 h-3 w-3" /> 编辑
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(app.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> 删除
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="text-center py-10">
                <CalendarCheck2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">此日期没有预约。</p>
              </div>
            )
          ) : (
            <div className="text-center py-10">
                <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">请从左侧日历选择一个日期以查看预约。</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? "编辑预约" : "新建预约"}</DialogTitle>
            <DialogDescription>
              {editingAppointment ? "修改预约详情。" : "填写以下信息以创建新预约。"}
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            appointment={editingAppointment}
            selectedDate={selectedDate}
            onSave={handleSaveAppointment}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingAppointment(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
