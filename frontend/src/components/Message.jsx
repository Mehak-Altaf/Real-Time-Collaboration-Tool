function Message({ user, text }) {
  const safeUser =
    typeof user === "string"
      ? user
      : user?.name || "Guest";

  const safeText =
    typeof text === "string"
      ? text
      : "";

  if (!safeText.trim()) {
    return null;
  }

  return (
    <div className="flex gap-3 rounded-xl px-3 py-3 transition hover:bg-[#f5f5f4]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4a4d4b] text-xs font-semibold text-white">
        {safeUser.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#303331]">
            {safeUser}
          </span>

          <span className="text-[11px] text-[#9a9d9b]">
            now
          </span>
        </div>

        <p className="mt-1 break-words text-sm leading-6 text-[#666a68]">
          {safeText}
        </p>
      </div>
    </div>
  );
}

export default Message;