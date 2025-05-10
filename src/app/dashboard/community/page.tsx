
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Keep Card for posts
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageSquare,ThumbsUp, Share2, Edit3, Search } from "lucide-react";

const mockPosts = [
  { 
    id: "post1", 
    userName: "糖友小李", 
    avatarUrl: "https://picsum.photos/seed/user1/40/40", 
    dataAiHint: "user avatar",
    timestamp: "2小时前", 
    content: "今天尝试了新的无糖点心食谱，味道还不错！有兴趣的朋友可以试试看，对血糖影响不大。", 
    likes: 15, 
    comments: 3 
  },
  { 
    id: "post2", 
    userName: "高压战士老王", 
    avatarUrl: "https://picsum.photos/seed/user2/40/40",
    dataAiHint: "user avatar",
    timestamp: "5小时前", 
    content: "坚持早起散步一个月了，感觉精神好多了，血压也稳定了一些。大家有什么好的晨练方式推荐吗？", 
    likes: 22, 
    comments: 5 
  },
  { 
    id: "post3", 
    userName: "健康生活家小赵", 
    avatarUrl: "https://picsum.photos/seed/user3/40/40", 
    dataAiHint: "user avatar",
    timestamp: "昨天", 
    content: "发现一本关于慢性病饮食管理的好书，分享给大家：《吃的智慧》。里面有很多实用的建议。", 
    likes: 8, 
    comments: 1 
  },
];


export default function CommunityPage() {
  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardContent className="p-3">
            <div className="flex gap-2 mb-2">
                <Input placeholder="搜索帖子 (建设中)" className="flex-grow h-9 text-sm" disabled/>
                <Button variant="outline" size="sm" className="h-9 text-xs" disabled><Search className="mr-1 h-3 w-3"/>搜索</Button>
            </div>
            <Button className="w-full h-9 text-sm" disabled><Edit3 className="mr-1 h-3 w-3"/>发布新帖</Button>
        </CardContent>
      </Card>

      {mockPosts.length > 0 ? (
        <div className="space-y-3">
          {mockPosts.map((post) => (
            <Card key={post.id} className="shadow-xs">
              <CardHeader className="flex flex-row items-start space-x-2 p-3 pb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.avatarUrl} alt={post.userName} data-ai-hint={post.dataAiHint} />
                  <AvatarFallback className="text-xs">{post.userName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.userName}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0 pb-2">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardContent className="flex justify-around items-center border-t p-2 text-xs text-muted-foreground">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-7 px-2" disabled>
                  <ThumbsUp className="mr-1 h-3 w-3" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-7 px-2" disabled>
                  <MessageSquare className="mr-1 h-3 w-3" /> {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-7 px-2" disabled>
                  <Share2 className="mr-1 h-3 w-3" /> 分享
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="shadow-sm">
            <CardContent className="py-12 text-center">
                <Users className="mx-auto h-16 w-16 text-primary/30 mb-3" />
                <h3 className="text-md font-semibold text-foreground/70">社区功能即将上线</h3>
                <p className="text-foreground/50 text-xs max-w-xs mx-auto">
                我们正在建设病友交流社区，敬请期待。
                </p>
            </CardContent>
        </Card>
      )}
       <p className="text-xs text-muted-foreground text-center pt-2">病友互助社区 (此页面内容正在建设中)。</p>
    </div>
  );
}
