import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/reports/FileUpload";
import { ReportList } from "@/components/reports/ReportList";
import { DataAnalysisGenerator } from "@/components/reports/DataAnalysisGenerator";
import { FileText, UploadCloud, BarChart2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileText className="mr-3 h-7 w-7 text-primary" />
            健康报告中心
          </CardTitle>
          <CardDescription>
            上传、查看您的检查报告，并生成AI数据分析报告。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="viewUpload" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="viewUpload">
            <UploadCloud className="mr-2 h-4 w-4" /> 上传与查看报告
          </TabsTrigger>
          <TabsTrigger value="aiAnalysis">
            <BarChart2 className="mr-2 h-4 w-4" /> AI数据分析报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewUpload">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>上传检查报告</CardTitle>
                <CardDescription>支持图片或PDF文件，如X光、CT、血液检查等。</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload />
              </CardContent>
            </Card>
            <Card className="md:row-span-2">
              <CardHeader>
                <CardTitle>已上传报告列表</CardTitle>
                <CardDescription>随时查看您已上传的检查报告。</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aiAnalysis">
          <Card>
            <CardHeader>
              <CardTitle>生成数据分析报告</CardTitle>
              <CardDescription>基于您的健康数据，自动生成包含洞察和建议的分析报告。</CardDescription>
            </CardHeader>
            <CardContent>
              <DataAnalysisGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
