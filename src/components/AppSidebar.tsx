import {
  Home, PenLine, Globe, MessageCircle, BookOpen, BarChart3,
  Bell, User, Settings, Flag, Sparkles, MessageSquare, Heart, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Write Feeling", url: "/write", icon: PenLine },
  { title: "Public Posts", url: "/posts", icon: Globe },
  { title: "Quotes", url: "/quotes", icon: Sparkles },
];

const socialItems = [
  { title: "Comments", url: "/comments", icon: MessageCircle },
  { title: "Chats", url: "/chats", icon: MessageSquare },
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
  const { signOut } = useAuth();

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
                  activeClassName="bg-primary/10 text-primary font-semibold"
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="py-2">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-primary" fill="hsl(var(--primary))" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-display font-bold text-base text-foreground leading-none">Hunguta</span>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">Your safe space</p>
            </div>
          )}
        </div>

        <Separator className="mx-3 w-auto" />

        {renderGroup("Main", mainItems)}
        {renderGroup("Social", socialItems)}
        {renderGroup("Personal", personalItems)}
        {renderGroup("Account", accountItems)}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Separator className="mb-3" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
