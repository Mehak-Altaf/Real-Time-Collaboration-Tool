import { MessageSquare } from "lucide-react";

function Sidebar() {
  return (
    <aside className="hidden w-[190px] shrink-0 border-r border-[#dedfdd] bg-[#f4f5f3] md:block">
      <div className="px-3 py-5">
        {/* SECTION TITLE */}
        <div className="mb-3 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a8d8b]">
            Workspace
          </p>
        </div>

        {/* CHAT */}
        <nav>
          <button className="flex h-10 w-full items-center gap-3 rounded-lg border border-[#d9dbd9] bg-white px-3 text-left text-sm font-semibold text-[#303331] shadow-[0_2px_5px_rgba(0,0,0,0.025)]">
            <MessageSquare
              size={17}
              strokeWidth={1.8}
              className="text-[#4e524f]"
            />

            <span>Chat</span>
          </button>
        </nav>
      </div>

      {/* BOTTOM INFO */}
      <div className="absolute bottom-0 w-[190px] border-t border-[#dedfdd] bg-[#f4f5f3] px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#444744] text-white">
            <MessageSquare
              size={12}
              strokeWidth={1.8}
            />
          </div>

          <p className="text-[11px] font-semibold text-[#70746f]">
            CollabSpace
          </p>
        </div>

        <p className="mt-2 text-[10px] leading-4 text-[#999c9a]">
          Simple real-time communication
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;