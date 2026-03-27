import { Bell, Heart, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

const sampleNotifications = [
  { id: 1, icon: Heart, text: "Someone sent you a hug 🤗", time: "2 min ago", color: "text-hug-pink" },
  { id: 2, icon: MessageCircle, text: "Someone replied to your post", time: "15 min ago", color: "text-soft-blue" },
  { id: 3, icon: Star, text: "You helped someone today 💙", time: "1 hour ago", color: "text-warm-glow" },
  { id: 4, icon: Bell, text: "How are you feeling today?", time: "3 hours ago", color: "text-calm-green" },
  { id: 5, icon: Heart, text: "You are doing great 💛", time: "Yesterday", color: "text-primary" },
];

const Notifications = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Notifications</h1>
      <div className="space-y-2">
        {sampleNotifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center ${n.color}`}>
              <n.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{n.text}</p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
