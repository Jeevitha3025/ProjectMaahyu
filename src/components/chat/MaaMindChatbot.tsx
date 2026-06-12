import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import nurturingAvatar from "@/assets/nurturing-avatar.png";

const MaaMindChatbot = () => {
  const { user, userProfile } = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [isOpen,   setIsOpen]   = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input; // capture before clearing
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:          currentInput,
          uid:              user?.uid              ?? "unknown",
          userName:         userProfile?.name      ?? "Unknown User",
          userEmail:        user?.email            ?? "Unknown",
          emergencyContact: userProfile?.emergencyContact ?? "Not provided",
          emergencyPhone:   userProfile?.emergencyPhone   ?? "Not provided",
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to SheRo 😔" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .maa-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 340px;
          font-family: 'DM Sans', sans-serif;
          z-index: 1000;
        }

        .maa-card {
          background: #fff9f6;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(200, 90, 60, 0.13);
          overflow: hidden;
          border: 1px solid #f5ddd4;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .maa-header {
          background: linear-gradient(135deg, #e8694a 0%, #d4503a 100%);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .maa-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .maa-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255,255,255,0.4);
        flex-shrink: 0;
        }

        .maa-header-text h3 {
          font-family: 'DM Serif Display', serif;
          color: white;
          font-size: 15px;
          margin: 0;
          line-height: 1.2;
        }

        .maa-header-text span {
          color: rgba(255,255,255,0.75);
          font-size: 11px;
          font-weight: 300;
        }

        .maa-online-dot {
          width: 7px;
          height: 7px;
          background: #a8f0c6;
          border-radius: 50%;
          display: inline-block;
          margin-right: 4px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .maa-close {
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .maa-close:hover { background: rgba(255,255,255,0.25); }

        .maa-messages {
          padding: 16px;
          height: 260px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #fff9f6;
        }

        .maa-messages::-webkit-scrollbar { width: 4px; }
        .maa-messages::-webkit-scrollbar-track { background: transparent; }
        .maa-messages::-webkit-scrollbar-thumb { background: #f0c5b5; border-radius: 4px; }

        .maa-empty {
          margin: auto;
          text-align: center;
          color: #c4927f;
        }
        .maa-empty .maa-empty-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .maa-empty p {
          font-size: 13px;
          font-style: italic;
          margin: 0;
          line-height: 1.5;
        }

        .maa-bubble {
          max-width: 82%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 13.5px;
          line-height: 1.5;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .maa-bubble.user {
          background: linear-gradient(135deg, #e8694a, #d4503a);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .maa-bubble.bot {
          background: white;
          color: #3d1f14;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          border: 1px solid #f0ddd6;
          box-shadow: 0 2px 8px rgba(200,90,60,0.06);
        }

        .maa-typing {
          align-self: flex-start;
          background: white;
          border: 1px solid #f0ddd6;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          padding: 12px 16px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .maa-typing span {
          width: 6px;
          height: 6px;
          background: #e8694a;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .maa-typing span:nth-child(2) { animation-delay: 0.2s; }
        .maa-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .maa-footer {
          padding: 12px 14px 14px;
          background: white;
          border-top: 1px solid #f5ddd4;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .maa-input {
          flex: 1;
          border: 1.5px solid #f0d0c4;
          border-radius: 20px;
          padding: 9px 14px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          background: #fff9f6;
          color: #3d1f14;
          outline: none;
          transition: border-color 0.2s;
        }
        .maa-input::placeholder { color: #c9a090; }
        .maa-input:focus { border-color: #e8694a; }

        .maa-send {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8694a, #d4503a);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 3px 10px rgba(232,105,74,0.35);
          flex-shrink: 0;
        }
        .maa-send:hover  { transform: scale(1.07); box-shadow: 0 5px 15px rgba(232,105,74,0.45); }
        .maa-send:active { transform: scale(0.96); }
        .maa-send svg { width: 16px; height: 16px; fill: white; }

        .maa-fab {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8694a, #d4503a);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(232,105,74,0.4);
          font-size: 24px;
          margin-left: auto;
          transition: transform 0.2s;
        }
        .maa-fab:hover { transform: scale(1.08); }
      `}</style>

      <div className="maa-widget">
        {isOpen ? (
          <div className="maa-card">

            {/* Header */}
            <div className="maa-header">
              <div className="maa-header-left">
                <img src={nurturingAvatar} alt="SheRo" className="maa-avatar" style={{ objectFit: "cover", padding: 0 }} />
                <div className="maa-header-text">
                  <h3>SheRo</h3>
                  <span>
                    <span className="maa-online-dot" />
                    Your nurturing companion
                  </span>
                </div>
              </div>
              <button className="maa-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            {/* Messages */}
            <div className="maa-messages">
              {messages.length === 0 ? (
                <div className="maa-empty">
                  <div className="maa-empty-icon">🌸</div>
                  <p>Hi mama, I'm here for you.<br />Ask me anything.</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`maa-bubble ${m.role}`}>
                    {m.content}
                  </div>
                ))
              )}
              {loading && (
                <div className="maa-typing">
                  <span /><span /><span />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="maa-footer">
              <input
                className="maa-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your thoughts..."
              />
              <button className="maa-send" onClick={sendMessage}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </div>

          </div>
        ) : (
          <button className="maa-fab" onClick={() => setIsOpen(true)}>
  <img src={nurturingAvatar} alt="SheRo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
</button>
        )}
      </div>
    </>
  );
};

export default MaaMindChatbot;