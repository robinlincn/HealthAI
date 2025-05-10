
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDataAnalysisReport, type GenerateDataAnalysisReportInput, type GenerateDataAnalysisReportOutput } from "@/ai/flows/generate-data-analysis-report";
import { useState } from "react";
import { Loader2, FileDown } from "lucide-react";

const reportGeneratorSchema = z.object({
  healthData: z.string().min(10, "健康数据至少需要10个字符。").describe("例如：血糖: 餐前 5.5 mmol/L, 餐后 7.8 mmol/L; 血压: 130/85 mmHg; 体重: 70kg"),
  reportType: z.string().optional().describe("例如：周报, 月报, 或自定义范围"),
  userPreferences: z.string().optional().describe("例如：关注血糖波动, 需要图表"),
});

type ReportGeneratorFormValues = z.infer<typeof reportGeneratorSchema>;

export function DataAnalysisGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [reportOutput, setReportOutput] = useState<GenerateDataAnalysisReportOutput | null>(null);

  const form = useForm<ReportGeneratorFormValues>({
    resolver: zodResolver(reportGeneratorSchema),
    defaultValues: {
      healthData: "血糖记录：2023-11-01 餐前 6.0, 餐后 8.5; 2023-11-02 餐前 5.8, 餐后 8.0。\n血压记录：2023-11-01 135/88 mmHg。\n体重：72kg。",
      reportType: "周报",
      userPreferences: "请重点分析血糖控制情况，并给出饮食建议。",
    },
  });

  async function onSubmit(data: ReportGeneratorFormValues) {
    setIsLoading(true);
    setReportOutput(null);
    try {
      const result = await generateDataAnalysisReport(data as GenerateDataAnalysisReportInput);
      setReportOutput(result);
      toast({
        title: "报告生成成功",
        description: "AI数据分析报告已成功生成。",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "报告生成失败",
        description: "生成AI数据分析报告时发生错误，请稍后再试。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="healthData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>健康数据</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="请输入您的健康数据，如血糖、血压、体重等指标和记录时间。"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  数据越详细，分析结果越准确。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>报告类型 (可选)</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：周报, 月报" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户偏好 (可选)</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：关注特定指标，图表展示" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "生成中..." : "生成分析报告"}
          </Button>
        </form>
      </Form>

      {reportOutput && (
        <Card className="mt-8 shadow-md"> {/* Changed shadow-lg to shadow-md */}
          <CardHeader>
            <CardTitle className="text-xl">{reportOutput.reportTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">报告摘要</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reportOutput.reportSummary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">详细分析</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reportOutput.reportDetails}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">个性化建议</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reportOutput.recommendations}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => alert("导出功能暂未实现")} >
              <FileDown className="mr-2 h-4 w-4" /> 导出报告 (PDF)
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

