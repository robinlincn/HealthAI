
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Stethoscope } from "lucide-react";

// Mock data - in a real app, this would come from user's profile and their assigned doctor
const mockUserData = {
  name: "示例用户",
  avatarUrl: "https://picsum.photos/seed/useravatar/100/100",
  dataAiHint: "user avatar",
  managingDoctor: "王医生",
};

export function WelcomeBanner() {
  return (
    <Card className="mb-6 shadow-md overflow-hidden bg-card">
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-primary/30">
          <AvatarImage src={mockUserData.avatarUrl} alt={mockUserData.name} data-ai-hint={mockUserData.dataAiHint} />
          <AvatarFallback className="text-xl">
            <UserCircle size={36}/>
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl font-semibold text-foreground">
            欢迎回来, {mockUserData.name}!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground flex items-center mt-1">
            <Stethoscope className="h-4 w-4 mr-1.5 text-primary" />
            您的主治医生: {mockUserData.managingDoctor}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

