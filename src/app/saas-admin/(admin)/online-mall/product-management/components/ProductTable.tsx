
'use client';

import type { SaasProduct, SaasEnterprise } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, EyeOff, Eye, PackageSearch, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

interface ProductTableProps {
  products: SaasProduct[];
  enterprises: SaasEnterprise[];
  onEdit: (product: SaasProduct) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string) => void;
}

export function ProductTable({ products, enterprises, onEdit, onDelete, onToggleStatus }: ProductTableProps) {

  const getEnterpriseName = (enterpriseId: string) => {
    return enterprises.find(e => e.id === enterpriseId)?.name || 'N/A';
  };

  const getProductStatusBadge = (status: SaasProduct['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500 hover:bg-green-600"><Eye className="h-3 w-3 mr-1"/>已上架</Badge>;
      case 'draft': return <Badge variant="outline"><Edit className="h-3 w-3 mr-1"/>草稿</Badge>;
      case 'archived': return <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1"/>已归档</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (products.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无商品数据。请添加新商品。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">图片</TableHead>
            <TableHead>商品名称</TableHead>
            <TableHead>所属企业</TableHead>
            <TableHead>分类</TableHead>
            <TableHead>价格 (元)</TableHead>
            <TableHead>库存</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    width={50} 
                    height={50} 
                    className="rounded object-cover aspect-square"
                    data-ai-hint="product image" 
                  />
                ) : (
                  <div className="h-[50px] w-[50px] bg-muted rounded flex items-center justify-center">
                    <PackageSearch className="h-6 w-6 text-muted-foreground"/>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                <span className="inline-flex items-center text-xs">
                  <Briefcase className="h-3 w-3 mr-1 text-muted-foreground"/>
                  {getEnterpriseName(product.enterpriseId)}
                </span>
              </TableCell>
              <TableCell className="text-xs">{product.category || '-'}</TableCell>
              <TableCell>¥{product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{getProductStatusBadge(product.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" />编辑商品
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onToggleStatus(product.id)}>
                      {product.status === 'active' ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {product.status === 'active' ? '下架' : '上架'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除商品
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {products.length > 5 && (
            <TableCaption>共 {products.length} 条商品记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
