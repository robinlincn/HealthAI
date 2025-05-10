
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/reports/FileUpload";
import { ReportList } from "@/components/reports/ReportList";
import { DataAnalysisGenerator } from "@/components/reports/DataAnalysisGenerator";
import { UploadCloud, BarChart2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="viewUpload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-sm h-10">
          <TabsTrigger value="viewUpload" className="py-2 px-1"><UploadCloud className="mr-1 h-4 w-4" /> 上传/查看</TabsTrigger>
          <TabsTrigger value="aiAnalysis" className="py-2 px-1"><BarChart2 className="mr-1 h-4 w-4" /> AI分析</TabsTrigger>
        </TabsList>

        <TabsContent value="viewUpload">
          <div className="space-y-4"> {/* Changed grid to space-y for mobile stacking */}
            <Card className="shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-base">上传检查报告</CardTitle>
                <CardDescription className="text-xs">支持图片或PDF文件，如X光、CT、血液检查等。</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <FileUpload />
              </CardContent>
            </Card>
            <Card className="shadow-sm"> {/* md:row-span-2 removed */}
              <CardHeader className="p-4">
                <CardTitle className="text-base">已上传报告列表</CardTitle>
                <CardDescription className="text-xs">随时查看您已上传的检查报告。</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ReportList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="aiAnalysis">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">生成数据分析报告</CardTitle>
              <CardDescription className="text-xs">基于您的健康数据，自动生成包含洞察和建议的分析报告。</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <DataAnalysisGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
