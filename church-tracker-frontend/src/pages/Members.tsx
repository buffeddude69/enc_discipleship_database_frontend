import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Member, School } from "../api/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function Members() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [meetingDayFilter, setMeetingDayFilter] = useState("");
  const [needsUpdateOnly, setNeedsUpdateOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<School[]>("/schools/").then(setSchools).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (schoolFilter) params.set("school", schoolFilter);
    if (meetingDayFilter) params.set("meeting_day", meetingDayFilter);
    if (needsUpdateOnly) params.set("needs_update", "true");
    const query = params.toString() ? `?${params.toString()}` : "";

    const timeout = setTimeout(() => {
      api
        .get<Member[]>(`/members/${query}`)
        .then(setMembers)
        .catch(() => setError("Couldn't load members. Please try again."));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, schoolFilter, meetingDayFilter, needsUpdateOnly]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-semibold text-pine">Members</h2>
        <Link
          to="/members/new"
          className="bg-pine hover:bg-pine-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Profile
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name…"
        className="w-full mb-3 px-3.5 py-2.5 rounded-lg border border-sage-light bg-white text-base focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine"
      />

      <div className="flex flex-wrap gap-3 mb-3">
        <select
          value={schoolFilter}
          onChange={(e) => setSchoolFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-sage-light bg-white text-sm"
        >
          <option value="">All schools/campuses</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={meetingDayFilter}
          onChange={(e) => setMeetingDayFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-sage-light bg-white text-sm"
        >
          <option value="">All meeting days</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d[0].toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal mb-5">
        <input
          type="checkbox"
          checked={needsUpdateOnly}
          onChange={(e) => setNeedsUpdateOnly(e.target.checked)}
          className="w-4 h-4"
        />
        Only show profiles not updated this month
      </label>

      {error && <p className="text-brick bg-brick-light rounded-lg px-4 py-3">{error}</p>}

      {!error && members === null && <p className="text-charcoal-soft">Loading…</p>}

      {members && members.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-sage-light">
          <p className="text-charcoal-soft">No members match these filters.</p>
        </div>
      )}

      <ul className="space-y-2">
        {members?.map((member) => (
          <li key={member.id}>
            <Link
              to={`/members/${member.id}`}
              className="block bg-white rounded-xl border border-sage-light p-3.5 hover:border-pine transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-charcoal">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-xs text-charcoal-soft mt-0.5">
                    {member.school_name}
                    {member.group_names.length > 0 && ` · ${member.group_names.join(", ")}`}
                  </p>
                </div>
                {member.needs_update && (
                  <span className="text-xs font-medium text-brick bg-brick-light rounded-full px-2 py-0.5 shrink-0">
                    Needs update
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
