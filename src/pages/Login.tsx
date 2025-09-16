import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { authApi } from "../api/auth";
import { getApiErrors } from "../utils/getApiErrors";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError(null);
    setFieldErrors({});

    try {
      const { token, user } = await authApi.login({ identifier, password });
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      dispatch(login({ token, user }));

      navigate("/home");
    } catch (err) {
      const parsed = getApiErrors(err);
      setGlobalError(parsed.global);
      setFieldErrors(parsed.fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="mx-auto w-full max-w-md px-6 pt-24">
        <h1 className="mb-2 text-4xl font-semibold text-green-600 select-none">
          circle
        </h1>
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Login to Circle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Identifier */}
          <div>
            <label
              htmlFor="identifier"
              className="mb-1 block text-sm text-zinc-300"
            >
              Email / Username <span className="text-red-500">*</span>
            </label>
            <input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or username"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              required
              autoComplete="username email"
            />
            {fieldErrors.identifier && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors.identifier[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-zinc-300">
                Password <span className="text-red-500">*</span>
              </label>
              <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              required
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-400">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {globalError && (
            <p className="text-sm text-red-400" role="alert">
              {globalError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Logging in…</span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-400">
          Don't have an account yet?{" "}
          <a href="/register" className="text-green-600 hover:text-green-400">
            Create account
          </a>
        </p>
      </div>
    </main>
  );
}
