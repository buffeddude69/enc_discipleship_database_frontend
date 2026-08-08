import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { ROLE_LABELS, YEAR_LEVEL_LABELS } from "../api/labels";
import type { Member } from "../api/types";

export default function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Member>(`/members/${id}/`).then(setMember).catch(() => setError("Couldn't load this profile."));
  }, [id]);

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-md mx-auto">{error}</p>;
  if (!member) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">
          {member.first_name} {member.last_name}
        </h2>
        <Link
          to={`/members/${member.id}/edit`}
          className="text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-1.5 hover:bg-sage-light transition-colors shrink-0"
        >
          Edit Profile
        </Link>
      </div>

      {member.needs_update && (
        <p className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2 mb-4">
          This profile hasn't been updated this month.
        </p>
      )}

      <div className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        {member.profile_picture && (
          <img
            src={member.profile_picture}
            alt={`${member.first_name} ${member.last_name}`}
            className="w-28 h-28 rounded-full object-cover mx-auto"
          />
        )}

        <Field label="Role" value={ROLE_LABELS[member.role]} />
        <Field label="Gender" value={member.gender === "male" ? "Male" : "Female"} />
        <Field label="Year Level / Life Stage" value={YEAR_LEVEL_LABELS[member.year_level] ?? member.year_level} />
        <Field label="School / Campus" value={member.school_name} />
        <Field
          label="Ministries"
          value={member.ministry_names.length > 0 ? member.ministry_names.join(", ") : "Not currently serving"}
        />
        <Field label="Discipleship Stage" value={member.discipleship_stage_name ?? "Not set"} />
        <Field label="Groups" value={member.group_names.length > 0 ? member.group_names.join(", ") : "None yet"} />
        <Field label="Last Updated" value={new Date(member.updated_at).toLocaleDateString()} />
      </div>

      {(member.remarks || member.remarks_photo) && (
        <div className="bg-white rounded-2xl border border-sage-light p-6 mt-4">
          <p className="text-xs uppercase tracking-wide text-charcoal-soft mb-2">Remarks</p>
          {member.remarks && <p className="text-charcoal whitespace-pre-wrap">{member.remarks}</p>}
          {member.remarks_photo && (
            <img
              src={member.remarks_photo}
              alt="Remarks"
              className="w-full rounded-xl mt-3 object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-charcoal-soft">{label}</p>
      <p className="text-charcoal mt-0.5">{value}</p>
    </div>
  );
}
