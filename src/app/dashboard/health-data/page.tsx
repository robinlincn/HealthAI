
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Keep Card for individual sections
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Activity, Droplets, Scale, HeartPulse, Dumbbell } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, BarChart as RechartsBarChart, Bar, Line as RechartsLine, Tooltip as RechartsTooltip } from "recharts";
import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Mock data
const mockBloodSugarData = [
  { date: "2023-01-01", value: 5.5 }, { date: "2023-01-02", value: 6.1 },
  { date: "2023-01-03", value: 5.2 }, { date: "2023-01-04", value: 7.0 },
  { date: "2023-01-05", value: 6.5 }, { date: "2023-01-06", value: 5.8 },
  { date: "2023-01-07", value: 6.2 },
];

const mockBloodPressureData = [
  { date: "2023-01-01", systolic: 120, diastolic: 80 }, { date: "2023-01-02", systolic: 125, diastolic: 82 },
  { date: "2023-01-03", systolic: 118, diastolic: 78 }, { date: "2023-01-04", systolic: 130, diastolic: 85 },
  { date: "2023-01-05", systolic: 122, diastolic: 80 }, { date: "2023-01-06", systolic: 128, diastolic: 83 },
  { date: "2023-01-07", systolic: 124, diastolic: 81 },
];

const mockWeightData = [
  { date: "2023-01-01", value: 70.5 }, { date: "2023-01-08", value: 70.1 },
  { date: "2023-01-15", value: 69.8 }, { date: "2023-01-22", value: 69.5 },
];

const mockLipidsData = [
  { date: "2023-01-01", totalCholesterol: 5.2, triglycerides: 1.7, hdl: 1.0, ldl: 3.0 },
  { date: "2023-04-01", totalCholesterol: 5.0, triglycerides: 1.5, hdl: 1.1, ldl: 2.8 },
];

const mockExerciseData = [
  { date: "2023-01-01", type: "跑步", duration: 30, notes: "公园慢跑" },
  { date: "2023-01-03", type: "游泳", duration: 45, notes: "健身房" },
];

const chartConfigBloodSugar = { value: { label: "血糖 (mmol/L)", color: "hsl(var(--chart-1))" } };
const chartConfigBloodPressure = { 
  systolic: { label: "收缩压 (mmHg)", color: "hsl(var(--chart-1))" },
  diastolic: { label: "舒张压 (mmHg)", color: "hsl(var(--chart-2))" },
};
const chartConfigWeight = { value: { label: "体重 (kg)", color: "hsl(var(--chart-3))" } };
const chartConfigLipids = {
  totalCholesterol: { label: "总胆固醇 (mmol/L)", color: "hsl(var(--chart-1))"},
  triglycerides: { label: "甘油三酯 (mmol/L)", color: "hsl(var(--chart-2))"},
  hdl: { label: "高密度脂蛋白 (mmol/L)", color: "hsl(var(--chart-3))"},
  ldl: { label: "低密度脂蛋白 (mmol/L)", color: "hsl(var(--chart-4))"},
};

export default function HealthDataPage() {
  const { toast } = useToast();
  const [bloodSugarInput, setBloodSugarInput] = useState({ date: format(new Date(), "yyyy-MM-dd"), time: format(new Date(), "HH:mm"), value: "", notes: "" });
  const [bloodPressureInput, setBloodPressureInput] = useState({ date: format(new Date(), "yyyy-MM-dd"), time: format(new Date(), "HH:mm"), systolic: "", diastolic: "", heartRate: "" });
  const [weightInput, setWeightInput] = useState({ date: format(new Date(), "yyyy-MM-dd"), value: "" });
  const [lipidsInput, setLipidsInput] = useState({ date: format(new Date(), "yyyy-MM-dd"), totalCholesterol: "", triglycerides: "", hdl: "", ldl: "" });
  const [exerciseInput, setExerciseInput] = useState({ date: format(new Date(), "yyyy-MM-dd"), type: "", duration: "", notes: "" });

  const handleDataSubmit = (dataType: string, data: any) => (e: FormEvent) => {
    e.preventDefault();
    console.log(`Submitting ${dataType} data:`, data);
    toast({ title: `${dataType}数据已记录 (模拟)`, description: "您的数据已保存。" });
  };
  
  const renderInputFormCard = (title: string, IconComponent: React.ElementType, fields: {id: string, label: string, type: string, placeholder: string, state: any, setState: Function, parentObjKey: string}[], dataObj: any, submitHandler: (e: FormEvent) => void) => (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-base flex items-center"><IconComponent className="mr-2 h-4 w-4 text-primary" />记录{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={submitHandler} className="space-y-3">
          {fields.map(field => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
              <Input 
                id={field.id} 
                type={field.type} 
                placeholder={field.placeholder} 
                value={dataObj[field.id]}
                onChange={(e) => field.setState((prev: any) => ({...prev, [field.id]: e.target.value}))}
                className="mt-1 h-9 text-sm"
              />
            </div>
          ))}
          <Button type="submit" className="w-full text-sm h-9">保存{title}记录</Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 text-sm h-10">
          <TabsTrigger value="view" className="py-2"><BarChart3 className="mr-1 h-4 w-4" /> 查看数据</TabsTrigger>
          <TabsTrigger value="input" className="py-2"><Activity className="mr-1 h-4 w-4" /> 手动记录</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <div className="space-y-4"> {/* Use space-y for vertical stacking of charts */}
            <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">血糖数据趋势</CardTitle></CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ChartContainer config={chartConfigBloodSugar} className="h-[250px] w-full">
                  <RechartsLineChart data={mockBloodSugarData} accessibilityLayer margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => format(new Date(value), "MM-dd")} />
                    <YAxis domain={['auto', 'auto']} fontSize={10} />
                    <RechartsTooltip content={<ChartTooltipContent hideLabel wrapperStyle={{fontSize: '10px', padding: '4px 8px'}} />} />
                    <ChartLegend content={<ChartLegendContent wrapperStyle={{fontSize: '10px'}} />} />
                    <RechartsLine type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{r:3}} />
                  </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">血压数据趋势</CardTitle></CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ChartContainer config={chartConfigBloodPressure} className="h-[250px] w-full">
                   <RechartsBarChart data={mockBloodPressureData} accessibilityLayer margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => format(new Date(value), "MM-dd")} />
                    <YAxis fontSize={10}/>
                    <RechartsTooltip content={<ChartTooltipContent wrapperStyle={{fontSize: '10px', padding: '4px 8px'}}/>} />
                    <ChartLegend content={<ChartLegendContent wrapperStyle={{fontSize: '10px'}} />} />
                    <Bar dataKey="systolic" fill="var(--color-systolic)" radius={3} barSize={10}/>
                    <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={3} barSize={10}/>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">体重变化趋势</CardTitle></CardHeader>
              <CardContent className="p-2 sm:p-4">
                 <ChartContainer config={chartConfigWeight} className="h-[250px] w-full">
                  <RechartsLineChart data={mockWeightData} accessibilityLayer margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => format(new Date(value), "MM-dd")} />
                    <YAxis domain={['auto', 'auto']} fontSize={10} />
                    <RechartsTooltip content={<ChartTooltipContent hideLabel wrapperStyle={{fontSize: '10px', padding: '4px 8px'}}/>} />
                    <ChartLegend content={<ChartLegendContent wrapperStyle={{fontSize: '10px'}} />} />
                    <RechartsLine type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={{r:3}} />
                  </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">血脂数据趋势</CardTitle></CardHeader>
              <CardContent className="p-2 sm:p-4">
                 <ChartContainer config={chartConfigLipids} className="h-[250px] w-full">
                   <RechartsBarChart data={mockLipidsData} accessibilityLayer margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => format(new Date(value), "MM-dd")} />
                    <YAxis fontSize={10}/>
                    <RechartsTooltip content={<ChartTooltipContent wrapperStyle={{fontSize: '10px', padding: '4px 8px'}}/>} />
                    <ChartLegend content={<ChartLegendContent wrapperStyle={{fontSize: '10px'}} />} />
                    <Bar dataKey="totalCholesterol" fill="var(--color-totalCholesterol)" radius={3} barSize={8} />
                    <Bar dataKey="triglycerides" fill="var(--color-triglycerides)" radius={3} barSize={8}/>
                    <Bar dataKey="hdl" fill="var(--color-hdl)" radius={3} barSize={8}/>
                    <Bar dataKey="ldl" fill="var(--color-ldl)" radius={3} barSize={8}/>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>

             <Card className="shadow-sm">
              <CardHeader className="p-4"><CardTitle className="text-base">运动记录</CardTitle></CardHeader>
              <CardContent className="p-4">
                {mockExerciseData.length > 0 ? (
                  <ul className="space-y-2">
                    {mockExerciseData.map((ex, i) => (
                      <li key={i} className="text-sm p-2 border rounded-md bg-muted/30">
                        <strong>{ex.date}:</strong> {ex.type} - {ex.duration}分钟. {ex.notes && `备注: ${ex.notes}`}
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground text-sm">暂无运动记录。</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="input">
          <div className="space-y-4"> {/* Stack forms vertically */}
            {renderInputFormCard("血糖", Droplets, 
              [
                {id: "date", label: "日期", type: "date", placeholder: "", state: bloodSugarInput, setState: setBloodSugarInput, parentObjKey: "bloodSugarInput"},
                {id: "time", label: "时间", type: "time", placeholder: "", state: bloodSugarInput, setState: setBloodSugarInput, parentObjKey: "bloodSugarInput"},
                {id: "value", label: "血糖值 (mmol/L)", type: "number", placeholder: "例如 5.8", state: bloodSugarInput, setState: setBloodSugarInput, parentObjKey: "bloodSugarInput"},
                {id: "notes", label: "备注 (餐前/餐后)", type: "text", placeholder: "例如 餐前", state: bloodSugarInput, setState: setBloodSugarInput, parentObjKey: "bloodSugarInput"},
              ],
              bloodSugarInput,
              handleDataSubmit("血糖", bloodSugarInput)
            )}
            {renderInputFormCard("血压", HeartPulse, 
              [
                {id: "date", label: "日期", type: "date", placeholder: "", state: bloodPressureInput, setState: setBloodPressureInput, parentObjKey: "bloodPressureInput"},
                {id: "time", label: "时间", type: "time", placeholder: "", state: bloodPressureInput, setState: setBloodPressureInput, parentObjKey: "bloodPressureInput"},
                {id: "systolic", label: "收缩压 (mmHg)", type: "number", placeholder: "例如 120", state: bloodPressureInput, setState: setBloodPressureInput, parentObjKey: "bloodPressureInput"},
                {id: "diastolic", label: "舒张压 (mmHg)", type: "number", placeholder: "例如 80", state: bloodPressureInput, setState: setBloodPressureInput, parentObjKey: "bloodPressureInput"},
                {id: "heartRate", label: "心率 (bpm, 可选)", type: "number", placeholder: "例如 70", state: bloodPressureInput, setState: setBloodPressureInput, parentObjKey: "bloodPressureInput"},
              ],
              bloodPressureInput,
              handleDataSubmit("血压", bloodPressureInput)
            )}
             {renderInputFormCard("体重", Scale, 
              [
                {id: "date", label: "日期", type: "date", placeholder: "", state: weightInput, setState: setWeightInput, parentObjKey: "weightInput"},
                {id: "value", label: "体重 (kg)", type: "number", placeholder: "例如 70.5", state: weightInput, setState: setWeightInput, parentObjKey: "weightInput"},
              ],
              weightInput,
              handleDataSubmit("体重", weightInput)
            )}
            {renderInputFormCard("血脂", Droplets,
              [
                {id: "date", label: "日期", type: "date", placeholder: "", state: lipidsInput, setState: setLipidsInput, parentObjKey: "lipidsInput"},
                {id: "totalCholesterol", label: "总胆固醇 (mmol/L)", type: "number", placeholder: "例如 5.2", state: lipidsInput, setState: setLipidsInput, parentObjKey: "lipidsInput"},
                {id: "triglycerides", label: "甘油三酯 (mmol/L)", type: "number", placeholder: "例如 1.7", state: lipidsInput, setState: setLipidsInput, parentObjKey: "lipidsInput"},
                {id: "hdl", label: "高密度脂蛋白 (mmol/L)", type: "number", placeholder: "例如 1.0", state: lipidsInput, setState: setLipidsInput, parentObjKey: "lipidsInput"},
                {id: "ldl", label: "低密度脂蛋白 (mmol/L)", type: "number", placeholder: "例如 3.0", state: lipidsInput, setState: setLipidsInput, parentObjKey: "lipidsInput"},
              ],
              lipidsInput,
              handleDataSubmit("血脂", lipidsInput)
            )}
            {renderInputFormCard("运动", Dumbbell, 
              [
                {id: "date", label: "日期", type: "date", placeholder: "", state: exerciseInput, setState: setExerciseInput, parentObjKey: "exerciseInput"},
                {id: "type", label: "运动类型", type: "text", placeholder: "跑步、游泳等", state: exerciseInput, setState: setExerciseInput, parentObjKey: "exerciseInput"},
                {id: "duration", label: "运动时长 (分钟)", type: "number", placeholder: "例如 30", state: exerciseInput, setState: setExerciseInput, parentObjKey: "exerciseInput"},
                {id: "notes", label: "备注 (可选)", type: "text", placeholder: "例如 公园慢跑", state: exerciseInput, setState: setExerciseInput, parentObjKey: "exerciseInput"},
              ],
              exerciseInput,
              handleDataSubmit("运动", exerciseInput)
            )}
          </div>
          <Card className="mt-6 shadow-sm">
            <CardHeader className="p-4">
                <CardTitle className="text-base">设备同步与数据校验</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">支持与蓝牙血糖仪、血压计、运动手环等设备自动同步数据功能正在开发中。系统会自动检测异常数据并提示您确认。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
