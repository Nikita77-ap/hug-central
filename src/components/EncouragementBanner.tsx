import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const EncouragementBanner = () => {
  const [message, setMessage] = useState("");

  const fetchRandom = async () => {
    const { data } = await supabase
      .from("encouragement_messages")
      .select("message")
      .eq("active", true);
    if (data && data.length > 0) {
      setMessage(data[Math.floor(Math.random() * data.length)].message);
    }
  };

  useEffect(() => {
    fetchRandom();
    const interval = setInterval(fetchRandom, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="text-center py-4"
      >
        <p className="font-serif text-lg italic text-muted-foreground">
          {message}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default EncouragementBanner;
