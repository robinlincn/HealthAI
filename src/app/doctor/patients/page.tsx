
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Search, Filter, FileUp, FileDown, Eye, BriefcaseMedical, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock patient data
const mockPatients = [
  { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01" },
  { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "冠心病", lastVisit: "2024-05-10" },
  { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", lastVisit: "2024-04-22" },
  { id: "pat004", name: "赵六", age: 71, gender: "男", diagnosis: "慢性阻塞性肺疾病", lastVisit: "2024-05-15" },
  { id: "pat005", name: "孙七", age: 58, gender: "女", diagnosis: "骨质疏松", lastVisit: "2024-03-30" },
  { id: "pat006", name: "周八", age: 33, gender: "女", diagnosis: "哮喘", lastVisit: "2024-05-18" },
  { id: "pat007", name: "吴九", age: 67, gender: "男", diagnosis: "痛风", lastVisit: "2024-05-05" },
];

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDisease, setFilterDisease] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  const filteredPatients = mockPatients.filter(patient => {
    const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const diseaseMatch = filterDisease === "all" || patient.diagnosis.toLowerCase().includes(filterDisease.toLowerCase());
    // Basic age filter example
    const ageMatch = filterAge === "all" || 
                     (filterAge === "under50" && patient.age < 50) ||
                     (filterAge === "50to70" && patient.age >= 50 && patient.age <= 70) ||
                     (filterAge === "over70" && patient.age > 70);
    return nameMatch && diseaseMatch && ageMatch;
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            病人管理
          </CardTitle>
          <CardDescription>
            查看、搜索、筛选和管理您的患者列表、病历及治疗进展。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="按姓名、病历号搜索病人..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Select value={filterDisease} onValueChange={setFilterDisease}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                <Select value={filterAge} onValueChange={setFilterAge}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                     <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="筛选年龄范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有年龄</SelectItem>
                    <SelectItem value="under50">&lt; 50岁</SelectItem>
                    <SelectItem value="50to70">50-70岁</SelectItem>
                    <SelectItem value="over70">&gt; 70岁</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  <FileUp className="mr-2 h-4 w-4" /> 批量导入
                </Button>
                <Button variant="outline" disabled>
                  <FileDown className="mr-2 h-4 w-4" /> 批量导出
                </Button>
              </div>
              <Button disabled>
                <UserPlus className="mr-2 h-4 w-4" /> 添加新病人
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPatients.map((patient, index) => (
            <Card key={patient.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-xl overflow-hidden">
              <CardHeader className="items-center text-center p-4 bg-muted/30">
                <Avatar className="w-24 h-24 mb-3 border-2 border-primary/20 shadow-sm">
                  <AvatarImage src={`https://picsum.photos/seed/${patient.id}/120/120`} alt={patient.name} data-ai-hint="patient avatar" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-semibold">{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <CardDescription>{patient.age}岁 / {patient.gender}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 p-4 text-sm">
                <div className="flex items-start">
                  <BriefcaseMedical className="mr-2 h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground"><strong className="font-medium text-foreground/90">诊断:</strong> {patient.diagnosis}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-primary/80 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="font-medium text-foreground/90">最近就诊:</strong> {patient.lastVisit}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button asChild variant="outline" className="w-full hover:bg-primary/10 hover:text-primary">
                  <Link href={`/doctor/patients/${patient.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> 查看详情
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
                        请尝试调整您的搜索或筛选条件，或点击右上角的“添加新病人”按钮来创建新的病人档案。
                    </p>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

    