
"use client";

import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';
import type { SaasProduct } from '@/lib/types'; 

interface ProductCardProps {
  product: SaasProduct; 
  onAddToCart: (productId: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, className }) => {
  const displayPrice = product.isOnSale && typeof product.discountPrice === 'number' 
    ? product.discountPrice 
    : product.price;
  const originalPrice = product.isOnSale && typeof product.discountPrice === 'number' && product.price > product.discountPrice
    ? product.price
    : null;

  return (
    <Card className={`w-[160px] sm:w-[180px] flex-shrink-0 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col ${className}`}>
      <Link href={`/dashboard/mall/${product.id}`} legacyBehavior>
        <a className="block aspect-[4/3] bg-muted relative w-full cursor-pointer">
          <Image 
            src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/200x150.png?text=商品图片"} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 160px, 180px"
            className="object-cover"
            data-ai-hint={product.dataAiHint || "product image"}
          />
        </a>
      </Link>
      <CardContent className="p-2.5 space-y-1 flex flex-col flex-grow">
        <Link href={`/dashboard/mall/${product.id}`} legacyBehavior>
          <a className="cursor-pointer hover:text-primary">
            <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 h-8 sm:h-10 leading-tight">{product.name}</h3>
          </a>
        </Link>
        <div className="flex items-baseline gap-1 mt-auto"> {/* Pushes price and button to bottom */}
          <p className="text-sm sm:text-base font-bold text-primary">¥{displayPrice.toFixed(2)}</p>
          {originalPrice && (
            <p className="text-[10px] sm:text-xs text-muted-foreground line-through">¥{originalPrice.toFixed(2)}</p>
          )}
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-accent/20 text-accent-foreground rounded-full">{tag}</span>
            ))}
          </div>
        )}
        <Button 
          size="sm" 
          className="w-full h-8 text-xs mt-1.5" 
          onClick={() => onAddToCart(product.id)}
          variant="outline"
        >
          <ShoppingCart className="mr-1 h-3.5 w-3.5" />加入购物车
        </Button>
      </CardContent>
    </Card>
  );
};

