import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import MemberForm from "../components/MemberForm";
import type { Member } from "../api/types";

export default function EditMember() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!memberId) return;
    api
      .get<Member>(`/members/${memberId}/`)
      .then(setMember)
      .catch(() => setError("Couldn't load this member."));
  }, [memberId]);

  async function handleDelete() {
    if (!memberId || !member) return;
    if (!confirm(`Remove ${member.first_name} ${member.last_name} from this group?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/members/${memberId}/`);
      navigate(`/groups/${member.group}`);
    } catch {
      setError("Couldn't remove this member. Please try again.");
      setDeleting(false);
    }
  }

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-lg mx-auto">{error}</p>;
  if (!member) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">Edit Member</h2>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-medium text-brick hover:text-brick/80 disabled:opacity-60"
        >
          {deleting ? "Removing…" : "Remove member"}
        </button>
      </div>

      <MemberForm
        groupId={member.group}
        initial={member}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await api.patch<Member>(`/members/${memberId}/`, data);
          navigate(`/groups/${member.group}`);
        }}
      />
    </div>
  );
}
