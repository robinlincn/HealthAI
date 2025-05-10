
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Search, BookCopy, Utensils, BarChart2, Lightbulb, PlusCircle, ListPlus, Pizza } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealLogEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: { foodName: string; quantity: string }[];
  date: string;
  notes?: string;
}

const mockFoodDatabase: FoodItem[] = [
  { id: "food1", name: "苹果", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: "food2", name: "鸡胸肉 (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "food3", name: "米饭 (1碗)", calories: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  { id: "food4", name: "西兰花 (1杯)", calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
];

const mockMealLogs: MealLogEntry[] = [
    { id: "log1", mealType: "breakfast", items: [{foodName: "苹果", quantity: "1个"}, {foodName: "燕麦片", quantity: "50g"}], date: "2024-05-21", notes: "加了点蜂蜜" },
    { id: "log2", mealType: "lunch", items: [{foodName: "鸡胸肉", quantity: "150g"}, {foodName: "米饭", quantity: "半碗"}, {foodName: "西兰花", quantity: "1杯"}], date: "2024-05-21" },
];


export default function NutritionPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLogEntry[]>(mockMealLogs);
  // Add states for meal logging form

  const handleSearchFood = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
    }
    // Mock search
    setSearchResults(mockFoodDatabase.filter(food => food.name.includes(searchTerm)));
    if (mockFoodDatabase.filter(food => food.name.includes(searchTerm)).length === 0) {
        toast({ title: "未找到食物", description: `数据库中暂无“${searchTerm}”的相关信息。`, variant: "destructive" });
    }
  };

  const handleLogMeal = (e: FormEvent) => {
      e.preventDefault();
      // Mock log meal
      toast({ title: "膳食已记录 (模拟)", description: "您的膳食信息已保存。" });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Apple className="mr-3 h-7 w-7 text-primary" />
            营养与饮食管理
          </CardTitle>
          <CardDescription>
            查询食物营养、记录每日三餐、获取个性化营养分析与饮食建议。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mealLog" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="mealLog"><Utensils className="mr-2 h-4 w-4" /> 三餐记录</TabsTrigger>
          <TabsTrigger value="foodDb"><BookCopy className="mr-2 h-4 w-4" /> 食物数据库</TabsTrigger>
          <TabsTrigger value="analysis"><BarChart2 className="mr-2 h-4 w-4" /> 营养分析与建议</TabsTrigger>
        </TabsList>

        <TabsContent value="mealLog">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5 text-primary"/>记录新膳食</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogMeal} className="space-y-4">
                  <div>
                    <Label htmlFor="mealType">膳食类型</Label>
                    <select id="mealType" className="mt-1 block w-full p-2 border border-input rounded-md bg-background text-sm">
                        <option value="breakfast">早餐</option>
                        <option value="lunch">午餐</option>
                        <option value="dinner">晚餐</option>
                        <option value="snack">加餐</option>
                    </select>
                  </div>
                  <div>
                      <Label htmlFor="foodItems">食物条目 (示例)</Label>
                      <div className="space-y-2 mt-1">
                        <div className="flex gap-2 items-center">
                            <Input placeholder="食物名称, 如: 苹果" className="flex-grow" defaultValue="苹果"/>
                            <Input placeholder="份量, 如: 1个" className="w-1/3" defaultValue="1个"/>
                        </div>
                         <div className="flex gap-2 items-center">
                            <Input placeholder="食物名称" className="flex-grow"/>
                            <Input placeholder="份量" className="w-1/3"/>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-2" disabled><ListPlus className="mr-1 h-4 w-4"/>添加食物条目</Button>
                  </div>
                  <div>
                    <Label htmlFor="mealDate">日期</Label>
                    <Input id="mealDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1"/>
                  </div>
                  <div>
                    <Label htmlFor="mealNotes">备注 (可选)</Label>
                    <Textarea id="mealNotes" placeholder="例如：今天胃口不太好" className="mt-1"/>
                  </div>
                  <Button type="submit" className="w-full" disabled>保存膳食记录</Button>
                   <p className="text-xs text-muted-foreground text-center mt-2">膳食记录与食物搜索联动功能正在开发中。</p>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>已记录膳食 (最近)</CardTitle></CardHeader>
              <CardContent>
                {mealLogs.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                        <ul className="space-y-3">
                        {mealLogs.map(log => (
                            <li key={log.id} className="p-3 border rounded-md bg-muted/30">
                                <p className="font-semibold capitalize text-primary">{log.mealType} - {log.date}</p>
                                <ul className="list-disc list-inside text-sm">
                                    {log.items.map((item, idx) => <li key={idx}>{item.foodName}: {item.quantity}</li>)}
                                </ul>
                                {log.notes && <p className="text-xs text-muted-foreground mt-1">备注: {log.notes}</p>}
                            </li>
                        ))}
                        </ul>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-center py-4">暂无膳食记录。</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="foodDb">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Search className="mr-2 h-5 w-5 text-primary"/>搜索食物数据库</CardTitle>
              <CardDescription>查询食物的营养成分信息。</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearchFood} className="flex gap-2 mb-6">
                <Input 
                    type="search" 
                    placeholder="输入食物名称，如：苹果" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit">搜索</Button>
              </form>
              {searchResults.length > 0 && (
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  <div className="space-y-3">
                    {searchResults.map(food => (
                      <Card key={food.id} className="p-3 shadow-sm">
                        <h4 className="font-semibold">{food.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          热量: {food.calories}kcal | 蛋白: {food.protein}g | 碳水: {food.carbs}g | 脂肪: {food.fat}g
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
               <div className="mt-6 text-center">
                <Pizza className="mx-auto h-16 w-16 text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground">支持添加自定义食物及其营养信息功能正在建设中。</p>
                <Button variant="outline" className="mt-2" disabled><PlusCircle className="mr-2 h-4 w-4" /> 添加自定义食物</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary"/>营养分析与饮食建议</CardTitle>
              <CardDescription>根据您的膳食记录，自动计算每日热量摄入和营养成分，并提供个性化建议。</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <BarChart2 className="mx-auto h-24 w-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">功能开发中</h3>
                <p className="text-foreground/50 max-w-md mx-auto">
                    详细的每日/每周营养摄入分析图表，以及基于AI的个性化饮食建议功能即将推出。
                </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
