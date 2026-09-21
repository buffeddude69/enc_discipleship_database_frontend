import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AREA_LABELS, DEMOGRAPHY_LABELS, LEADER_ROLE_LABELS, LEADER_YEAR_LEVEL_LABELS } from "../api/labels";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-semibold text-pine">My Profile</h2>
        <div className="flex gap-2">
          <Link
            to="/profile/change-password"
            className="text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-1.5 hover:bg-sage-light transition-colors"
          >
            Change Password
          </Link>
          <Link
            to="/profile/edit"
            className="text-sm font-medium text-pine border border-pine rounded-lg px-3.5 py-1.5 hover:bg-sage-light transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-charcoal-soft">Account Type</p>
          <p className="mt-1">
            {user.is_staff ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-pine bg-sage-light rounded-full px-2.5 py-1">
                ★ Staff / Coordinator
              </span>
            ) : (
              <span className="text-charcoal">Group Leader</span>
            )}
          </p>
        </div>
        <Field label="Name" value={`${user.first_name} ${user.last_name}`} />
        <Field label="Username" value={user.username} />
        <Field label="Email" value={user.email || "—"} />
        <Field label="Role" value={LEADER_ROLE_LABELS[user.leader_role] ?? user.leader_role} />
        <Field label="Demography" value={DEMOGRAPHY_LABELS[user.demography] ?? user.demography} />
        <Field label="Gender" value={user.gender === "male" ? "Male" : "Female"} />
        <Field label="Area" value={AREA_LABELS[user.area] ?? user.area} />
        <Field label="Contact number" value={user.contact_number || "—"} />
        <Field
          label="One2One"
          value={user.is_doing_one_on_one ? (user.one_on_one_with ? `Yes, with ${user.one_on_one_with}` : "Yes") : "No"}
        />
        <Field label="Currently a Student?" value={user.is_student ? "Yes" : "No"} />
        {user.is_student && (
          <>
            <Field
              label="Grade Level / Year"
              value={user.year_level ? LEADER_YEAR_LEVEL_LABELS[user.year_level] : "—"}
            />
            <Field label="School / Campus" value={user.school_name ?? "—"} />
          </>
        )}
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
