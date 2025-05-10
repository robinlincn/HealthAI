
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCog, UserPlus, Edit2, Trash2, Shield, KeyRound } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data
const mockUsers = [
  { id: "user001", name: "王医生", role: "医生", email: "wang.doc@example.com", lastLogin: "2024-05-15 10:00" },
  { id: "user002", name: "李护士", role: "护士", email: "li.nurse@example.com", lastLogin: "2024-05-15 09:30" },
  { id: "user003", name: "系统管理员", role: "管理员", email: "admin@example.com", lastLogin: "2024-05-14 17:00" },
];

const mockRoles = [
    { id: "role_doc", name: "医生", permissions: ["查看病人", "编辑病历", "开具处方", "回复咨询"] },
    { id: "role_nurse", name: "护士", permissions: ["查看病人", "记录生命体征", "执行医嘱"] },
    { id: "role_admin", name: "管理员", permissions: ["管理用户", "系统设置", "数据备份"] },
];

export default function DoctorSettingsUsersPage() {
  const { toast } = useToast();
  // Add states for forms if needed

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCog className="mr-3 h-7 w-7 text-primary" />
            用户与权限管理
          </CardTitle>
          <CardDescription>
            管理医生、护士等系统用户账号，设置角色并分配相应操作权限。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">用户账号管理</CardTitle>
            <Button size="sm"><UserPlus className="mr-2 h-4 w-4" /> 添加新用户</Button>
          </CardHeader>
          <CardContent>
            <Input placeholder="搜索用户姓名或邮箱..." className="mb-4" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit2 className="h-4 w-4" /></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>编辑用户</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><KeyRound className="h-4 w-4" /></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>重置密码</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                          </TooltipTrigger>
                          <TooltipContent><p>删除用户</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground text-center mt-4">用户编辑、密码重置等功能正在建设中。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">角色与权限</CardTitle>
            <Button size="sm" variant="outline"><Shield className="mr-2 h-4 w-4" /> 新建角色</Button>
          </CardHeader>
          <CardContent className="space-y-4">
             <Input placeholder="搜索角色名称..." className="mb-4" />
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {mockRoles.map(role => (
                    <Card key={role.id} className="shadow-sm">
                        <CardHeader className="flex flex-row justify-between items-center p-3">
                            <CardTitle className="text-base">{role.name}</CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 px-2 py-1">
                                <Edit2 className="mr-1 h-3 w-3"/>编辑权限
                            </Button>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <p className="text-xs text-muted-foreground">权限: {role.permissions.join(', ')}</p>
                        </CardContent>
                    </Card>
                ))}
             </div>
            <p className="text-xs text-muted-foreground text-center mt-4">角色权限自定义分配功能正在建设中。</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
