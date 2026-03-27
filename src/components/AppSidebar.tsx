import {
  Home, PenLine, Globe, MessageCircle, BookOpen, BarChart3,
  Bell, User, Settings, Flag, Sparkles, MessageSquare, Heart
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Write Feeling", url: "/write", icon: PenLine },
  { title: "Public Posts", url: "/posts", icon: Globe },
  { title: "Quotes", url: "/quotes", icon: Sparkles },
];

const socialItems = [
  { title: "Comments", url: "/comments", icon: MessageCircle },
  { title: "Chat List", url: "/chats", icon: MessageSquare },
];

const personalItems = [
  { title: "Private Diary", url: "/diary", icon: BookOpen },
  { title: "Mood Tracker", url: "/mood", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
];

const accountItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Report", url: "/report", icon: Flag },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="hover:bg-muted/50"
                  activeClassName="bg-primary/10 text-primary font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" fill="hsl(var(--primary))" />
          {!collapsed && <span className="font-display font-bold text-lg text-foreground">Hunguta</span>}
        </div>
        {renderGroup("Main", mainItems)}
        {renderGroup("Social", socialItems)}
        {renderGroup("Personal", personalItems)}
        {renderGroup("Account", accountItems)}
      </SidebarContent>
    </Sidebar>
  );
}
