
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, getTotalItems, getCartTotal } = useCartStore();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const quantity = Math.max(0, newQuantity); // Ensure quantity doesn't go below 0
    if (quantity === 0) {
      // Optionally confirm before removing, or just remove
      removeItem(productId);
    } else {
      updateItemQuantity(productId, quantity);
    }
  };

  if (!isClient) {
    return (
      <div className="p-4 space-y-4">
        <Card><CardHeader><CardTitle>购物车加载中...</CardTitle></CardHeader>
        <CardContent><p className="text-center p-8 text-muted-foreground">请稍候...</p></CardContent></Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-4 text-center flex flex-col items-center justify-center h-full">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">您的购物车是空的</h2>
        <p className="text-muted-foreground mb-6">快去商城挑选您需要的健康商品吧！</p>
        <Button asChild>
          <Link href="/dashboard/mall">去逛逛</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-0"> {/* Remove padding from ScrollArea, apply to inner div */}
        <div className="space-y-3 p-4"> {/* Add padding to this inner div */}
          {items.map((item) => (
            <Card key={item.id} className="flex p-3 gap-3 shadow-sm">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                <Image 
                  src={item.image || "https://placehold.co/100x100.png?text=商品"} 
                  alt={item.name} 
                  fill
                  sizes="(max-width: 640px) 80px, 96px"
                  className="object-cover"
                  data-ai-hint={item.dataAiHint || "product image"}
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                  <p className="text-primary font-semibold text-sm mt-0.5">¥{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                      <Minus className="h-3.5 w-3.5"/>
                    </Button>
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="h-7 w-10 text-center border-l border-r rounded-none p-0 text-sm"
                      min="0"
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                      <Plus className="h-3.5 w-3.5"/>
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4 bg-card">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-muted-foreground">共 {getTotalItems()} 件商品</p>
          <p className="text-lg font-semibold">总计: <span className="text-primary">¥{getCartTotal().toFixed(2)}</span></p>
        </div>
        <Button className="w-full h-11 text-base" onClick={() => toast({title: "提示", description: "结算功能正在开发中，将跳转到结算页面占位符。"})}>
           <Link href="/dashboard/mall/checkout" className="flex items-center justify-center w-full">
             去结算 <ArrowRight className="ml-2 h-4 w-4"/>
           </Link>
        </Button>
      </div>
    </div>
  );
}

    