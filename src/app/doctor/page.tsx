
"use client";

import { WelcomeBannerDoctor } from "@/components/doctor/WelcomeBannerDoctor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarClock, MailWarning, Users, Megaphone, AlertTriangle, Eye } from "lucide-react"; // Added AlertTriangle, Eye
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format, subDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";

interface PatientAlert {
  id: string;
  patientId: string;
  patientName: string;
  alertType: '血糖异常' | '血压过高' | '体重急剧变化' | '药物未按时服用';
  message: string;
  timestamp: string; // ISO date string
  riskLevel: '高' | '中' | '低';
}

// Mock data for patient alerts
const generateMockPatientAlerts = (): PatientAlert[] => [
  { id: 'alert1', patientId: 'pat001', patientName: '张三', alertType: '血糖异常', message: '连续三天餐后血糖 > 11.1 mmol/L', timestamp: new Date().toISOString(), riskLevel: '高' },
  { id: 'alert2', patientId: 'pat002', patientName: '李四', alertType: '血压过高', message: '多次测量收缩压 > 160 mmHg', timestamp: subDays(new Date(), 1).toISOString(), riskLevel: '中' },
  { id: 'alert3', patientId: 'pat003', patientName: '王五', alertType: '体重急剧变化', message: '一周内体重下降超过 2kg', timestamp: subDays(new Date(), 2).toISOString(), riskLevel: '高' },
  { id: 'alert4', patientId: 'pat004', patientName: '赵六', alertType: '药物未按时服用', message: '连续两天未记录降压药服用', timestamp: subDays(new Date(), 1).toISOString(), riskLevel: '中' },
];


export default function DoctorDashboardPage() {
  const [patientAlerts, setPatientAlerts] = useState<PatientAlert[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPatientAlerts(generateMockPatientAlerts());
  }, []);

  const stats = [
    { title: "今日预约", value: "12", icon: CalendarClock, href: "/doctor/appointments", description: "待处理 3"},
    { title: "待处理消息", value: "5", icon: MailWarning, href: "/doctor/consultations", description: "新消息 2"},
    { title: "活跃患者", value: "150", icon: Users, href: "/doctor/patients", description: "本周新增 5" },
    { title: "系统公告", value: "2", icon: Megaphone, href: "/doctor/messages", description: "重要通知"},
  ];

  const getRiskBadgeVariant = (riskLevel: PatientAlert['riskLevel']) => {
    if (riskLevel === '高') return 'destructive';
    if (riskLevel === '中') return 'default'; // Using default for medium, can be 'secondary' or other
    return 'secondary'; // Using secondary for low
  };


  return (
    <div className="space-y-6">
      <WelcomeBannerDoctor />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
              <Link href={stat.href} className="text-sm text-primary hover:underline mt-2 block">
                查看详情 &rarr;
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Alerts Module */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
            病人健康预警
          </CardTitle>
          <CardDescription>关注近期健康数据异常的病人，请及时处理。</CardDescription>
        </CardHeader>
        <CardContent>
          {patientAlerts.length > 0 ? (
            <ScrollArea className="h-[200px] pr-3">
              <ul className="space-y-3">
                {patientAlerts.map(alert => (
                  <li key={alert.id} className="p-3 border rounded-md bg-destructive/5 hover:bg-destructive/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/doctor/patients/${alert.patientId}`} className="text-destructive font-semibold hover:underline">
                          {alert.patientName}
                        </Link>
                        <span className="text-xs text-destructive/80 ml-2">({alert.alertType})</span>
                      </div>
                      <Badge variant={getRiskBadgeVariant(alert.riskLevel)} className="text-xs">{alert.riskLevel}风险</Badge>
                    </div>
                    <p className="text-sm text-destructive/90 mt-1">{alert.message}</p>
                    {isClient && <p className="text-xs text-muted-foreground mt-0.5">时间: {format(parseISO(alert.timestamp), "yyyy-MM-dd HH:mm")}</p>}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground text-center py-4">暂无健康预警信息。</p>
          )}
          {patientAlerts.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => alert("跳转到预警病人列表 (功能开发中)")}>
                 <Eye className="mr-2 h-4 w-4" /> 查看所有预警
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>近期活动日志</CardTitle>
          <CardDescription>最近的患者互动和系统操作记录。</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>[10:35 AM] 更新了患者 王五 的治疗方案。</li>
            <li>[09:17 AM] 完成了与患者 李四 的线上咨询。</li>
            <li>[昨日 04:30 PM] 添加了新患者 赵六。</li>
            <li>[昨日 02:15 PM] 查看了患者 孙七 的最新报告。</li>
          </ul>
           <Link href="#" className="text-sm text-primary hover:underline mt-4 inline-block" aria-disabled="true" onClick={(e) => e.preventDefault()}>
            查看所有活动 &rarr; (建设中)
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
