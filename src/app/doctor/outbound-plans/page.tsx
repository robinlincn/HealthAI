
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneOutgoing, User, Users, BarChartHorizontal } from "lucide-react";
import { SinglePatientOutboundTab } from "@/components/doctor/outbound-plans/SinglePatientOutboundTab";
import { OutboundGroupTab } from "@/components/doctor/outbound-plans/OutboundGroupTab";
import { OutboundStatisticsTab } from "@/components/doctor/outbound-plans/OutboundStatisticsTab";

export default function OutboundPlansPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <PhoneOutgoing className="mr-3 h-7 w-7 text-primary" />
            外呼计划管理
          </CardTitle>
          <CardDescription>
            制定和管理针对单个病人或病人组的外呼任务，并查看统计数据。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="singlePatient" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="singlePatient" className="text-xs sm:text-sm">
            <User className="mr-1 sm:mr-2 h-4 w-4" /> 单个病人外呼
          </TabsTrigger>
          <TabsTrigger value="groupManagement" className="text-xs sm:text-sm">
            <Users className="mr-1 sm:mr-2 h-4 w-4" /> 外呼组管理与任务
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs sm:text-sm">
            <BarChartHorizontal className="mr-1 sm:mr-2 h-4 w-4" /> 外呼计划统计
          </TabsTrigger>
        </TabsList>

        <TabsContent value="singlePatient">
          <SinglePatientOutboundTab />
        </TabsContent>

        <TabsContent value="groupManagement">
          <OutboundGroupTab />
        </TabsContent>

        <TabsContent value="statistics">
          <OutboundStatisticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
