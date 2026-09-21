import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/groups");
    } catch (err) {
      if (err instanceof ApiError) {
        setError("Username or password is incorrect. Please try again.");
      } else {
        setError("Something went wrong. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-pine">Group Tracker</h1>
          <p className="text-charcoal-soft mt-2">Sign in to manage your group.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-sage-light p-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-charcoal mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-pine hover:bg-pine-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-charcoal-soft">
            Don't have an account? Ask your staff/coordinator to create one for you.
          </p>
        </form>
      </div>
    </div>
  );
}
