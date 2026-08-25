import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, extractErrorMessage, setToken } from "../api/client";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.post<{ token: string }>("/auth/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      // The backend rotates the auth token on password change, so we
      // need to store the new one -- otherwise the next request would
      // fail with the now-invalid old token.
      setToken(data.token);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't change your password. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Change Password</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Current password</label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">New password</label>
          <input
            required
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base"
          />
          <p className="text-xs text-charcoal-soft mt-1">At least 8 characters.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm new password</label>
          <input
            required
            type="password"
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-sage-light focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine text-base"
          />
        </div>

        {error && <p role="alert" className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2">{error}</p>}
        {success && (
          <p className="text-sm text-pine bg-sage-light rounded-lg px-3 py-2">
            Password changed successfully.
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-pine hover:bg-pine-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {submitting ? "Saving…" : "Change Password"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex-1 border border-pine text-pine font-medium py-2.5 rounded-lg hover:bg-sage-light transition-colors"
          >
            Back to Profile
          </button>
        </div>
      </form>
    </div>
  );
}
