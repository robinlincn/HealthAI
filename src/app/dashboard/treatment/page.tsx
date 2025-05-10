
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function TreatmentPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-base">治疗方案概览</CardTitle>
          <CardDescription className="text-xs">
            查看医生为您制定的药物、治疗计划及调整记录。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <ClipboardList className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
          <p className="text-xs text-foreground/50 max-w-xs mx-auto">
            详细的药物管理、治疗计划和调整记录功能将在此处提供。请等待医生为您制定方案。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
