"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, PlusCircle, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UserAddress } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AddressFormDialog } from '@/components/profile/AddressFormDialog'; // Import the dialog component

const mockInitialAddresses: UserAddress[] = [
  { id: 'addr1', recipientName: '张三丰', phone: '13800138001', province: '北京市', city: '北京市', district: '海淀区', detailedAddress: '中关村软件园 10号楼 A座 501室', postalCode: '100085', isDefault: true },
  { id: 'addr2', recipientName: '李小龙', phone: '13912345678', province: '广东省', city: '深圳市', district: '南山区', detailedAddress: '科技园路 88号 腾讯大厦', postalCode: '518057', isDefault: false },
];

export default function MyAddressesPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setAddresses(mockInitialAddresses);
  }, []);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSaveAddress = (addressData: Omit<UserAddress, 'id'> & { id?: string }) => {
    setAddresses(prevAddresses => {
      let updatedAddresses;
      if (addressData.id) { // Editing existing address
        updatedAddresses = prevAddresses.map(addr => 
          addr.id === addressData.id ? { ...addr, ...addressData } as UserAddress : addr
        );
      } else { // Adding new address
        const newAddress: UserAddress = {
          ...addressData,
          id: `addr-${Date.now().toString()}`,
        };
        updatedAddresses = [newAddress, ...prevAddresses];
      }

      // Ensure only one address is default
      if (addressData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === (addressData.id || (updatedAddresses.find(na => na.recipientName === addressData.recipientName && na.phone === addressData.phone)?.id)) // find new ID if it's new
            ? { ...addr, isDefault: true } 
            : { ...addr, isDefault: false }
        );
      }
      return updatedAddresses;
    });

    toast({
      title: addressData.id ? "地址已更新" : "地址已添加",
      description: `收货人 ${addressData.recipientName} 的地址信息已保存。`,
    });
    setIsDialogOpen(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm("确定要删除此地址吗？")) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast({ title: "地址已删除" });
    }
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prevAddresses => 
      prevAddresses.map(addr => 
        addr.id === addressId 
          ? { ...addr, isDefault: true } 
          : { ...addr, isDefault: false }
      )
    );
    toast({ title: "默认地址已更新" });
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载地址信息...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          我的收货地址
        </h2>
        <Button onClick={handleAddAddress} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> 添加新地址
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center text-muted-foreground">
            <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-3" />
            <p>您还没有添加任何收货地址。</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-18rem)] pr-1"> {/* Adjusted height */}
          <div className="space-y-3">
            {addresses.map((address) => (
              <Card key={address.id} className="shadow-sm">
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{address.recipientName} <span className="text-sm font-normal text-muted-foreground ml-1">{address.phone}</span></CardTitle>
                    {address.isDefault && <Badge variant="outline" className="text-xs border-primary text-primary"><Star className="h-3 w-3 mr-1"/>默认</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-xs text-muted-foreground">
                  <p>{`${address.province} ${address.city} ${address.district}`}</p>
                  <p>{address.detailedAddress}</p>
                  {address.postalCode && <p>邮编: {address.postalCode}</p>}
                </CardContent>
                <CardContent className="p-3 pt-1 border-t flex justify-end space-x-2">
                  {!address.isDefault && (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleSetDefault(address.id)}>
                      设为默认
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleEditAddress(address)}>
                    <Edit className="mr-1 h-3 w-3" /> 编辑
                  </Button>
                  <Button variant="destructive" size="sm" className="text-xs h-7" onClick={() => handleDeleteAddress(address.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> 删除
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <AddressFormDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingAddress(null); }}
        onSave={handleSaveAddress}
        address={editingAddress}
      />
    </div>
  );
}