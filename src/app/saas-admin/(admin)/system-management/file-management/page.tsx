
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { FolderKanban, PlusCircle, Search, Filter, Edit, Trash2, Image as ImageIcon, FileText, Music, Video, MoreHorizontal, Eye, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { SaasManagedFile, SaasFileCategory, SaasEnterprise } from '@/lib/types';
// Assume Dialog components are available for category management
// import { CategoryDialog } from './components/CategoryDialog'; // If needed for category management

const mockInitialFiles: SaasManagedFile[] = [
  { id: 'file-001', name: '病人X光片_2024.jpg', type: 'image', mimeType: 'image/jpeg', sizeKB: 1200, url: '#', uploadDate: new Date(2024, 4, 10).toISOString(), category: '医疗影像', enterpriseId: 'ent-001', uploaderUserId: 'doc-001' },
  { id: 'file-002', name: '健康宣教手册_v3.pdf', type: 'pdf', mimeType: 'application/pdf', sizeKB: 2500, url: '#', uploadDate: new Date(2024, 3, 15).toISOString(), category: '教育材料' },
  { id: 'file-003', name: '心脏听诊音.mp3', type: 'audio', mimeType: 'audio/mpeg', sizeKB: 550, url: '#', uploadDate: new Date(2024, 4, 1).toISOString(), category: '临床录音', enterpriseId: 'ent-002' },
  { id: 'file-004', name: '康复指导视频.mp4', type: 'video', mimeType: 'video/mp4', sizeKB: 15000, url: '#', uploadDate: new Date(2024, 2, 20).toISOString(), category: '康复视频' },
  { id: 'file-005', name: '合同扫描件.pdf', type: 'pdf', mimeType: 'application/pdf', sizeKB: 800, url: '#', uploadDate: new Date(2024, 1, 5).toISOString(), category: '合同文档', enterpriseId: 'ent-001' },
];

const mockFileCategories: SaasFileCategory[] = [
    { id: 'cat-med-img', name: '医疗影像', creationDate: new Date().toISOString() },
    { id: 'cat-edu', name: '教育材料', creationDate: new Date().toISOString() },
    { id: 'cat-audio', name: '临床录音', creationDate: new Date().toISOString() },
    { id: 'cat-video', name: '康复视频', creationDate: new Date().toISOString() },
    { id: 'cat-docs', name: '合同文档', creationDate: new Date().toISOString() },
    { id: 'cat-other', name: '其他杂项', creationDate: new Date().toISOString() },
];

// Mock enterprises for filtering
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

export default function FileManagementPage() {
  const [files, setFiles] = useState<SaasManagedFile[]>([]);
  const [categories, setCategories] = useState<SaasFileCategory[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | SaasManagedFile['type']>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterEnterprise, setFilterEnterprise] = useState<string>('all');
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFiles(mockInitialFiles);
    setCategories(mockFileCategories);
  }, []);

  const handleUploadFile = () => {
    toast({ title: "提示", description: "文件上传功能正在开发中。" });
  };

  const handleDeleteFile = (fileId: string) => {
    if (window.confirm('确定要删除此文件吗？此操作不可撤销。')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast({ title: '删除成功', description: '文件已删除。' });
    }
  };

  const handleEditFile = (file: SaasManagedFile) => {
    toast({ title: "提示", description: `编辑文件 "${file.name}" 的功能正在开发中。` });
  };
  
  const getFileIcon = (type: SaasManagedFile['type']) => {
    switch(type) {
        case 'image': return <ImageIcon className="h-4 w-4 text-blue-500" />;
        case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
        case 'doc': return <FileText className="h-4 w-4 text-sky-500" />;
        case 'audio': return <Music className="h-4 w-4 text-purple-500" />;
        case 'video': return <Video className="h-4 w-4 text-orange-500" />;
        default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEnterpriseName = (enterpriseId?: string) => {
    if (!enterpriseId) return '平台共享';
    return mockEnterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };

  const filteredFiles = useMemo(() => {
    return files.filter(file => 
      (file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterType === 'all' || file.type === filterType) &&
      (filterCategory === 'all' || file.category === filterCategory) &&
      (filterEnterprise === 'all' || file.enterpriseId === filterEnterprise || (filterEnterprise === 'platform' && !file.enterpriseId))
    );
  }, [files, searchTerm, filterType, filterCategory, filterEnterprise]);

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载文件管理数据...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FolderKanban className="h-6 w-6 text-primary" />
            文件管理
          </CardTitle>
          <CardDescription>
            统一管理系统中上传的各类文件资源，如图片、文档、音视频等，并进行分类。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border rounded-md">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索文件名或描述..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | SaasManagedFile['type'])}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" /> 类型
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  <SelectItem value="image">图片</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">文档</SelectItem>
                  <SelectItem value="audio">音频</SelectItem>
                  <SelectItem value="video">视频</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" /> 分类
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" /> 所属企业
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有企业</SelectItem>
                  <SelectItem value="platform">平台共享</SelectItem>
                  {mockEnterprises.map(ent => (
                    <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUploadFile} className="w-full md:w-auto" disabled> {/* Upload functionality not implemented */}
              <PlusCircle className="mr-2 h-4 w-4" /> 上传文件
            </Button>
          </div>

          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">类型</TableHead>
                  <TableHead>文件名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>上传日期</TableHead>
                  <TableHead>所属企业</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{getFileIcon(file.type)}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate" title={file.name}>{file.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{file.category || '未分类'}</Badge></TableCell>
                    <TableCell>{(file.sizeKB / 1024).toFixed(2)} MB</TableCell>
                    <TableCell>{format(parseISO(file.uploadDate), 'yyyy-MM-dd')}</TableCell>
                    <TableCell className="text-xs">{getEnterpriseName(file.enterpriseId)}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">操作</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({title: "查看", description: "文件查看功能开发中"})}>
                            <Eye className="mr-2 h-4 w-4" /> 查看
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast({title: "下载", description: "文件下载功能开发中"})}>
                            <Download className="mr-2 h-4 w-4" /> 下载
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditFile(file)}>
                            <Edit className="mr-2 h-4 w-4" /> 编辑信息
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(file.id)} className="text-destructive hover:!text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> 删除文件
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredFiles.length === 0 && <TableCaption>未找到匹配的文件。</TableCaption>}
              {filteredFiles.length > 10 && <TableCaption>共 {filteredFiles.length} 个文件。</TableCaption>}
            </Table>
          </div>
          {/* Add Category Management Dialog/Section if needed */}
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle className="text-lg">文件分类管理 (占位)</CardTitle>
            <CardDescription>管理文件的分类标签，便于组织和查找。</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mt-2 p-6 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[150px] flex flex-col justify-center items-center">
                <Filter className="h-12 w-12 mx-auto text-primary/20 mb-3" /> {/* Changed ListFilter to Filter to match import */}
                <p className="text-md font-semibold text-muted-foreground">分类管理功能正在建设中</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                将支持添加、编辑、删除文件分类标签。
                </p>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}


    