import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { LEADER_ROLE_LABELS } from "../api/labels";
import type { User } from "../api/types";

const DEMOGRAPHY_LABELS: Record<string, string> = {
  student_youth: "Student / Youth",
  single_young_professional: "Single / Young Professional",
  married: "Married",
  parent: "Parent",
  senior: "Senior",
};

const AREA_LABELS: Record<string, string> = {
  binan: "Binan",
  nuvali: "Nuvali",
  santa_rosa_city: "Santa Rosa City",
};

export default function LeaderProfile() {
  const { id } = useParams();
  const [leader, setLeader] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get<User>(`/auth/leaders/${id}/`)
      .then(setLeader)
      .catch(() => setError("Couldn't load this leader's profile."));
  }, [id]);

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-md mx-auto">{error}</p>;
  if (!leader) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">
          {leader.first_name} {leader.last_name}
        </h2>
        {leader.is_staff && (
          <span className="text-xs font-medium text-pine bg-sage-light rounded-full px-2 py-0.5">★ Staff</span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <Field label="Username" value={`@${leader.username}`} />
        <Field label="Email" value={leader.email || "—"} />
        <Field label="Role" value={LEADER_ROLE_LABELS[leader.leader_role] ?? leader.leader_role} />
        <Field label="Demography" value={DEMOGRAPHY_LABELS[leader.demography] ?? leader.demography} />
        <Field label="Gender" value={leader.gender === "male" ? "Male" : "Female"} />
        <Field label="Area" value={AREA_LABELS[leader.area] ?? leader.area} />
        <Field label="Contact Number" value={leader.contact_number || "—"} />
        <Field
          label="Groups Led"
          value={leader.groups_led.length > 0 ? leader.groups_led.join(", ") : "None"}
        />
        <Field
          label="Member Of"
          value={leader.groups_member_of.length > 0 ? leader.groups_member_of.join(", ") : "None"}
        />
      </div>
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
