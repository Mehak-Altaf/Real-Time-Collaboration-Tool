import { Users } from "lucide-react";

function UserList({
  users = [],
  currentUser = "",
}) {
  return (
    <aside className="hidden w-[260px] shrink-0 border-l border-[#dedfdd] bg-[#fafafa] lg:block">
      
      {/* Header */}
      <div className="border-b border-[#dedfdd] px-5 py-4">
        <div className="flex items-center gap-2">
          <Users
            size={16}
            strokeWidth={1.8}
            className="text-[#666a68]"
          />

          <h2 className="text-sm font-semibold text-[#353836]">
            Members
          </h2>
        </div>

        <p className="mt-1 text-[11px] text-[#858987]">
          {users.length}{" "}
          {users.length === 1
            ? "person"
            : "people"}{" "}
          online
        </p>
      </div>

      {/* User List */}
      <div className="space-y-1 p-3">
        {users.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f0ee] text-[#a0a3a1]">
              <Users
                size={19}
                strokeWidth={1.7}
              />
            </div>

            <p className="mt-3 text-xs text-[#858987]">
              No members connected
            </p>
          </div>
        ) : (
          users.map((user, index) => {
            const name =
              typeof user === "string"
                ? user
                : user?.name || "Guest";

            const id =
              user?.id ||
              user?._id ||
              `${name}-${index}`;

            const isCurrentUser =
              name === currentUser;

            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#f0f0ee]"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                      isCurrentUser
                        ? "bg-[#444744] text-white"
                        : "bg-[#dedfdd] text-[#555957]"
                    }`}
                  >
                    {name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#fafafa] bg-[#777b78]" />
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#353836]">
                    {name}
                  </p>

                  <p className="text-[10px] text-[#929593]">
                    Online
                  </p>
                </div>

                {/* Current User */}
                {isCurrentUser && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#777b78]">
                    You
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Room Status */}
      <div className="mx-4 mt-3 border-t border-[#dedfdd] pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#9a9d9b]">
            Status
          </span>

          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#777b78]" />

            <span className="text-[10px] font-medium text-[#777b78]">
              Live
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default UserList;