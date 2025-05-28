
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export default function DistributionManagementPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Share2 className="h-6 w-6 text-primary" />
            销售分销管理
          </CardTitle>
          <CardDescription>
            将企业销售的商品分配给员工或医生进行分销，并设置提成比例。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">销售分销管理功能正在开发中</p>
            <p className="text-sm text-muted-foreground mt-1">
              此模块将允许您选择企业、商品和员工/医生，设置分销规则和提成。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
