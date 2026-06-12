import React, { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Send } from "lucide-react";
import { User } from "firebase/auth";

interface Group {
  id: string;
  name: string;
  icon: string;
  description: string;
  region: string;
}

interface Message {
  id: string;
  userId: string;
  displayName: string;
  message: string;
  timestamp: Timestamp | null;
  isAnonymous: boolean;
}

interface GroupChatProps {
  group: Group;
  currentUser: User;
}

const GroupChat: React.FC<GroupChatProps> = ({ group, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getAnonymousName = (): string => {
    const key = `anon_name_${currentUser.uid}`;
    let name = localStorage.getItem(key);
    if (!name) {
      const randomNum = Math.floor(Math.random() * 9999);
      name = `Member ${randomNum}`;
      localStorage.setItem(key, name);
    }
    return name;
  };

  useEffect(() => {
    const messagesRef = collection(db, "groups", group.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesList: Message[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          messagesList.push({
            id: doc.id,
            userId: data.userId || "",
            displayName: data.displayName || "User",
            message: data.message || "",
            timestamp: data.timestamp || null,
            isAnonymous: data.isAnonymous || false,
          });
        });

        setMessages(messagesList);
        setLoading(false);

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [group.id]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const messagesRef = collection(db, "groups", group.id, "messages");
      await addDoc(messagesRef, {
        userId: currentUser.uid,
        displayName: isAnonymous 
          ? getAnonymousName() 
          : currentUser.displayName || "User",
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        isAnonymous,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 h-96 flex items-center justify-center border border-rose-100">
        <p className="text-rose-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[calc(100vh-200px)] border border-rose-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-6 border-b border-rose-200">
        <h2 className="text-xl font-semibold text-rose-900 mb-1">{group.name}</h2>
        <p className="text-sm text-rose-700">{group.description}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-rose-50">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-rose-700 font-medium">No messages yet</p>
              <p className="text-sm text-rose-600 mt-1">Be the first to share your thoughts</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${
                msg.userId === currentUser.uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.userId === currentUser.uid
                    ? "bg-rose-400 text-white"
                    : "bg-rose-100 text-rose-900"
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${
                  msg.userId === currentUser.uid 
                    ? "text-rose-200" 
                    : "text-rose-700"
                }`}>
                  {msg.displayName}
                </div>
                
                <p className="text-sm break-words">{msg.message}</p>

                <div className={`text-xs mt-2 ${
                  msg.userId === currentUser.uid 
                    ? "text-rose-200" 
                    : "text-rose-600"
                }`}>
                  {msg.timestamp?.toDate?.()?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' }) || "now"}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-rose-200 p-4 bg-white space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-rose-400"
          />
          <label htmlFor="anonymous" className="text-sm text-rose-700 cursor-pointer">
            Post anonymously
          </label>
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 rounded-lg border border-rose-200 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 text-sm"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-rose-400 hover:bg-rose-500 disabled:bg-rose-200 text-white p-2 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;