
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function MyAddressesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            我的地址
          </CardTitle>
          <CardDescription className="text-xs">
            管理您的收货地址。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <MapPin className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
          <p className="text-xs text-foreground/50 max-w-xs mx-auto">
            您将在此处添加、编辑或删除您的常用收货地址。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
