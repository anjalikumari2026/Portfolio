import { useState, useEffect, useCallback } from "react";
import contactService from "@/services/contactService";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const inp =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all duration-300";

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diff < 604800000) return date.toLocaleDateString("en-US", { weekday: "short" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatFullDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function getInitials(name) {
  return (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const params = {};
      if (filter === "unread") params.read = "false";
      else if (filter === "read") params.read = "true";
      if (search.trim()) params.search = search.trim();
      const data = await contactService.getMessages(params);
      setMessages(data.contacts || data || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (error) {
      setFetchError(error.message || "Failed to load messages");
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchMessages, 300);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

  const selected = messages.find((m) => m._id === selectedId);

  const handleMarkRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await contactService.markAsRead(id);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
      if (unreadCount > 0) setUnreadCount((c) => c - 1);
    } catch { toast.error("Failed to mark as read"); }
  };

  const handleMarkUnread = async (id, e) => {
    e?.stopPropagation();
    try {
      await contactService.markAsUnread(id);
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: false } : m));
      setUnreadCount((c) => c + 1);
    } catch { toast.error("Failed to mark as unread"); }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this message?")) return;
    try {
      await contactService.deleteMessage(id);
      toast.success("Message deleted");
      if (selectedId === id) setSelectedId(null);
      fetchMessages();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="min-h-screen bg-[#07070e] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-violet-600/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-cyan-400 tracking-[0.3em] uppercase mb-2">Admin</p>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Messages
              {unreadCount > 0 && (
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {unreadCount} unread
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-48 sm:w-56 pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500/40 transition-all"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setSelectedId(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader /></div>
        ) : fetchError ? (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-sm mb-4">{fetchError}</p>
            <button onClick={fetchMessages} className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all">Retry</button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="text-5xl mb-4">{search ? "🔍" : "💬"}</div>
            <p className="text-sm">{search ? "No messages match your search." : "No messages yet. Messages from your contact form will appear here."}</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_420px] gap-6">
            {/* List */}
            <div className="space-y-2">
              {messages.map((msg) => {
                const isSelected = selectedId === msg._id;
                return (
                  <div
                    key={msg._id}
                    onClick={() => setSelectedId(msg._id)}
                    className={`group relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-cyan-500/30 bg-cyan-500/5"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        msg.read
                          ? "bg-white/[0.04] text-slate-500"
                          : "bg-cyan-500/10 text-cyan-300"
                      }`}>
                        {getInitials(msg.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-sm truncate ${msg.read ? "text-slate-400" : "text-white font-semibold"}`}>
                              {msg.name}
                            </span>
                            {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                          </div>
                          <span className="text-[11px] text-slate-600 shrink-0">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mb-1">{msg.email}</p>
                        {msg.subject && (
                          <p className="text-xs text-slate-400 truncate mb-0.5">{msg.subject}</p>
                        )}
                        <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                      </div>
                      {/* Hover actions */}
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {msg.read ? (
                          <button onClick={(e) => handleMarkUnread(msg._id, e)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-500 hover:text-cyan-400 transition-colors" title="Mark unread">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </button>
                        ) : (
                          <button onClick={(e) => handleMarkRead(msg._id, e)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-500 hover:text-cyan-400 transition-colors" title="Mark read">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        )}
                        <button onClick={(e) => handleDelete(msg._id, e)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            {selected ? (
              <div className="p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm h-fit lg:sticky lg:top-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-base font-bold shrink-0">
                    {getInitials(selected.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-sm text-cyan-300 hover:underline">{selected.email}</a>
                    <p className="text-xs text-slate-500 mt-0.5">{formatFullDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {selected.read ? (
                      <button onClick={(e) => handleMarkUnread(selected._id, e)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-cyan-400 transition-colors" title="Mark unread">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </button>
                    ) : (
                      <button onClick={(e) => handleMarkRead(selected._id, e)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-cyan-400 transition-colors" title="Mark read">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </button>
                    )}
                    <button onClick={(e) => handleDelete(selected._id, e)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {selected.subject && (
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-xs text-slate-500 mb-1">Subject</p>
                      <p className="text-sm text-slate-200 font-medium">{selected.subject}</p>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-xs text-slate-500 mb-2">Message</p>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || ""}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Quick Reply
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-dashed border-white/[0.06] bg-white/[0.02] flex flex-col items-center justify-center text-center h-48">
                <div className="text-4xl mb-3">📩</div>
                <p className="text-sm text-slate-500">Select a message to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
