import { Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Header = () => {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <Heart className="w-7 h-7 text-primary" fill="hsl(var(--primary))" />
          <h1 className="text-xl font-bold font-display text-foreground">Hunguta</h1>
        </motion.div>

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Leave
        </Button>
      </div>
    </header>
  );
};

export default Header;
