
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, ShoppingCart, BarChart2 } from "lucide-react";

export default function SaasAdminDashboardPage() {
  // Placeholder stats - these would come from a backend in a real app
  const stats = [
    { title: "总企业数", value: "0", icon: Briefcase, color: "text-blue-500" },
    { title: "总用户数 (SAAS)", value: "0", icon: Users, color: "text-green-500" },
    { title: "总订单数", value: "0", icon: ShoppingCart, color: "text-orange-500" },
    { title: "API调用 (本月)", value: "0", icon: BarChart2, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">SAAS管理仪表盘</h1>
      
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
            <p className="text-muted-foreground">暂无活动记录。</p>
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
              <span className="text-sm">消息队列</span>
              <span className="text-sm font-semibold text-green-500">运行正常</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        欢迎使用SAAS管理后台。更多功能模块（如企业管理、部门管理、员工管理、服务中心等）将在此基础上逐步实现。
      </p>
    </div>
  );
}
