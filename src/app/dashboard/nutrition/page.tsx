
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, BookCopy, Utensils, BarChart2, Lightbulb, PlusCircle, ListPlus, Pizza } from "lucide-react";
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

  const handleSearchFood = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
    }
    const results = mockFoodDatabase.filter(food => food.name.includes(searchTerm));
    setSearchResults(results);
    if (results.length === 0) {
        toast({ title: "未找到食物", description: `数据库中暂无“${searchTerm}”的信息。`, variant: "default" });
    }
  };

  const handleLogMeal = (e: FormEvent) => {
      e.preventDefault();
      toast({ title: "膳食已记录 (模拟)", description: "您的膳食信息已保存。" });
  };


  return (
    <div className="space-y-6">
      <Tabs defaultValue="mealLog" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm h-10">
          <TabsTrigger value="mealLog" className="py-2 px-1"><Utensils className="mr-1 h-4 w-4" />三餐记录</TabsTrigger>
          <TabsTrigger value="foodDb" className="py-2 px-1"><BookCopy className="mr-1 h-4 w-4" />食物库</TabsTrigger>
          <TabsTrigger value="analysis" className="py-2 px-1"><BarChart2 className="mr-1 h-4 w-4" />营养分析</TabsTrigger>
        </TabsList>

        <TabsContent value="mealLog">
          <div className="space-y-4"> {/* Changed grid to space-y for better mobile stacking */}
            <Card className="shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-base flex items-center"><PlusCircle className="mr-2 h-4 w-4 text-primary"/>记录新膳食</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleLogMeal} className="space-y-3">
                  <div>
                    <Label htmlFor="mealType" className="text-sm">膳食类型</Label>
                    <select id="mealType" className="mt-1 block w-full p-2 border border-input rounded-md bg-background text-sm h-9">
                        <option value="breakfast">早餐</option>
                        <option value="lunch">午餐</option>
                        <option value="dinner">晚餐</option>
                        <option value="snack">加餐</option>
                    </select>
                  </div>
                  <div>
                      <Label htmlFor="foodItems" className="text-sm">食物条目 (示例)</Label>
                      <div className="space-y-2 mt-1">
                        <div className="flex gap-2 items-center">
                            <Input placeholder="食物名称" className="flex-grow h-9 text-sm" defaultValue="苹果"/>
                            <Input placeholder="份量" className="w-2/5 h-9 text-sm" defaultValue="1个"/>
                        </div>
                         <div className="flex gap-2 items-center">
                            <Input placeholder="食物名称" className="flex-grow h-9 text-sm"/>
                            <Input placeholder="份量" className="w-2/5 h-9 text-sm"/>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-2 text-xs" disabled><ListPlus className="mr-1 h-3 w-3"/>添加食物</Button>
                  </div>
                  <div>
                    <Label htmlFor="mealDate" className="text-sm">日期</Label>
                    <Input id="mealDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 h-9 text-sm"/>
                  </div>
                  <div>
                    <Label htmlFor="mealNotes" className="text-sm">备注 (可选)</Label>
                    <Textarea id="mealNotes" placeholder="例如：今天胃口不太好" className="mt-1 text-sm" rows={2}/>
                  </div>
                  <Button type="submit" className="w-full text-sm h-9" disabled>保存膳食记录</Button>
                   <p className="text-xs text-muted-foreground text-center mt-1">膳食记录与食物搜索联动功能正在开发中。</p>
                </form>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">已记录膳食 (最近)</CardTitle></CardHeader>
              <CardContent className="p-4">
                {mealLogs.length > 0 ? (
                    <ScrollArea className="h-[250px]">
                        <ul className="space-y-2">
                        {mealLogs.map(log => (
                            <li key={log.id} className="p-2.5 border rounded-md bg-muted/50">
                                <p className="font-semibold capitalize text-primary text-sm">{log.mealType} - {log.date}</p>
                                <ul className="list-disc list-inside text-xs">
                                    {log.items.map((item, idx) => <li key={idx}>{item.foodName}: {item.quantity}</li>)}
                                </ul>
                                {log.notes && <p className="text-xs text-muted-foreground mt-1">备注: {log.notes}</p>}
                            </li>
                        ))}
                        </ul>
                    </ScrollArea>
                ) : (
                    <p className="text-muted-foreground text-center py-4 text-sm">暂无膳食记录。</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="foodDb">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center"><Search className="mr-2 h-4 w-4 text-primary"/>搜索食物数据库</CardTitle>
              <CardDescription className="text-xs">查询食物的营养成分信息。</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSearchFood} className="flex gap-2 mb-4">
                <Input 
                    type="search" 
                    placeholder="输入食物名称" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow h-9 text-sm"
                />
                <Button type="submit" size="sm" className="h-9">搜索</Button>
              </form>
              {searchResults.length > 0 && (
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  <div className="space-y-2">
                    {searchResults.map(food => (
                      <Card key={food.id} className="p-2.5 shadow-xs">
                        <h4 className="font-semibold text-sm">{food.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          热量: {food.calories}kcal | 蛋白: {food.protein}g | 碳水: {food.carbs}g | 脂肪: {food.fat}g
                        </p>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
               <div className="mt-4 text-center">
                <Pizza className="mx-auto h-12 w-12 text-primary/20 mb-2" />
                <p className="text-xs text-muted-foreground">支持添加自定义食物及其营养信息功能正在建设中。</p>
                <Button variant="outline" size="sm" className="mt-2 text-xs" disabled><PlusCircle className="mr-1 h-3 w-3" /> 添加自定义食物</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-primary"/>营养分析与建议</CardTitle>
              <CardDescription className="text-xs">根据您的膳食记录，自动计算每日热量摄入和营养成分，并提供个性化建议。</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-4">
                <BarChart2 className="mx-auto h-16 w-16 text-primary/30 mb-3" />
                <h3 className="text-md font-semibold text-foreground/70">功能开发中</h3>
                <p className="text-foreground/50 text-xs max-w-md mx-auto">
                    详细的每日/每周营养摄入分析图表，以及基于AI的个性化饮食建议功能即将推出。
                </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
