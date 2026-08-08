import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { ATTENDANCE_DOT_COLOR, ROLE_LABELS } from "../api/labels";
import type { Group, GroupMembership } from "../api/types";

export default function GroupDetail() {
  const { id } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [memberships, setMemberships] = useState<GroupMembership[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Group>(`/groups/${id}/`),
      api.get<GroupMembership[]>(`/group-memberships/?group=${id}`),
    ])
      .then(([g, m]) => {
        setGroup(g);
        setMemberships(m);
      })
      .catch(() => setError("Couldn't load this group. Please try again."));
  }, [id]);

  if (error) {
    return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-2xl mx-auto">{error}</p>;
  }

  if (!group) {
    return <p className="text-charcoal-soft">Loading…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/groups" className="text-sm text-pine font-medium">← All groups</Link>

      <div className="mt-3 mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-pine">{group.name}</h2>
          <p className="text-charcoal-soft mt-1">
            {group.meeting_day && capitalize(group.meeting_day)}
            {group.meeting_time && ` · ${group.meeting_time.slice(0, 5)}`}
            {group.venue && ` · ${group.venue}`}
          </p>
        </div>
        <Link
          to={`/groups/${group.id}/edit`}
          className="text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-1.5 hover:bg-sage-light transition-colors shrink-0"
        >
          Edit Group
        </Link>
      </div>

      <h3 className="font-medium text-charcoal mb-3 flex items-center justify-between">
        <span>Members ({memberships?.length ?? 0})</span>
        <Link
          to={`/groups/${group.id}/add-member`}
          className="bg-pine hover:bg-pine-dark text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors"
        >
          + Add Member
        </Link>
      </h3>

      {memberships && memberships.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-sage-light">
          <p className="text-charcoal-soft">No members added yet.</p>
        </div>
      )}

      <ul className="space-y-2">
        {memberships?.map((m) => (
          <li key={m.id}>
            <Link
              to={`/groups/${group.id}/memberships/${m.id}`}
              className="block bg-white rounded-xl border border-sage-light p-3.5 hover:border-pine transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${ATTENDANCE_DOT_COLOR[m.attendance_status]}`} />
                    <p className="font-medium text-charcoal">
                      {m.member_detail.first_name} {m.member_detail.last_name}
                    </p>
                  </div>
                  <p className="text-xs text-charcoal-soft mt-0.5 ml-4">
                    {ROLE_LABELS[m.member_detail.role]}
                    {m.member_detail.ministry_names.length > 0 && ` · ${m.member_detail.ministry_names.join(", ")}`}
                  </p>
                </div>
                {m.needs_update && (
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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
