import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Lock,
  Mail,
  User,
} from "lucide-react";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Signup failed"
        );

        setLoading(false);
        return;
      }

      setMessage(
        "Account created successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 900);

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setMessage(
        "Server connection failed."
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f3f3f1] font-sans antialiased text-[#232523]">

      {/* MAIN CONTENT */}
      <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-12 sm:px-6">

        <div className="w-full max-w-[460px]">

          {/* HEADER */}
          <div className="mb-8 space-y-2 text-center">

            <h1 className="text-[32px] font-bold tracking-tight text-[#232523]">
              Create your account
            </h1>

            <p className="text-[15px] text-[#70746c]">
              Join CollabSpace and start collaborating
            </p>

          </div>

          {/* CARD */}
          <div className="rounded-2xl border border-[#dedfdb] bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.04)] sm:p-10">

            <form
              onSubmit={handleSignup}
              className="space-y-6"
            >

              {/* NAME */}
              <div className="space-y-2">

                <label
                  htmlFor="name"
                  className="block text-[15px] font-semibold tracking-wide text-[#3c3f3b]"
                >
                  Full name
                </label>

                <div className="relative flex items-center">

                  <span className="pointer-events-none absolute left-4 z-10 text-[#8d9088]">
                    <User
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                    style={{
                      paddingLeft: "3.2rem",
                      backgroundColor: "#ffffff",
                    }}
                    className="h-12 w-full rounded-xl border border-[#d9dbd6] pr-4 text-[15px] text-[#242625] outline-none transition placeholder:text-[#a9aca4] focus:border-[#3a3d3b] focus:ring-2 focus:ring-[#3a3d3b]/10"
                  />

                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="block text-[15px] font-semibold tracking-wide text-[#3c3f3b]"
                >
                  Email address
                </label>

                <div className="relative flex items-center">

                  <span className="pointer-events-none absolute left-4 z-10 text-[#8d9088]">
                    <Mail
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    style={{
                      paddingLeft: "3.2rem",
                      backgroundColor: "#ffffff",
                    }}
                    className="h-12 w-full rounded-xl border border-[#d9dbd6] pr-4 text-[15px] text-[#242625] outline-none transition placeholder:text-[#a9aca4] focus:border-[#3a3d3b] focus:ring-2 focus:ring-[#3a3d3b]/10"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">

                <label
                  htmlFor="password"
                  className="block text-[15px] font-semibold tracking-wide text-[#3c3f3b]"
                >
                  Password
                </label>

                <div className="relative flex items-center">

                  <span className="pointer-events-none absolute left-4 z-10 text-[#8d9088]">
                    <Lock
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    style={{
                      paddingLeft: "3.2rem",
                      backgroundColor: "#ffffff",
                    }}
                    className="h-12 w-full rounded-xl border border-[#d9dbd6] pr-4 text-[15px] text-[#242625] outline-none transition placeholder:text-[#a9aca4] focus:border-[#3a3d3b] focus:ring-2 focus:ring-[#3a3d3b]/10"
                  />

                </div>

                <p className="pt-1 text-[13px] text-[#8b8e86]">
                  Must be at least 6 characters.
                </p>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#2e312f] pt-1 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#1f2120] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    <span>
                      Create account
                    </span>

                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

            </form>

            {/* MESSAGE */}
            {message && (
              <div className="mt-5 rounded-xl border border-[#e2e3df] bg-[#f8f8f7] px-4 py-3 text-center text-[14px] font-medium text-[#4b4f47]">
                {message}
              </div>
            )}

            {/* LOGIN */}
            <div className="mt-8 border-t border-[#ebece8] pt-6 text-center">

              <p className="text-[14px] text-[#70746c]">
                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#232523] transition hover:underline"
                >
                  Log in
                </Link>
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Signup;