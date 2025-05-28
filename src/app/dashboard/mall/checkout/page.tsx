
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreditCard, Banknote, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ShippingAddress {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  addressLine1: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: '示例用户',
    phone: '13800138000',
    province: '示例省',
    city: '示例市',
    addressLine1: '健康路123号 AI健康公寓 501室',
    postalCode: '100000',
  });
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'cod'>('wechat');

  useEffect(() => {
    setIsClient(true);
    if (items.length === 0) {
      // Redirect to cart or mall if cart is empty, after client-side check
      // router.replace('/dashboard/mall');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async () => {
    setIsLoading(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockOrderId = `MOCK_ORD_${Date.now()}`;
    toast({
      title: "订单提交成功 (模拟)",
      description: `您的订单 ${mockOrderId} 已成功提交，支付方式: ${paymentMethod === 'wechat' ? '微信支付' : (paymentMethod === 'alipay' ? '支付宝' : '货到付款')}`,
    });
    clearCart(); // Clear cart after successful order (mock)
    setIsLoading(false);
    router.push(`/dashboard/mall/order-status/${mockOrderId}`);
  };

  if (!isClient) {
    return (
      <div className="p-4 space-y-4">
        <Card><CardHeader><CardTitle>结算页面加载中...</CardTitle></CardHeader>
        <CardContent><p className="text-center p-8 text-muted-foreground">请稍候...</p></CardContent></Card>
      </div>
    );
  }
  
  if (items.length === 0 && isClient) { // Check items.length again after client is true
    return (
      <div className="p-4 text-center flex flex-col items-center justify-center h-full">
        <ShoppingBag className="w-20 h-20 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">您的购物车是空的</h2>
        <p className="text-muted-foreground mb-6">无法结算，请先添加商品到购物车。</p>
        <Button asChild>
          <Link href="/dashboard/mall">去逛逛</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-0">
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">收货地址</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label htmlFor="recipientName">收货人姓名</Label><Input id="recipientName" name="recipientName" value={shippingAddress.recipientName} onChange={handleInputChange} /></div>
              <div><Label htmlFor="phone">手机号码</Label><Input id="phone" name="phone" type="tel" value={shippingAddress.phone} onChange={handleInputChange} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="province">省份</Label><Input id="province" name="province" value={shippingAddress.province} onChange={handleInputChange} /></div>
                <div><Label htmlFor="city">城市</Label><Input id="city" name="city" value={shippingAddress.city} onChange={handleInputChange} /></div>
              </div>
              <div><Label htmlFor="addressLine1">详细地址</Label><Textarea id="addressLine1" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} rows={2} /></div>
              <div><Label htmlFor="postalCode">邮政编码</Label><Input id="postalCode" name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">支付方式</CardTitle></CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="space-y-2">
                <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value="wechat" id="wechatPay" />
                  <CreditCard className="h-5 w-5 text-green-500 mr-2"/> 微信支付
                </Label>
                <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value="alipay" id="aliPay" />
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1677FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12.4 6.2a1.4 1.4 0 0 1 2.2 1.8l-6.4 9.6a1.4 1.4 0 0 1-2.2-1.8Z"/><path d="M11 6.2a1.4 1.4 0 0 0-2.2 1.8l6.4 9.6a1.4 1.4 0 0 0 2.2-1.8Z"/><path d="M6.5 13H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h11.5c.9 0 1.5-.9.9-1.6L6.5 13Z"/><circle cx="12" cy="12" r="10"/></svg>
                   支付宝
                </Label>
                <Label className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                  <RadioGroupItem value="cod" id="codPay" />
                  <Banknote className="h-5 w-5 text-orange-500 mr-2"/> 货到付款 (模拟)
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">订单摘要</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground truncate max-w-[180px]">{item.name} x {item.quantity}</span>
                  <span>¥{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>商品总额</span>
                <span>¥{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>运费 (模拟)</span>
                <span>¥0.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <div className="border-t p-4 bg-card">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm">应付总额:</p>
          <p className="text-2xl font-bold text-primary">¥{getCartTotal().toFixed(2)}</p>
        </div>
        <Button className="w-full h-12 text-base" onClick={handleSubmitOrder} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingBag className="mr-2 h-5 w-5" />}
          {isLoading ? "处理中..." : "提交订单并支付"}
        </Button>
      </div>
    </div>
  );
}

    