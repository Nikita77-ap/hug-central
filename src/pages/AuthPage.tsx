import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const encouragements = [
  "You're not alone. We're here for you. 💛",
  "Every feeling is valid. Let it out.",
  "Brave souls share their hearts.",
  "Your story matters, even anonymously.",
  "Healing starts with honesty.",
];

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success("Account created! Check your email to confirm.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back! 🤗");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10"
          >
            <Heart className="w-10 h-10 text-primary" fill="hsl(var(--primary))" />
          </motion.div>
          <h1 className="text-4xl font-bold font-display text-foreground">Hunguta</h1>
          <p className="text-muted-foreground font-serif text-lg italic">
            {randomEncouragement}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-lg border border-border">
          <Input
            type="email"
            placeholder="Your email (kept private)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-background"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "..." : isSignUp ? "Join Hunguta" : "Welcome Back"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary underline font-medium"
            >
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          🔒 Your identity stays anonymous to everyone.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
