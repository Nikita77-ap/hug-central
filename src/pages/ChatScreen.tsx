import { MessageCircle } from "lucide-react";

const ChatScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <MessageCircle className="w-16 h-16 text-muted-foreground/30" />
      <h1 className="text-2xl font-display font-bold text-foreground">Chat Screen</h1>
      <p className="text-muted-foreground text-sm text-center max-w-md">
        Select a conversation from the Chat List to start talking anonymously. 
        Your identity stays private. 🔒
      </p>
    </div>
  );
};

export default ChatScreen;
