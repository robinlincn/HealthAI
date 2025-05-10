
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Search, Filter, FileUp, FileDown, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock patient data
const mockPatients = [
  { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01" },
  { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "冠心病", lastVisit: "2024-05-10" },
  { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", lastVisit: "2024-04-22" },
  { id: "pat004", name: "赵六", age: 71, gender: "男", diagnosis: "慢性阻塞性肺疾病", lastVisit: "2024-05-15" },
  { id: "pat005", name: "孙七", age: 58, gender: "女", diagnosis: "骨质疏松", lastVisit: "2024-03-30" },
];

export default function DoctorPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDisease, setFilterDisease] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  const filteredPatients = mockPatients.filter(patient => {
    const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const diseaseMatch = filterDisease === "all" || patient.diagnosis.includes(filterDisease);
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
                <Button variant="outline">
                  <FileUp className="mr-2 h-4 w-4" /> 批量导入
                </Button>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> 批量导出
                </Button>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> 添加新病人
              </Button>
            </div>
          </div>

          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>年龄</TableHead>
                  <TableHead>性别</TableHead>
                  <TableHead>主要诊断</TableHead>
                  <TableHead>最近就诊</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell className="max-w-xs truncate">{patient.diagnosis}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/doctor/patients/${patient.id}`}>
                          <Eye className="mr-1 h-4 w-4" /> 查看详情
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="mt-8 flex flex-col items-center text-center">
              <Users className="w-24 h-24 text-primary/30 mb-4" />
              <h3 className="text-xl font-semibold text-foreground/70">未找到匹配的病人</h3>
              <p className="text-foreground/50 max-w-md">
                请调整搜索或筛选条件，或添加新病人。
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
