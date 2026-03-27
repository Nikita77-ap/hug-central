import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuotesScreen = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data } = await supabase
        .from("encouragement_messages")
        .select("*")
        .eq("active", true);
      if (data) {
        // Shuffle
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuotes(shuffled);
      }
      setLoading(false);
    };
    fetchQuotes();
  }, []);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  if (loading) return <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading quotes...</p>;

  const quote = quotes[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-warm-glow" />
        <h1 className="text-2xl font-display font-bold text-foreground">Motivational Quotes</h1>
      </div>

      <div className="flex items-center justify-center min-h-[300px]">
        <AnimatePresence mode="wait">
          {quote && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 max-w-md"
            >
              <p className="font-serif text-3xl italic text-foreground leading-relaxed">
                "{quote.message}"
              </p>
              <p className="text-sm text-muted-foreground">— Hunguta 💛</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <Button onClick={next} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Next Quote
        </Button>
      </div>
    </div>
  );
};

export default QuotesScreen;
