import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { User } from "../api/types";

const LEADER_ROLE_LABELS: Record<string, string> = {
  small_group_leader: "Small Group Leader",
  leadership_group_leader: "Leadership Group Leader",
  campus_missionary: "Campus Missionary",
};

export default function Leaders() {
  const [leaders, setLeaders] = useState<User[] | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (roleFilter) params.set("leader_role", roleFilter);
    const query = params.toString() ? `?${params.toString()}` : "";

    const timeout = setTimeout(() => {
      api
        .get<User[]>(`/auth/leaders/${query}`)
        .then(setLeaders)
        .catch(() => setError("Couldn't load leaders. Please try again."));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, roleFilter]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-4">Leaders</h2>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or username…"
        className="w-full mb-3 px-3.5 py-2.5 rounded-lg border border-sage-light bg-white text-base focus:outline-none focus:ring-2 focus:ring-pine focus:border-pine"
      />

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="mb-5 px-3 py-2 rounded-lg border border-sage-light bg-white text-sm"
      >
        <option value="">All roles</option>
        <option value="small_group_leader">Small Group Leader</option>
        <option value="leadership_group_leader">Leadership Group Leader</option>
        <option value="campus_missionary">Campus Missionary</option>
      </select>

      {error && <p className="text-brick bg-brick-light rounded-lg px-4 py-3">{error}</p>}

      {leaders && leaders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-sage-light">
          <p className="text-charcoal-soft">No leaders match this search.</p>
        </div>
      )}

      <ul className="space-y-2">
        {leaders?.map((leader) => (
          <li key={leader.id} className="bg-white rounded-xl border border-sage-light p-3.5">
            <div className="flex items-center gap-2">
              <p className="font-medium text-charcoal">
                {leader.first_name} {leader.last_name}
              </p>
              {leader.is_staff && (
                <span className="text-xs font-medium text-pine bg-sage-light rounded-full px-2 py-0.5">
                  ★ Staff
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-soft mt-0.5">
              {LEADER_ROLE_LABELS[leader.leader_role] ?? leader.leader_role}
              {" · "}@{leader.username}
              {leader.contact_number && ` · ${leader.contact_number}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
