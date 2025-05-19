
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, ListChecks, Edit3, History } from "lucide-react";

export default function MedicationPlanPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-sm h-10">
          <TabsTrigger value="plan" className="py-2 px-1">
            <ListChecks className="mr-1 h-4 w-4" /> 用药计划
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="py-2 px-1">
            <Edit3 className="mr-1 h-4 w-4" /> 用药调整
          </TabsTrigger>
          <TabsTrigger value="records" className="py-2 px-1">
            <History className="mr-1 h-4 w-4" /> 用药记录
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-primary" />
                当前用药计划
              </CardTitle>
              <CardDescription className="text-xs">
                查看医生为您制定的当前药物治疗方案。
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 text-center">
              <Pill className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
              <p className="text-xs text-foreground/50 max-w-xs mx-auto">
                详细的用药计划（包括药物名称、剂量、用法、频次、注意事项）将在此处展示。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <Edit3 className="mr-2 h-5 w-5 text-primary" />
                用药调整历史
              </CardTitle>
              <CardDescription className="text-xs">
                查看您的用药方案历次调整记录。
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 text-center">
              <Pill className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
              <p className="text-xs text-foreground/50 max-w-xs mx-auto">
                您的用药调整历史将在此处清晰列出，包括调整日期、原因和具体内容。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" />
                用药记录
              </CardTitle>
              <CardDescription className="text-xs">
                记录和查看您的每日用药情况。
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 text-center">
              <Pill className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
              <p className="text-xs text-foreground/50 max-w-xs mx-auto">
                您可以在此手动记录每日用药情况，或查看通过提醒功能自动记录的数据。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
