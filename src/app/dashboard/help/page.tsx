
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookUser, MessageSquareQuote, Phone } from "lucide-react"; // Changed MessageSquareQuestion to MessageSquareQuote

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
  {
    value: "item-5",
    question: "我的数据安全吗？",
    answer: "我们非常重视您的数据安全和隐私。系统采用加密技术保护您的个人信息和健康数据。您的数据会自动同步到云端并进行安全备份。详细信息请查阅我们的隐私政策。",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <HelpCircle className="mr-3 h-7 w-7 text-primary" />
            帮助与支持中心
          </CardTitle>
          <CardDescription>
            查找常见问题解答、使用指南或联系我们获取帮助。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><MessageSquareQuote className="mr-2 h-5 w-5 text-muted-foreground"/>常见问题 (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem value={item.value} key={item.value}>
                  <AccordionTrigger className="text-left hover:text-primary">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><BookUser className="mr-2 h-5 w-5 text-muted-foreground"/>使用指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">详细的图文使用指南和视频教程正在制作中，将帮助您快速上手各个功能模块。</p>
                <Button variant="outline" disabled>查看图文指南 (建设中)</Button>
                <Button variant="outline" disabled>观看视频教程 (建设中)</Button>
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Phone className="mr-2 h-5 w-5 text-muted-foreground"/>联系客服</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">如果您遇到任何问题或有功能建议，欢迎通过以下方式联系我们：</p>
                <p className="text-sm"><strong>电子邮件:</strong> support@example-chronic.com (占位)</p>
                <p className="text-sm"><strong>服务热线:</strong> 400-123-4567 (占位)</p>
                <Button variant="default" disabled>在线客服 (建设中)</Button>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
