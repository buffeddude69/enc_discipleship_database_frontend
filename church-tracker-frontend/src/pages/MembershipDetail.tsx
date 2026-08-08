import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { inputClass } from "../components/Form";
import type { GroupMembership } from "../api/types";

export default function MembershipDetail() {
  const { id: groupId, membershipId } = useParams();
  const navigate = useNavigate();
  const [membership, setMembership] = useState<GroupMembership | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<GroupMembership["attendance_status"]>("new");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (!membershipId) return;
    api
      .get<GroupMembership>(`/group-memberships/${membershipId}/`)
      .then((m) => {
        setMembership(m);
        setAttendanceStatus(m.attendance_status);
      })
      .catch(() => setError("Couldn't load this member's info."));
  }, [membershipId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!membershipId) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.patch<GroupMembership>(`/group-memberships/${membershipId}/`, {
        attendance_status: attendanceStatus,
      });
      navigate(`/groups/${groupId}`);
    } catch {
      setError("Couldn't save these changes. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    if (!membershipId || !membership) return;
    if (!confirm(`Remove ${membership.member_detail.first_name} from this group? Their profile stays intact.`)) return;
    setRemoving(true);
    try {
      await api.delete(`/group-memberships/${membershipId}/`);
      navigate(`/groups/${groupId}`);
    } catch {
      setError("Couldn't remove this member. Please try again.");
      setRemoving(false);
    }
  }

  if (error && !membership) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-lg mx-auto">{error}</p>;
  if (!membership) return <p className="text-charcoal-soft">Loading…</p>;

  const role = membership.member_detail.role;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-pine">
            {membership.member_detail.first_name} {membership.member_detail.last_name}
          </h2>
          <p className="text-sm text-charcoal-soft mt-0.5">
            Role: {role[0].toUpperCase() + role.slice(1)}
          </p>
        </div>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="text-sm font-medium text-brick hover:text-brick/80 disabled:opacity-60 shrink-0"
        >
          {removing ? "Removing…" : "Remove from group"}
        </button>
      </div>

      <Link
        to={`/members/${membership.member}`}
        className="inline-block text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-1.5 hover:bg-sage-light transition-colors mb-4"
      >
        View Full Profile →
      </Link>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Attendance status this month</label>
          <select
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value as GroupMembership["attendance_status"])}
            className={inputClass}
          >
            <option value="new">New (joined this month)</option>
            <option value="active">Active (attended this month)</option>
            <option value="inactive">Inactive (no attendance this month)</option>
          </select>
        </div>

        {error && <p role="alert" className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-pine hover:bg-pine-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
