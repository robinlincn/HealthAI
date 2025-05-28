
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function MyFavoritesPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            我的收藏
          </CardTitle>
          <CardDescription className="text-xs">
            查看您收藏的商品或健康课程。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-foreground/70">功能建设中</h3>
          <p className="text-xs text-foreground/50 max-w-xs mx-auto">
            您将在此处查看和管理您收藏的商品、课程或其他内容。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
