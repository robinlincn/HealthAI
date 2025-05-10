
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, BarChart3, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock patient data (same as in /doctor/patients/page.tsx for consistency)
const mockPatients = [
  { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01" },
  { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "冠心病", lastVisit: "2024-05-10" },
  { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", lastVisit: "2024-04-22" },
  { id: "pat004", name: "赵六", age: 71, gender: "男", diagnosis: "慢性阻塞性肺疾病", lastVisit: "2024-05-15" },
  { id: "pat005", name: "孙七", age: 58, gender: "女", diagnosis: "骨质疏松", lastVisit: "2024-03-30" },
  { id: "pat006", name: "周八", age: 33, gender: "女", diagnosis: "哮喘", lastVisit: "2024-05-18" },
  { id: "pat007", name: "吴九", age: 67, gender: "男", diagnosis: "痛风", lastVisit: "2024-05-05" },
];

export default function DoctorAnalyticsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDisease, setFilterDisease] = useState("all");

  const filteredPatients = mockPatients.filter(patient => {
    const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const diseaseMatch = filterDisease === "all" || patient.diagnosis.toLowerCase().includes(filterDisease.toLowerCase());
    return nameMatch && diseaseMatch;
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-primary" />
            病情分析 - 选择病人
          </CardTitle>
          <CardDescription>
            请从下方列表中选择病人以进行健康数据可视化和AI辅助病情分析。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="按姓名搜索病人..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterDisease} onValueChange={setFilterDisease}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="筛选疾病类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有疾病</SelectItem>
                  <SelectItem value="高血压">高血压</SelectItem>
                  <SelectItem value="2型糖尿病">2型糖尿病</SelectItem>
                  <SelectItem value="冠心病">冠心病</SelectItem>
                  <SelectItem value="高血脂">高血脂</SelectItem>
                  <SelectItem value="哮喘">哮喘</SelectItem>
                  <SelectItem value="痛风">痛风</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-xl overflow-hidden">
              <CardHeader className="items-center text-center p-4 bg-muted/30">
                <Avatar className="w-20 h-20 mb-2 border-2 border-primary/20 shadow-sm">
                  <AvatarImage src={`https://picsum.photos/seed/${patient.id}/100/100`} alt={patient.name} data-ai-hint="patient avatar" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{patient.name}</CardTitle>
                <CardDescription className="text-xs">{patient.age}岁 / {patient.gender}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-3 text-xs">
                <p className="text-muted-foreground line-clamp-2"><strong className="font-medium text-foreground/90">诊断:</strong> {patient.diagnosis}</p>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <Button asChild variant="outline" className="w-full text-sm hover:bg-primary/10 hover:text-primary">
                  <Link href={`/doctor/analytics/detail/${patient.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> 分析病情
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="py-16">
                <div className="flex flex-col items-center text-center">
                    <Users className="w-24 h-24 text-primary/20 mb-6" />
                    <h3 className="text-2xl font-semibold text-foreground/80 mb-2">未找到匹配的病人</h3>
                    <p className="text-muted-foreground max-w-md">
                        请尝试调整您的搜索或筛选条件。
                    </p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
