import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { authApi } from "../api/auth";
import { getApiErrors } from "../utils/getApiErrors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const valid =
    username.trim().length >= 3 &&
    fullName.trim().length >= 3 &&
    /.+@.+\..+/.test(email) &&
    password.length >= 8 &&
    password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;

    setLoading(true);
    setGlobalError(null);
    setFieldErrors({});

    try {
      const payload = {
        username: username.trim(),
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      const { token, user } = await authApi.register(payload);
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      dispatch(login({ token, user }));
      navigate("/home", { replace: true });
    } catch (err) {
      const parsed = getApiErrors(err);
      setGlobalError(parsed.global);
      setFieldErrors(parsed.fields || {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-900 text-zinc-200 px-4">
      <div className="mx-auto w-full max-w-md px-4 py-12 sm:max-w-lg sm:px-6 sm:py-16 lg:max-w-xl lg:px-8">
        <h1 className="mb-2 text-3xl font-semibold text-green-600 select-none sm:text-4xl">
          circle
        </h1>
        <h2 className="mb-6 text-xl font-medium text-white sm:text-2xl">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username & Full Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm text-zinc-300"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                autoComplete="username"
              />
              {fieldErrors.username && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.username[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm text-zinc-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                autoComplete="name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-400">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-zinc-300"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-zinc-300">
                Password <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-zinc-500">Min 8 characters</span>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 pr-12 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm"
              className="mb-1.5 block text-sm text-zinc-300"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 pr-12 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto rounded-md px-2 text-xs text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {confirm && confirm !== password && (
              <p className="mt-1 text-xs text-red-400">
                Passwords do not match.
              </p>
            )}
          </div>

          {/* Global backend error */}
          {globalError && (
            <p className="text-sm text-red-400" role="alert">
              {globalError}
            </p>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className="w-full rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Register"}
          </button>

          <p className="text-center text-sm text-zinc-400 sm:text-left">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 hover:text-green-400">
              Login to your account
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
