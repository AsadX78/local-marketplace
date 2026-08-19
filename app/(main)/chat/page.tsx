"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { timeAgo, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Conversation, Message } from "@/lib/types";

export default function ChatPage() {
  const { user } = useAuth();
  const params = useSearchParams();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const messagesEnd = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  // Auto-create conversation when arriving with ?listing=<id>
  React.useEffect(() => {
    if (!user) return;
    const listingId = params.get("listing");
    if (!listingId) return;

    async function initConversation() {
      // Fetch listing to get seller_id
      const listingRes = await fetch(`/api/listings/${listingId}`);
      if (!listingRes.ok) return;
      const { data: listing } = await listingRes.json();
      if (!listing?.user_id || listing.user_id === user!.id) return;

      // Create or find conversation
      const convoRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, seller_id: listing.user_id }),
      });
      if (!convoRes.ok) return;
      const { data: convo } = await convoRes.json();
      if (!convo?.id) return;

      // Build a minimal conversation object and select it immediately
      setActiveConvo({
        id: convo.id,
        buyer_id: user!.id,
        seller_id: listing.user_id,
        listing_id: listingId,
        listing: { id: listing.id, title: listing.title, price: listing.price, images: listing.images, status: listing.status },
        buyer: undefined,
        seller: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: null,
      } as unknown as Conversation);

      // Reload sidebar in background
      loadConversations();
    }

    initConversation();
  }, [user, params]);

  React.useEffect(() => {
    if (!activeConvo?.id) return;
    loadMessages(activeConvo.id);
    const sub = subscribeToMessages(activeConvo.id);
    return () => { sub?.unsubscribe(); };
  }, [activeConvo?.id]);

  React.useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const { data } = await res.json();
      setConversations((data as Conversation[]) || []);
    }
    setLoading(false);
  }

  async function loadMessages(convoId: string) {
    const res = await fetch(`/api/chat/${convoId}/messages`);
    if (res.ok) {
      const { data } = await res.json();
      setMessages((data as Message[]) || []);
    }
  }

  function subscribeToMessages(convoId: string) {
    const supabase = createClient();
    return supabase
      .channel(`messages:${convoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convoId}` },
        async (payload) => {
          const msg = payload.new as Message;
          if (msg.sender_id !== user!.id) {
            const res = await fetch(`/api/auth/me`);
            if (res.ok) {
              const { profile } = await res.json();
              const msgWithSender = { ...msg, sender: profile || undefined } as Message;
              setMessages((prev) => [...prev, msgWithSender]);
            } else {
              setMessages((prev) => [...prev, msg]);
            }
          }
        }
      )
      .subscribe();
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeConvo || !user) return;
    setSending(true);
    const res = await fetch(`/api/chat/${activeConvo.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage.trim() }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setMessages((prev) => [...prev, data]);
    }
    setNewMessage("");
    setSending(false);
  }

  function getOther(convo: Conversation) {
    if (user?.id === convo.buyer_id) return convo.seller;
    return convo.buyer;
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Please login to access messages.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Messages</h1>
      <div className="grid h-[70vh] overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-[300px_1fr]">
        {/* Conversations list */}
        <div
          className={cn(
            "border-r border-gray-200 overflow-y-auto",
            activeConvo ? "hidden lg:block" : "block"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : conversations.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <MessageSquare className="mx-auto h-10 w-10" />
              <p className="mt-3 text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((convo) => {
              const other = getOther(convo);
              return (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvo(convo)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                    activeConvo?.id === convo.id && "bg-brand-50"
                  )}
                >
                  <Avatar
                    src={other?.avatar_url ?? undefined}
                    alt={other?.full_name ?? undefined}
                    fallback={other?.full_name?.charAt(0) ?? undefined}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {other?.full_name || "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {convo.listing?.title || "Chat"}
                    </p>
                    {convo.last_message_at && (
                      <p className="text-[10px] text-gray-400">
                        {timeAgo(convo.last_message_at)}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Messages */}
        {activeConvo ? (
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setActiveConvo(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <Avatar
                src={getOther(activeConvo)?.avatar_url ?? undefined}
                alt={getOther(activeConvo)?.full_name ?? undefined}
                fallback={getOther(activeConvo)?.full_name?.charAt(0) ?? undefined}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getOther(activeConvo)?.full_name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {activeConvo.listing?.title || ""}
                </p>
              </div>
            </div>

            {/* Message list */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === user.id;
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={cn("flex", isMine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            isMine
                              ? "bg-brand-600 text-white rounded-br-md shadow-brand-600/20"
                              : "bg-gray-100 text-gray-900 rounded-bl-md"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <p
                            className={cn(
                              "mt-1 text-[10px]",
                              isMine ? "text-brand-200" : "text-gray-400"
                            )}
                          >
                            {timeAgo(msg.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEnd} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-gray-200 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  maxLength={2000}
                />
                <Button type="submit" variant="brand" size="icon" disabled={sending || !newMessage.trim()}>
                  {sending ? <Spinner size="sm" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12" />
              <p className="mt-3">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
