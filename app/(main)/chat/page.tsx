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
import { timeAgo, cn } from "@/lib/utils";
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
    const supabase = createClient();
    const { data } = await supabase
      .from("conversations")
      .select("*, listing:listings(id, title, images), buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url), seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)")
      .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
      .order("last_message_at", { ascending: false });
    setConversations((data as Conversation[]) || []);
    setLoading(false);
  }

  async function loadMessages(convoId: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(full_name, avatar_url)")
      .eq("conversation_id", convoId)
      .order("created_at", { ascending: true });
    setMessages((data as Message[]) || []);

    // Mark as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", convoId)
      .neq("sender_id", user!.id)
      .eq("is_read", false);
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
            // Fetch sender profile
            const { data: sender } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", msg.sender_id)
              .single();
            const msgWithSender = { ...msg, sender: (sender || undefined) as Message["sender"] };
            setMessages((prev) => [...prev, msgWithSender]);
            await supabase.from("messages").update({ is_read: true }).eq("id", msg.id);
          }
        }
      )
      .subscribe();
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeConvo || !user) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("messages").insert({
      conversation_id: activeConvo.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });
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
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setActiveConvo(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex", isMine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        isMine
                          ? "bg-brand-600 text-white rounded-br-md"
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
                  </div>
                );
              })}
              <div ref={messagesEnd} />
            </div>

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
