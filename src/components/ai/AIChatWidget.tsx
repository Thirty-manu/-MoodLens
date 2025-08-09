import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you with your mood tracking and wellness journey today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Define the URL for your Supabase Edge Function.
  const SUPABASE_FUNCTION_URL = "https://oqisybajiiosxvpiuisb.supabase.co/functions/v1/ai-worker";

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create a new user message and add it to the state immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    // Prepare the conversation history for the API call
    const chatHistory = updatedMessages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // The payload now only contains the chat history to be sent to the Edge Function.
    const payload = {
      contents: chatHistory,
    };

    const maxRetries = 3;
    let retries = 0;
    let response;

    // Implement exponential backoff for retries
    while (retries < maxRetries) {
      try {
        response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          // Success, break out of the retry loop
          break;
        } else if (response.status === 429 || response.status >= 500) {
          // Retry on rate limit or server errors
          retries++;
          const delay = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Don't retry on other client-side errors like 400
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error during fetch, retrying:", error);
        retries++;
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Process the final response (or the last failed response)
    try {
      if (!response || !response.ok) {
        throw new Error(`Final attempt failed. HTTP error! Status: ${response?.status} - ${response?.statusText}`);
      }

      const result = await response.json();
      const aiResponseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponseText) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponseText,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error("Gemini API response was malformed:", result);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I couldn't generate a response. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error calling Supabase Edge Function:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${error.message}. Please check your Supabase function and try again.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <Card 
          className={cn(
            "mb-4 w-80 h-96 bg-card/95 backdrop-blur-sm border-border shadow-lg transition-all duration-300",
            isMinimized ? "h-12" : "h-96"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-medium text-foreground">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeWidget}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-64" ref={scrollAreaRef}>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-lg text-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your wellness..."
                    className="flex-1 min-h-[40px] max-h-20 resize-none"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={toggleWidget}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent",
          "text-primary-foreground"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};
