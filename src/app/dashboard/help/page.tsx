
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, BookUser, Phone } from "lucide-react";

const faqItems = [
  {
    value: "item-1",
    question: "如何记录我的血糖数据？",
    answer: "在“健康数据”页面，选择“手动记录数据”标签页，找到血糖记录卡片，输入您的血糖值、测量时间以及相关备注（如餐前/餐后），然后点击“保存血糖记录”即可。未来将支持蓝牙血糖仪自动同步。",
  },
  {
    value: "item-2",
    question: "忘记服药怎么办？",
    answer: "如果您忘记服药，请尽快补服（除非接近下次服药时间或医生有特殊指示）。您可以在“健康提醒”页面记录服药情况。如有疑问，请及时咨询您的医生。",
  },
  {
    value: "item-3",
    question: "如何上传我的检查报告？",
    answer: "请前往“健康报告”页面，在“上传检查报告”卡片中选择您的报告文件（图片或PDF格式），然后点击“上传文件”按钮。上传成功后，您可以在“已上传报告列表”中查看。",
  },
  {
    value: "item-4",
    question: "AI小助手能做什么？",
    answer: "AI小助手可以回答您关于健康管理的常见问题，根据您的数据提供初步的健康建议，并帮助您更好地理解您的健康状况。对于复杂或紧急情况，AI小助手会建议您咨询医生。",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-center"><MessageSquareQuote className="mr-2 h-4 w-4 text-muted-foreground"/>常见问题 (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem value={item.value} key={item.value}>
                <AccordionTrigger className="text-left hover:text-primary text-sm py-3">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-xs pb-3">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="space-y-4">
          <Card className="shadow-sm">
          <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center"><BookUser className="mr-2 h-4 w-4 text-muted-foreground"/>使用指南</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2.5">
              <p className="text-xs text-muted-foreground">详细的图文使用指南和视频教程正在制作中，将帮助您快速上手各个功能模块。</p>
              <Button variant="outline" size="sm" className="w-full text-xs h-8" disabled>查看图文指南 (建设中)</Button>
              <Button variant="outline" size="sm" className="w-full text-xs h-8" disabled>观看视频教程 (建设中)</Button>
          </CardContent>
          </Card>

          <Card className="shadow-sm">
          <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>联系客服</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
              <p className="text-xs text-muted-foreground">如果您遇到任何问题或有功能建议，欢迎通过以下方式联系我们：</p>
              <p className="text-xs"><strong>电子邮件:</strong> support@example.com</p>
              <p className="text-xs"><strong>服务热线:</strong> 400-123-4567</p>
              <Button variant="default" size="sm" className="w-full text-xs h-8" disabled>在线客服 (建设中)</Button>
          </CardContent>
          </Card>
      </div>
    </div>
  );
}
