import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem(
      "collabspace-user"
    );

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("collabspace-user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const joinRoom = () => {
    const trimmedRoomId = roomId.trim();

    if (!trimmedRoomId) return;

    navigate(`/room/${trimmedRoomId}`);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f3f1] px-5 text-[#303331]">
        <div className="w-full max-w-sm rounded-2xl border border-[#dedfdd] bg-white p-8 text-center shadow-[0_12px_35px_rgba(0,0,0,0.06)]">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#444744] text-white">
            <MessageSquare size={21} />
          </div>

          <h1 className="text-xl font-semibold text-[#303331]">
            Login required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#858987]">
            Please login to continue to
            CollabSpace.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-[#444744] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#343735]"
          >
            Go to Login
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f3f1] text-[#292c2a]">

      <Navbar />

      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">

        <div className="w-full max-w-[560px]">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#dcdedc] bg-white text-[#555957] shadow-sm">
              <Users
                size={24}
                strokeWidth={1.7}
              />
            </div>

            <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8a8d8b]">
              Collaboration workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#292c2a] sm:text-4xl">
              Welcome, {user.name}
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7b7f7c]">
              Join a room and start communicating
              with your team in real time.
            </p>

          </div>

          <div className="rounded-2xl border border-[#dedfdd] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-8">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f0ee] text-[#555957]">
                <MessageSquare
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#303331]">
                  Join a room
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#858987]">
                  Enter the room ID shared by
                  your team.
                </p>
              </div>

            </div>

            <div className="mt-7">

              <label
                htmlFor="roomId"
                className="mb-2 block text-xs font-semibold text-[#555957]"
              >
                Room ID
              </label>

              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) =>
                  setRoomId(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    joinRoom();
                  }
                }}
                placeholder="e.g. team-123"
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-[#d9dbd9] bg-[#f8f8f7] px-4 text-sm text-[#303331] outline-none transition placeholder:text-[#a0a3a1] focus:border-[#8c908d] focus:bg-white focus:ring-2 focus:ring-[#8c908d]/10"
              />

            </div>

            <button
              type="button"
              onClick={joinRoom}
              disabled={!roomId.trim()}
              className="group mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#444744] px-4 text-sm font-semibold text-white transition hover:bg-[#343735] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>Join Room</span>

              <ArrowRight
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>

          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#929593]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#777b78]" />

            <span>
              Real-time messaging enabled
            </span>
          </div>

        </div>

      </main>

      <footer className="border-t border-[#dedfdd] bg-[#fafafa] px-5 py-4">
        <p className="text-center text-[11px] text-[#969997]">
          CollabSpace · Real-time collaboration workspace
        </p>
      </footer>

    </div>
  );
}

export default Home;