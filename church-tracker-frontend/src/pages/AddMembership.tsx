import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api, extractErrorMessage } from "../api/client";
import { inputClass } from "../components/Form";
import type { GroupMembership, Member, User } from "../api/types";

type Mode = "member" | "leader";
type SelectedPerson = { type: "member"; data: Member } | { type: "leader"; data: User };

export default function AddMembership() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedMemberId = searchParams.get("member");

  const [mode, setMode] = useState<Mode>("member");
  const [selected, setSelected] = useState<SelectedPerson | null>(null);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [leaders, setLeaders] = useState<User[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<GroupMembership["attendance_status"]>("new");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Show the full list right away -- no need to search first.
  useEffect(() => {
    api.get<Member[]>("/members/").then(setMembers).catch(() => {});
    api.get<User[]>("/auth/leaders/").then(setLeaders).catch(() => {});
  }, []);

  // If we're returning from "create new profile", load it and skip straight to the status step.
  useEffect(() => {
    if (preselectedMemberId) {
      api
        .get<Member>(`/members/${preselectedMemberId}/`)
        .then((m) => setSelected({ type: "member", data: m }))
        .catch(() => {});
    }
  }, [preselectedMemberId]);

  const filteredMembers = members.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  const filteredLeaders = leaders.filter((l) =>
    `${l.first_name} ${l.last_name}`.toLowerCase().includes(search.trim().toLowerCase())
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!groupId || !selected) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post<GroupMembership>("/group-memberships/", {
        group: Number(groupId),
        ...(selected.type === "member" ? { member: selected.data.id } : { leader: selected.data.id }),
        attendance_status: attendanceStatus,
      });
      navigate(`/groups/${groupId}`);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't add this person. They may already be in this group."));
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Add to Group</h2>

      {!selected && (
        <div className="bg-white rounded-2xl border border-sage-light p-6">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setMode("member")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                mode === "member" ? "bg-pine text-white" : "bg-sage-light text-charcoal"
              }`}
            >
              Member / Intern Profile
            </button>
            <button
              type="button"
              onClick={() => setMode("leader")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${
                mode === "leader" ? "bg-pine text-white" : "bg-sage-light text-charcoal"
              }`}
            >
              Leader Account
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className={inputClass}
          />

          {mode === "member" && (
            <ul className="space-y-1.5 mt-3 max-h-96 overflow-y-auto">
              {filteredMembers.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setSelected({ type: "member", data: m })}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-sage-light transition-colors text-sm"
                  >
                    <span className="font-medium text-charcoal">
                      {m.first_name} {m.last_name}
                    </span>
                    <span className="text-charcoal-soft">
                      {" "}
                      · {m.role[0].toUpperCase() + m.role.slice(1)} · {m.school_name}
                    </span>
                  </button>
                </li>
              ))}
              {filteredMembers.length === 0 && (
                <p className="text-sm text-charcoal-soft px-1 py-2">No existing profiles match.</p>
              )}
            </ul>
          )}

          {mode === "leader" && (
            <ul className="space-y-1.5 mt-3 max-h-96 overflow-y-auto">
              {filteredLeaders.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => setSelected({ type: "leader", data: l })}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-sage-light transition-colors text-sm"
                  >
                    <span className="font-medium text-charcoal">
                      {l.first_name} {l.last_name}
                    </span>
                    <span className="text-charcoal-soft"> · @{l.username}</span>
                  </button>
                </li>
              ))}
              {filteredLeaders.length === 0 && (
                <p className="text-sm text-charcoal-soft px-1 py-2">No leaders match.</p>
              )}
            </ul>
          )}

          {mode === "member" && (
            <Link
              to={`/members/new?forGroup=${groupId}`}
              className="block text-center mt-4 text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-2 hover:bg-sage-light transition-colors"
            >
              + Create a New Profile Instead
            </Link>
          )}
        </div>
      )}

      {selected && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
          <div className="flex items-center justify-between bg-sage-light rounded-lg px-3.5 py-2.5">
            <div>
              <p className="text-sm font-medium text-charcoal">
                {selected.data.first_name} {selected.data.last_name}
              </p>
              <p className="text-xs text-charcoal-soft">
                {selected.type === "member" ? (
                  <>
                    Role: {selected.data.role[0].toUpperCase() + selected.data.role.slice(1)}
                    {" · "}
                    <Link to={`/members/${selected.data.id}/edit`} className="text-pine font-medium">
                      Change on their profile
                    </Link>
                  </>
                ) : (
                  "Leader Account"
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-xs font-medium text-pine shrink-0"
            >
              Change
            </button>
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
