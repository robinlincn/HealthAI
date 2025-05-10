
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// Assuming a similar Genkit flow or a different one for doctor-side reports
// import { generateDoctorDataAnalysisReport, type GenerateDoctorDataAnalysisReportInput, type GenerateDoctorDataAnalysisReportOutput } from "@/ai/flows/generate-doctor-data-analysis-report";


export default function DoctorAnalyticsReportsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [patientDataInput, setPatientDataInput] = useState("示例病人张三，ID: pat001\n近期血糖数据：...\n近期血压数据：...\n主要症状：头晕、乏力");
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!patientDataInput.trim()) {
      toast({ title: "请输入病人数据", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedReport(null);
    // Mock AI report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockReport = `
病情分析报告 - 病人：张三 (pat001)
==================================

数据统计:
-----------
- 平均血糖（近7天）: 7.8 mmol/L (空腹), 10.2 mmol/L (餐后)
- 最高血糖（近7天）: 12.5 mmol/L
- 血压（平均）: 135/88 mmHg

趋势分析:
-----------
- 血糖水平整体偏高，尤其餐后血糖控制不佳，波动较大。
- 血压接近高血压I级诊断标准，需密切关注。

异常数据标记:
-------------
- 2024-05-03 餐后血糖达12.5 mmol/L，显著高于目标范围。
- 2024-05-05 晨起血压 145/92 mmHg，需警惕。

初步建议:
---------
1. 建议调整当前降糖药物方案，考虑增加xxx药物或调整剂量。
2. 强化饮食控制教育，特别是餐后血糖管理。
3. 建议病人增加血压监测频率，记录并复诊。
4. 考虑进行动态血糖监测以全面评估血糖波动情况。

**免责声明: 此报告由AI生成，仅供参考，具体诊疗请结合临床实际情况。**
    `;
    setGeneratedReport(mockReport);
    setIsLoading(false);
    toast({ title: "AI病情分析报告已生成 (模拟)" });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileSpreadsheet className="mr-3 h-7 w-7 text-primary" />
            AI辅助病情分析报告
          </CardTitle>
          <CardDescription>
            根据病人的健康数据自动生成详细的病情分析报告，包括数据统计、趋势分析和异常数据标记。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>生成病人分析报告</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="patientData" className="block text-sm font-medium mb-1">输入病人相关数据</label>
            <Textarea
              id="patientData"
              placeholder="粘贴或输入病人的健康数据、病历摘要、主诉等信息..."
              className="min-h-[150px]"
              value={patientDataInput}
              onChange={(e) => setPatientDataInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">提供的数据越全面，AI分析越精准。</p>
          </div>
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "报告生成中..." : "生成分析报告"}
          </Button>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>生成的分析报告</CardTitle>
            <Button variant="outline" onClick={() => alert("导出功能暂未实现")}>
              <Download className="mr-2 h-4 w-4" /> 导出报告 (PDF/Word)
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/30 whitespace-pre-wrap text-sm">
              {generatedReport}
            </div>
          </CardContent>
        </Card>
      )}
       {!generatedReport && !isLoading && (
         <div className="mt-8 flex flex-col items-center text-center text-muted-foreground">
            <FileSpreadsheet className="w-16 h-16 text-primary/30 mb-4" />
            <p>输入病人数据后，点击上方按钮生成AI病情分析报告。</p>
          </div>
       )}
    </div>
  );
}
