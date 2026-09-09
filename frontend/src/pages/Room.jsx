import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Hash,
  Send,
  Users,
  Copy,
  Check,
  Wifi,
  WifiOff,
  MessageSquare,
  X,
  ArrowLeft,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import socket from "../socket";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const getLoggedInUser = () => {
  const savedUser = localStorage.getItem("collabspace-user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Invalid user data");
    return null;
  }
};

const normalizeMessage = (raw) => {
  if (!raw) return null;

  let user = "Guest";
  let text = "";

  if (typeof raw.user === "string") {
    user = raw.user;
  } else if (raw.user && typeof raw.user === "object") {
    user =
      raw.user.name ||
      raw.user.username ||
      raw.user.email ||
      "Guest";
  } else if (typeof raw.name === "string") {
    user = raw.name;
  }

  if (typeof raw.text === "string") {
    text = raw.text;
  } else if (typeof raw.message === "string") {
    text = raw.message;
  } else if (typeof raw.content === "string") {
    text = raw.content;
  }

  return {
    ...raw,
    user,
    text,
  };
};

const normalizeUser = (raw) => {
  if (!raw) {
    return {
      id: Math.random().toString(),
      name: "Guest",
    };
  }

  if (typeof raw === "string") {
    return {
      id: raw,
      name: raw,
    };
  }

  return {
    id:
      raw.id ||
      raw._id ||
      raw.userId ||
      raw.socketId ||
      raw.name ||
      Math.random().toString(),

    name:
      raw.name ||
      raw.username ||
      raw.user?.name ||
      raw.email ||
      "Guest",
  };
};

const getInitial = (name) => {
  if (!name || typeof name !== "string") {
    return "G";
  }

  return name.trim().charAt(0).toUpperCase();
};

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const loggedInUser = getLoggedInUser();
  const userName = loggedInUser?.name || "Guest";

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/messages?roomId=${encodeURIComponent(roomId)}`
        );

        if (!response.ok) {
          throw new Error("Failed to load messages");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const cleanMessages = data
            .map(normalizeMessage)
            .filter(
              (item) =>
                item &&
                typeof item.text === "string" &&
                item.text.trim() !== ""
            );

          setMessages(cleanMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("MESSAGE LOAD ERROR:", err);
        setError("Could not load previous messages.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      setError("");

      socket.emit("join-room", {
        roomId,
        userName,
      });
    };

    const handleConnectError = (err) => {
      console.error("SOCKET ERROR:", err);

      setConnected(false);

      setError(
        "Real-time connection failed. Please check your backend."
      );
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleReceiveMessage = (rawMessage) => {
      const cleanMessage = normalizeMessage(rawMessage);

      if (
        !cleanMessage ||
        !cleanMessage.text ||
        !cleanMessage.text.trim()
      ) {
        return;
      }

      setMessages((previous) => [...previous, cleanMessage]);
    };

    const handleRoomUsers = (rawUsers) => {
      if (!Array.isArray(rawUsers)) {
        setUsers([]);
        return;
      }

      const cleanUsers = rawUsers
        .map(normalizeUser)
        .filter((user) => user.name);

      setUsers(cleanUsers);
    };

    const handleTyping = (rawUser) => {
      let name = "";

      if (typeof rawUser === "string") {
        name = rawUser;
      } else if (rawUser?.name) {
        name = rawUser.name;
      } else if (rawUser?.userName) {
        name = rawUser.userName;
      } else if (rawUser?.user?.name) {
        name = rawUser.user.name;
      }

      if (name && name !== userName) {
        setTypingUser(name);
      }
    };

    const handleStopTyping = () => {
      setTypingUser("");
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("room-users", handleRoomUsers);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("room-users", handleRoomUsers);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      socket.disconnect();
    };
  }, [roomId, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (err) {
      console.error("COPY ERROR:", err);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    if (!connected) {
      setError("You are not connected to the room yet.");
      return;
    }

    const messageData = {
      roomId,
      user: userName,
      text: cleanMessage,
    };

    socket.emit("send-message", messageData);

    socket.emit("stop-typing", {
      roomId,
      userName,
    });

    setMessage("");
    setTypingUser("");
  };

  const handleTyping = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (!connected || !value.trim()) {
      socket.emit("stop-typing", {
        roomId,
        userName,
      });

      return;
    }

    socket.emit("typing", {
      roomId,
      userName,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", {
        roomId,
        userName,
      });
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-68px)] flex-col overflow-hidden bg-[#f1f2f0] text-[#303331]">
      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col bg-[#f7f7f6]">
          <div className="flex min-h-[68px] shrink-0 items-center justify-between border-b border-[#dedfdd] bg-[#fbfbfa] px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#d9dbd9] bg-white text-[#737774] transition hover:bg-[#f1f1ef] hover:text-[#303331]"
                title="Back"
              >
                <ArrowLeft size={17} strokeWidth={1.8} />
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#414441] text-white shadow-sm">
                <MessageSquare size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-[15px] font-semibold text-[#303331] sm:text-base">
                  Team Chat
                </h1>

                <div className="mt-1 flex items-center gap-1.5">
                  {connected ? (
                    <>
                      <Wifi
                        size={12}
                        className="text-[#666a68]"
                      />
                      <span className="text-[11px] font-medium text-[#777b78]">
                        Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff
                        size={12}
                        className="text-[#999d9a]"
                      />
                      <span className="text-[11px] text-[#858987]">
                        Disconnected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyRoomId}
                className="hidden h-9 items-center gap-2 rounded-lg border border-[#d9dbd9] bg-white px-3 text-xs font-medium text-[#777b78] transition hover:border-[#c9cbc9] hover:bg-[#f4f4f2] hover:text-[#454846] sm:flex"
              >
                <Hash size={14} />

                <span>
                  Room{" "}
                  <span className="font-semibold text-[#353836]">
                    {roomId}
                  </span>
                </span>

                {copied ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>

              <div className="flex h-9 items-center gap-2 rounded-lg border border-[#d9dbd9] bg-white px-3 text-xs font-medium text-[#777b78]">
                <Users size={14} />

                <span className="font-semibold text-[#454846]">
                  {users.length}
                </span>

                <span className="hidden sm:inline">
                  online
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <section className="flex min-w-0 flex-1 flex-col">
              {error && (
                <div className="mx-4 mt-4 flex items-start justify-between gap-3 rounded-lg border border-[#d9dbd9] bg-white px-4 py-3 text-xs text-[#686c69] shadow-sm sm:mx-6">
                  <p>{error}</p>

                  <button
                    onClick={() => setError("")}
                    className="text-[#858987] transition hover:text-[#343735]"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#dedfdd] border-t-[#666a68]" />

                      <p className="text-xs text-[#858987]">
                        Loading messages...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-[410px] rounded-2xl border border-[#dedfdd] bg-white px-8 py-9 text-center shadow-[0_8px_25px_rgba(0,0,0,0.035)]">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f1ef] text-[#666a68]">
                        <MessageSquare
                          size={21}
                          strokeWidth={1.7}
                        />
                      </div>

                      <h2 className="mt-5 text-[17px] font-semibold text-[#303331]">
                        Welcome to Team Chat
                      </h2>

                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#858987]">
                        Start a conversation with everyone
                        in this room. Your messages will
                        appear here in real time.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-3xl space-y-1">
                    {messages.map((item, index) => {
                      const safeUser =
                        typeof item.user === "string"
                          ? item.user
                          : item.user?.name || "Guest";

                      const safeText =
                        typeof item.text === "string"
                          ? item.text
                          : "";

                      if (!safeText.trim()) {
                        return null;
                      }

                      const isOwnMessage =
                        safeUser === userName;

                      const messageKey =
                        item._id ||
                        item.id ||
                        `${safeUser}-${safeText}-${index}`;

                      return (
                        <div
                          key={messageKey}
                          className={`group flex gap-3 rounded-xl px-3 py-3 transition ${
                            isOwnMessage
                              ? "bg-[#e9eae8]"
                              : "hover:bg-[#f1f1ef]"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              isOwnMessage
                                ? "bg-[#414441] text-white"
                                : "bg-[#dedfdd] text-[#555957]"
                            }`}
                          >
                            {getInitial(safeUser)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-[#353836]">
                                {safeUser}
                              </span>

                              {isOwnMessage && (
                                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#777b78]">
                                  You
                                </span>
                              )}
                            </div>

                            <p className="mt-1 break-words text-sm leading-6 text-[#666a68]">
                              {safeText}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {typingUser && (
                      <div className="flex items-center gap-3 px-3 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dedfdd] text-xs font-semibold text-[#666a68]">
                          {getInitial(typingUser)}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#858987]">
                          <span className="font-medium text-[#555957]">
                            {typingUser}
                          </span>

                          <span>is typing...</span>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-[#dedfdd] bg-[#fbfbfa] px-4 py-4 sm:px-6">
                <form
                  onSubmit={handleSendMessage}
                  className="mx-auto w-full max-w-3xl"
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-[#d8dad8] bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.035)] transition focus-within:border-[#bfc2bf] focus-within:shadow-[0_5px_20px_rgba(0,0,0,0.05)]">
                    <textarea
                      value={message}
                      onChange={handleTyping}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder={
                        connected
                          ? "Write a message..."
                          : "Connecting to room..."
                      }
                      disabled={!connected}
                      className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-5 text-[#303331] outline-none placeholder:text-[#a0a3a1] disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="submit"
                      disabled={
                        !connected || !message.trim()
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#414441] text-white transition hover:bg-[#303331] disabled:cursor-not-allowed disabled:opacity-30"
                      title="Send message"
                    >
                      <Send
                        size={16}
                        strokeWidth={1.9}
                      />
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[10px] text-[#999c9a]">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </form>
              </div>
            </section>

            <aside className="hidden w-[250px] shrink-0 border-l border-[#dedfdd] bg-[#fbfbfa] lg:block">
              <div className="border-b border-[#dedfdd] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-[#666a68]"
                    />

                    <h2 className="text-sm font-semibold text-[#353836]">
                      Members
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#eeeeec] px-2 py-1 text-[10px] font-semibold text-[#777b78]">
                    {users.length}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-[#858987]">
                  People currently in this room
                </p>
              </div>

              <div className="space-y-1.5 p-3">
                {users.length === 0 ? (
                  <div className="px-3 py-10 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f0ee] text-[#a0a3a1]">
                      <Users size={18} />
                    </div>

                    <p className="mt-3 text-xs text-[#858987]">
                      No members connected
                    </p>
                  </div>
                ) : (
                  users.map((user) => {
                    const safeName =
                      typeof user.name === "string"
                        ? user.name
                        : "Guest";

                    const isCurrentUser =
                      safeName === userName;

                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#f0f0ee]"
                      >
                        <div className="relative">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dedfdd] text-xs font-semibold text-[#555957]">
                            {getInitial(safeName)}
                          </div>

                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#fbfbfa] bg-[#70746f]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#353836]">
                            {safeName}
                          </p>

                          <p className="text-[10px] text-[#929593]">
                            Online
                          </p>
                        </div>

                        {isCurrentUser && (
                          <span className="text-[10px] font-medium text-[#858987]">
                            You
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mx-4 mt-3 rounded-xl border border-[#dedfdd] bg-[#f1f2f0] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858987]">
                  Room ID
                </p>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[#353836]">
                    {roomId}
                  </span>

                  <button
                    onClick={copyRoomId}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#777b78] transition hover:bg-white hover:text-[#444744]"
                    title="Copy room ID"
                  >
                    {copied ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Room;