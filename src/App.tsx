import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Link } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Heart, Bell, User, PenLine } from "lucide-react";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import WriteFeeling from "./pages/WriteFeeling";
import PublicPosts from "./pages/PublicPosts";
import PostDetails from "./pages/PostDetails";
import CommentsPage from "./pages/CommentsPage";
import ChatList from "./pages/ChatList";
import ChatScreen from "./pages/ChatScreen";
import PrivateDiary from "./pages/PrivateDiary";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import Notifications from "./pages/Notifications";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import ReportScreen from "./pages/ReportScreen";
import QuotesScreen from "./pages/QuotesScreen";

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  "/": "Welcome back 💛",
  "/write": "Write Feeling",
  "/posts": "Public Posts",
  "/quotes": "Motivational Quotes",
  "/comments": "Comments",
  "/chats": "Anonymous Chats",
  "/diary": "Private Diary",
  "/mood": "Mood Tracker",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/settings": "Settings",
  "/report": "Report",
};

const AppHeader = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Hunguta";

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden md:flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" fill="hsl(var(--primary))" />
          <span className="font-display font-bold text-foreground">{title}</span>
        </div>
        <span className="md:hidden font-display font-bold text-foreground text-sm">{title}</span>
      </div>

      {/* Right nav links */}
      <nav className="flex items-center gap-1">
        <Link to="/write" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Write">
          <PenLine className="w-5 h-5" />
        </Link>
        <Link to="/notifications" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Notifications">
          <Bell className="w-5 h-5" />
        </Link>
        <Link to="/profile" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors" title="Profile">
          <User className="w-5 h-5" />
        </Link>
      </nav>
    </header>
  );
};

const AppFooter = () => (
  <footer className="border-t border-border bg-card/50 py-4 px-4">
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" fill="hsl(var(--primary))" />
        <span className="text-xs text-muted-foreground font-display font-medium">Hunguta</span>
      </div>
      <p className="text-[10px] text-muted-foreground">Your feelings matter. You are not alone. 💛</p>
    </div>
  </footer>
);

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  </SidebarProvider>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse-warm font-serif text-lg">
          Loading Hunguta... 💛
        </p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/write" element={<WriteFeeling />} />
        <Route path="/posts" element={<PublicPosts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chats/:id" element={<ChatScreen />} />
        <Route path="/diary" element={<PrivateDiary />} />
        <Route path="/mood" element={<MoodTrackerPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/report" element={<ReportScreen />} />
        <Route path="/quotes" element={<QuotesScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
