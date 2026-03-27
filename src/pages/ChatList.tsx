import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ChatList = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (data) {
        // Group by conversation partner
        const convMap = new Map<string, any>();
        data.forEach((msg) => {
          const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!convMap.has(partnerId)) {
            convMap.set(partnerId, { partnerId, lastMessage: msg, unread: 0 });
          }
          if (!msg.read && msg.receiver_id === user.id) {
            const conv = convMap.get(partnerId);
            conv.unread++;
          }
        });
        setConversations(Array.from(convMap.values()));
      }
      setLoading(false);
    };
    fetchConversations();
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-bold text-foreground">Anonymous Chats</h1>
      <p className="text-muted-foreground text-sm">Private, anonymous conversations 🔒</p>
      {loading ? (
        <p className="text-center py-10 text-muted-foreground animate-pulse-warm">Loading chats...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="font-serif text-lg text-muted-foreground">No conversations yet</p>
          <p className="text-sm text-muted-foreground">Start by sending a message on someone's post</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <motion.div
              key={conv.partnerId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  ?
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Anonymous User</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                </p>
                {conv.unread > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] bg-primary text-primary-foreground rounded-full mt-1">
                    {conv.unread}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
