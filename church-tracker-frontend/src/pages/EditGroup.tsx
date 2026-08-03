import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import GroupForm from "../components/GroupForm";
import type { Group } from "../api/types";

export default function EditGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get<Group>(`/groups/${id}/`).then(setGroup).catch(() => setError("Couldn't load this group."));
  }, [id]);

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this group and all its members? This can't be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/groups/${id}/`);
      navigate("/groups");
    } catch {
      setError("Couldn't delete this group. Please try again.");
      setDeleting(false);
    }
  }

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-lg mx-auto">{error}</p>;
  if (!group) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">Edit Group</h2>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-medium text-brick hover:text-brick/80 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete group"}
        </button>
      </div>

      <GroupForm
        initial={group}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await api.patch<Group>(`/groups/${id}/`, data);
          navigate(`/groups/${id}`);
        }}
      />
    </div>
  );
}
