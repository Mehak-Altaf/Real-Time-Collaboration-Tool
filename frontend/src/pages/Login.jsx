import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
} from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      if (!data.token || !data.user) {
        setMessage("Login failed. Invalid server response.");
        return;
      }

      localStorage.setItem(
        "collabspace-token",
        data.token
      );

      localStorage.setItem(
        "collabspace-user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "collabspace-user-id",
        data.user.id || data.user._id || ""
      );

      localStorage.setItem(
        "collabspace-email",
        data.user.email || ""
      );

      setMessage("Logged in successfully.");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f3f3f1] font-sans antialiased text-[#232523]">
      <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-12 sm:px-6">

        <div className="w-full max-w-[460px]">

          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-[32px] font-bold tracking-tight text-[#232523]">
              Welcome back
            </h1>

            <p className="text-[15px] text-[#70746c]">
              Login to continue to CollabSpace
            </p>
          </div>

          <div className="rounded-2xl border border-[#dedfdb] bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.04)] sm:p-10">

            <form
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-[14px] font-semibold tracking-wide text-[#3c3f3b]"
                >
                  <Mail
                    size={16}
                    strokeWidth={1.8}
                    className="text-[#777b75]"
                  />

                  <span>Email address</span>
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-[#d9dbd6] bg-white px-4 text-[15px] text-[#242625] outline-none transition placeholder:text-[#a9aca4] focus:border-[#3a3d3b] focus:ring-2 focus:ring-[#3a3d3b]/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-[14px] font-semibold tracking-wide text-[#3c3f3b]"
                >
                  <Lock
                    size={16}
                    strokeWidth={1.8}
                    className="text-[#777b75]"
                  />

                  <span>Password</span>
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-xl border border-[#d9dbd6] bg-white px-4 text-[15px] text-[#242625] outline-none transition placeholder:text-[#a9aca4] focus:border-[#3a3d3b] focus:ring-2 focus:ring-[#3a3d3b]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#2e312f] text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#1f2120] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    <span>Login</span>

                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-xl border border-[#e2e3df] bg-[#f8f8f7] px-4 py-3 text-center text-[14px] font-medium text-[#4b4f47]">
                {message}
              </div>
            )}

            <div className="mt-8 border-t border-[#ebece8] pt-6 text-center">
              <p className="text-[14px] text-[#70746c]">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-[#232523] transition hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;