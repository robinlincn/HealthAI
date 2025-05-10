import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react"; // Renamed to avoid conflict with Recharts component
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, BarChart } from "recharts"

const bloodSugarData = [
  { date: "2023-01-01", value: 5.5 }, { date: "2023-01-02", value: 6.1 },
  { date: "2023-01-03", value: 5.2 }, { date: "2023-01-04", value: 7.0 },
  { date: "2023-01-05", value: 6.5 }, { date: "2023-01-06", value: 5.8 },
  { date: "2023-01-07", value: 6.2 },
];

const bloodPressureData = [
  { date: "2023-01-01", systolic: 120, diastolic: 80 }, { date: "2023-01-02", systolic: 125, diastolic: 82 },
  { date: "2023-01-03", systolic: 118, diastolic: 78 }, { date: "2023-01-04", systolic: 130, diastolic: 85 },
  { date: "2023-01-05", systolic: 122, diastolic: 80 }, { date: "2023-01-06", systolic: 128, diastolic: 83 },
  { date: "2023-01-07", systolic: 124, diastolic: 81 },
];

const chartConfigBloodSugar = { value: { label: "血糖 (mmol/L)", color: "hsl(var(--chart-1))" } };
const chartConfigBloodPressure = { 
  systolic: { label: "收缩压 (mmHg)", color: "hsl(var(--chart-1))" },
  diastolic: { label: "舒张压 (mmHg)", color: "hsl(var(--chart-2))" },
};


export default function VisualizationsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <LineChartIcon className="mr-3 h-7 w-7 text-primary" />
            健康数据可视化
          </CardTitle>
          <CardDescription>
            通过图表清晰展示您的血糖、血压等健康数据趋势。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>血糖数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBloodSugar} className="h-[300px] w-full">
              <LineChart data={bloodSugarData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} />
                <YAxis domain={['auto', 'auto']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>血压数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBloodPressure} className="h-[300px] w-full">
               <BarChart data={bloodPressureData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
                <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>其他健康数据 (示例)</CardTitle>
            <CardDescription>体重、血脂等数据图表将在此处展示。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">图表内容正在建设中。</p>
          </CardContent>
        </Card>
    </div>
  );
}
