import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { GROUP_DEMOGRAPHY_LABELS } from "../api/labels";
import type { Group } from "../api/types";

const GROUP_TYPE_LABELS: Record<Group["group_type"], string> = {
  small_group: "Small Group",
  leadership_group: "Leadership Group",
  campus_ministry: "Campus Ministry",
};

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Group[]>("/groups/")
      .then(setGroups)
      .catch(() => setError("Couldn't load your groups. Please try again."));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">
          {user?.is_staff ? "All Groups" : "My Groups"}
        </h2>
        <Link
          to="/groups/new"
          className="bg-pine hover:bg-pine-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Group
        </Link>
      </div>

      {error && <p className="text-brick bg-brick-light rounded-lg px-4 py-3">{error}</p>}

      {!error && groups === null && (
        <p className="text-charcoal-soft">Loading groups…</p>
      )}

      {groups && groups.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-sage-light">
          <p className="text-charcoal-soft">No groups yet.</p>
        </div>
      )}

      <ul className="space-y-3">
        {groups?.map((group) => (
          <li key={group.id}>
            <Link
              to={`/groups/${group.id}`}
              className="block bg-white rounded-2xl border border-sage-light p-4 hover:border-pine transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusDot active={group.is_active} />
                    <h3 className="font-medium text-charcoal">{group.name}</h3>
                  </div>
                  <p className="text-sm text-charcoal-soft mt-1">
                    {GROUP_TYPE_LABELS[group.group_type]}
                    {" · "}
                    {group.demography === "others" ? group.demography_other : GROUP_DEMOGRAPHY_LABELS[group.demography]}
                    {group.meeting_day && ` · ${capitalize(group.meeting_day)}s`}
                    {group.venue && ` · ${group.venue}`}
                  </p>
                  {user?.is_staff && (
                    <p className="text-xs text-sage mt-1 font-medium">Led by {group.leader_name}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-charcoal">
                    {group.active_member_count}/{group.member_count}
                  </p>
                  <p className="text-xs text-charcoal-soft">active</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      aria-label={active ? "Active" : "Inactive"}
      className={`inline-block w-2.5 h-2.5 rounded-full ${
        active ? "bg-amber" : "bg-brick border border-brick"
      }`}
      style={!active ? { backgroundColor: "transparent" } : undefined}
    />
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
