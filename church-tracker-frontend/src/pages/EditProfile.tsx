import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, extractErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Field, inputClass } from "../components/Form";
import StudentFields from "../components/StudentFields";
import type { User } from "../api/types";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [leaderRole, setLeaderRole] = useState<User["leader_role"]>(user?.leader_role ?? "small_group_leader");
  const [demography, setDemography] = useState<User["demography"]>(user?.demography ?? "college");
  const [gender, setGender] = useState<User["gender"]>(user?.gender ?? "male");
  const [area, setArea] = useState<User["area"]>(user?.area ?? "binan");
  const [contactNumber, setContactNumber] = useState(user?.contact_number ?? "");
  const [yearLevel, setYearLevel] = useState<User["year_level"]>(user?.year_level ?? "");
  const [schoolId, setSchoolId] = useState(user?.school ? String(user.school) : "");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isStudent = demography === "high_school" || demography === "college";

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const updated = await api.patch<User>("/auth/me/", {
        first_name: firstName,
        last_name: lastName,
        email,
        leader_role: leaderRole,
        demography,
        gender,
        area,
        contact_number: contactNumber,
        year_level: isStudent ? yearLevel : "",
        school: isStudent && schoolId ? Number(schoolId) : null,
      });
      updateUser(updated);
      navigate("/profile");
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't save your profile. Please check the fields and try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Last name">
            <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Contact number">
          <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Role">
          <select value={leaderRole} onChange={(e) => setLeaderRole(e.target.value as User["leader_role"])} className={inputClass}>
            <option value="small_group_leader">Small Group Leader</option>
            <option value="leadership_group_leader">Leadership Group Leader</option>
            <option value="campus_missionary">Campus Missionary</option>
          </select>
        </Field>

        <Field label="Demography">
          <select value={demography} onChange={(e) => setDemography(e.target.value as User["demography"])} className={inputClass}>
            <option value="high_school">High School</option>
            <option value="college">College</option>
            <option value="single_young_professional">Single / Young Professional</option>
            <option value="married">Married</option>
            <option value="parent">Parent</option>
            <option value="senior">Senior</option>
          </select>
        </Field>

        <StudentFields
          demography={demography}
          yearLevel={yearLevel}
          onYearLevelChange={setYearLevel}
          schoolId={schoolId}
          onSchoolIdChange={setSchoolId}
        />

        <Field label="Gender">
          <select value={gender} onChange={(e) => setGender(e.target.value as User["gender"])} className={inputClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>

        <Field label="Area assigned for discipling">
          <select value={area} onChange={(e) => setArea(e.target.value as User["area"])} className={inputClass} required>
            <option value="binan">Binan</option>
            <option value="nuvali">Nuvali</option>
            <option value="santa_rosa_city">Santa Rosa City</option>
          </select>
        </Field>

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
