
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { AppointmentScheduler } from "@/components/doctor/appointments/AppointmentScheduler";

export default function DoctorAppointmentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <CalendarDays className="mr-3 h-7 w-7 text-primary" />
            预约安排
          </CardTitle>
          <CardDescription>
            管理您的预约日历，查看、安排和修改患者的预约。
          </CardDescription>
        </CardHeader>
      </Card>
      <AppointmentScheduler />
    </div>
  );
}
