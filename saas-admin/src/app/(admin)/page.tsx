import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"; // Assuming Card component exists
import { Briefcase, Users, ShoppingCart, BarChart2 } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "总企业数", value: "120", icon: Briefcase, color: "text-blue-500" },
    { title: "活跃用户", value: "1,500", icon: Users, color: "text-green-500" },
    { title: "本月订单", value: "350", icon: ShoppingCart, color: "text-orange-500" },
    { title: "系统API调用", value: "2.5M", icon: BarChart2, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">SAAS管理后台仪表盘</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>近期活动</CardTitle>
            <CardDescription>最近的系统操作和重要事件。</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>新企业 "健康未来医院" 已注册。</li>
              <li>服务包 "高级慢病管理套餐" 已更新。</li>
              <li>API "病人数据查询" 调用量激增。</li>
              <li>系统维护任务已于 03:00 AM 完成。</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>关键服务和模块的运行状态。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">主数据库</span>
              <span className="text-sm font-semibold text-green-500">运行正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">消息队列服务</span>
              <span className="text-sm font-semibold text-green-500">运行正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">外呼服务</span>
              <span className="text-sm font-semibold text-orange-500">轻微延迟</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
