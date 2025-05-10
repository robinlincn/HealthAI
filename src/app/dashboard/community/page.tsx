
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            病友互助社区
          </CardTitle>
          <CardDescription>
            与其他病友交流经验、分享心得，共同抗击慢病。 (此页面内容正在建设中)
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-2 mb-4">
                <Input placeholder="搜索帖子或用户 (建设中)" className="flex-grow" disabled/>
                <Button variant="outline" disabled><Search className="mr-2 h-4 w-4"/>搜索</Button>
                <Button disabled><Edit3 className="mr-2 h-4 w-4"/>发布新帖</Button>
            </div>
        </CardContent>
      </Card>

      {mockPosts.length > 0 ? (
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-start space-x-3 pb-3">
                <Avatar>
                  <AvatarImage src={post.avatarUrl} alt={post.userName} data-ai-hint={post.dataAiHint} />
                  <AvatarFallback>{post.userName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.userName}</p>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardContent className="flex justify-between items-center border-t pt-3 pb-3 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" disabled>
                  <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes} 点赞
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" disabled>
                  <MessageSquare className="mr-1 h-4 w-4" /> {post.comments} 评论
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" disabled>
                  <Share2 className="mr-1 h-4 w-4" /> 分享
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
         <Card>
            <CardContent className="py-16 text-center">
                <Users className="mx-auto h-24 w-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">社区功能即将上线</h3>
                <p className="text-foreground/50 max-w-md mx-auto">
                我们正在建设病友交流社区，提供话题讨论、经验分享等功能，帮助大家更好地管理健康。敬请期待。
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
