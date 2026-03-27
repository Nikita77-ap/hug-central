import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 h-12 flex items-center border-b border-border bg-background/80 backdrop-blur-md px-4">
          <SidebarTrigger />
          <span className="ml-3 font-display font-bold text-foreground text-sm md:hidden">Hunguta</span>
        </header>
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
          {children}
        </main>
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
