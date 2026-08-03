import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import MemberForm from "../components/MemberForm";
import type { Member } from "../api/types";

export default function EditMemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<Member>(`/members/${id}/`).then(setMember).catch(() => setError("Couldn't load this profile."));
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this member profile entirely? This removes them from every group they're in.")) return;
    setDeleting(true);
    try {
      await api.delete(`/members/${id}/`);
      navigate("/members");
    } catch {
      setError("Couldn't delete this profile. Please try again.");
      setDeleting(false);
    }
  }

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-lg mx-auto">{error}</p>;
  if (!member) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">Edit Profile</h2>
        {user?.is_staff && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-brick hover:text-brick/80 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete profile"}
          </button>
        )}
      </div>

      <MemberForm
        initial={member}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await api.patchForm<Member>(`/members/${id}/`, data);
          navigate(`/members/${id}`);
        }}
      />
    </div>
  );
}
