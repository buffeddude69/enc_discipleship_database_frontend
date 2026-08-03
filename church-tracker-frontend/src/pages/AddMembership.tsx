import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { inputClass } from "../components/Form";
import type { GroupMembership, Member } from "../api/types";

export default function AddMembership() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get("member");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [roleInGroup, setRoleInGroup] = useState<GroupMembership["role_in_group"]>("member");
  const [attendanceStatus, setAttendanceStatus] = useState<GroupMembership["attendance_status"]>("new");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If we're returning from "create new profile", load it and skip straight to the role/status step.
  useEffect(() => {
    if (preselectedMemberId) {
      api.get<Member>(`/members/${preselectedMemberId}/`).then(setSelectedMember).catch(() => {});
    }
  }, [preselectedMemberId]);

  useEffect(() => {
    if (!search.trim() || selectedMember) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      api.get<Member[]>(`/members/?search=${encodeURIComponent(search.trim())}`).then(setResults).catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedMember]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!groupId || !selectedMember) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post<GroupMembership>("/group-memberships/", {
        group: Number(groupId),
        member: selectedMember.id,
        role_in_group: roleInGroup,
        attendance_status: attendanceStatus,
      });
      navigate(`/groups/${groupId}`);
    } catch {
      setError("Couldn't add this member. They may already be in this group.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Add Member to Group</h2>

      {!selectedMember && (
        <div className="bg-white rounded-2xl border border-sage-light p-6">
          <p className="text-sm font-medium text-charcoal mb-2">Search for an existing profile first</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className={inputClass}
          />

          <ul className="space-y-1.5 mt-3">
            {results.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => setSelectedMember(m)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-sage-light transition-colors text-sm"
                >
                  <span className="font-medium text-charcoal">
                    {m.first_name} {m.last_name}
                  </span>
                  <span className="text-charcoal-soft"> · {m.school_name}</span>
                </button>
              </li>
            ))}
            {search.trim() && results.length === 0 && (
              <p className="text-sm text-charcoal-soft px-1">No existing profiles match.</p>
            )}
          </ul>

          <Link
            to={`/members/new?forGroup=${groupId}`}
            className="block text-center mt-4 text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-2 hover:bg-sage-light transition-colors"
          >
            + Create a New Profile Instead
          </Link>
        </div>
      )}

      {selectedMember && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
          <div className="flex items-center justify-between bg-sage-light rounded-lg px-3.5 py-2.5">
            <p className="text-sm font-medium text-charcoal">
              {selectedMember.first_name} {selectedMember.last_name}
            </p>
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="text-xs font-medium text-pine"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Role in this group</label>
            <select
              value={roleInGroup}
              onChange={(e) => setRoleInGroup(e.target.value as GroupMembership["role_in_group"])}
              className={inputClass}
            >
              <option value="member">Member</option>
              <option value="intern">Intern</option>
              <option value="leader">Leader</option>
            </select>
          </div>

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
            {submitting ? "Adding…" : "Add to Group"}
          </button>
        </form>
      )}
    </div>
  );
}
