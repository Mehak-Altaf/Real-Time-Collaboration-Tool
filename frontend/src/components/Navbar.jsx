import { LogOut, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("collabspace-user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("collabspace-token");
    localStorage.removeItem("collabspace-user");
    localStorage.removeItem("collabspace-user-id");
    localStorage.removeItem("collabspace-email");

    navigate("/login");
  };

  return (
    <header className="w-full border-b border-[#d6d6d3] bg-[#e8e8e5]">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#363936] text-white shadow-sm">
            <Video
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[18px] font-bold tracking-tight text-[#232523]">
            CollabSpace
          </span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <span className="hidden text-sm font-medium text-[#4d504b] sm:block">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#4d504b] transition hover:bg-[#dcdcd9]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#4d504b] transition hover:text-[#232523]"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-[#303330] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#222522]"
              >
                Sign up
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;