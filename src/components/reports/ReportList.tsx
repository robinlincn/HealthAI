"use client";

import type { ExaminationReport } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Download, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const mockReports: ExaminationReport[] = [
  { id: "1", name: "胸部CT扫描.pdf", type: "pdf", url: "#", uploadDate: "2023-10-15", dataAiHint: "medical scan" },
  { id: "2", name: "血液检查报告.jpg", type: "image", url: "https://picsum.photos/seed/report1/300/200", uploadDate: "2023-11-02", dataAiHint: "lab results" },
  { id: "3", name: "X光片.png", type: "image", url: "https://picsum.photos/seed/report2/300/200", uploadDate: "2023-11-20", dataAiHint: "xray image" },
  { id: "4", name: "年度体检总结.pdf", type: "pdf", url: "#", uploadDate: "2024-01-05", dataAiHint: "health summary" },
];

export function ReportList() {
  const [reports, setReports] = useState<ExaminationReport[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setReports(mockReports);
  }, []);

  if (reports.length === 0) {
    return <p className="text-muted-foreground text-center py-8">暂无已上传的报告。</p>;
  }

  const handleDelete = (reportId: string) => {
    // Mock delete
    setReports(prev => prev.filter(report => report.id !== reportId));
    console.log(`Deleted report ${reportId} (mock)`);
  };


  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4 pr-4">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex">
              {report.type === "image" && report.url.startsWith("https://picsum.photos") && (
                <div className="w-1/3_ sm:w-1/4_ md:w-1/5 flex-shrink-0">
                   <Image 
                    src={report.url} 
                    alt={report.name} 
                    width={120} 
                    height={90} 
                    className="object-cover h-full w-full" 
                    data-ai-hint={report.dataAiHint || "medical report"}
                  />
                </div>
              )}
               {(report.type === "pdf" || !report.url.startsWith("https://picsum.photos")) && (
                <div className="w-1/3_ sm:w-1/4_ md:w-1/5 flex-shrink-0 bg-muted flex items-center justify-center p-4">
                    {report.type === "image" ? <ImageIcon className="w-10 h-10 text-muted-foreground" /> : <FileText className="w-10 h-10 text-muted-foreground" />}
                </div>
               )}
              <div className="flex-grow p-4">
                <CardTitle className="text-base mb-1 line-clamp-1">{report.name}</CardTitle>
                <CardDescription className="text-xs">
                  类型: {report.type === "image" ? "图片" : "PDF"} | 上传于: {report.uploadDate}
                </CardDescription>
                <div className="mt-3 flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => alert(`查看报告: ${report.name} (模拟)`)}>
                    <Eye className="mr-1 h-3 w-3" /> 查看
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => alert(`下载报告: ${report.name} (模拟)`)}>
                    <Download className="mr-1 h-3 w-3" /> 下载
                  </Button>
                   <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => handleDelete(report.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> 删除
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
