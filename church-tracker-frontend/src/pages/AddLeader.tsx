import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, extractErrorMessage } from "../api/client";
import { Field, inputClass } from "../components/Form";
import StudentFields from "../components/StudentFields";
import type { User } from "../api/types";

export default function AddLeader() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [leaderRole, setLeaderRole] = useState<User["leader_role"]>("small_group_leader");
  const [demography, setDemography] = useState<User["demography"]>("college");
  const [gender, setGender] = useState<User["gender"]>("male");
  const [area, setArea] = useState<User["area"]>("binan");
  const [contactNumber, setContactNumber] = useState("");
  const [yearLevel, setYearLevel] = useState<User["year_level"]>("");
  const [schoolId, setSchoolId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<User | null>(null);
  const isStudent = demography === "high_school" || demography === "college";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Deliberately NOT using AuthContext's register() here -- that
      // would log the staff member out of their own session and into
      // the new leader's account. This just creates the account and
      // stays logged in as the staff member.
      const data = await api.post<{ user: User }>("/auth/register/", {
        username,
        password,
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
      setCreated(data.user);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't create this account. That username may already be taken, or a field needs fixing."));
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="max-w-lg mx-auto">
        <h2 className="font-display text-2xl font-semibold text-pine mb-6">Leader Account Created</h2>
        <div className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
          <p className="text-charcoal">
            <span className="font-medium">{created.first_name} {created.last_name}</span>'s account is ready.
          </p>
          <p className="text-sm text-charcoal-soft">
            Share these login details with them directly (not through this app):
          </p>
          <div className="bg-sage-light rounded-lg px-4 py-3 text-sm">
            <p><span className="text-charcoal-soft">Username:</span> <span className="font-medium">{created.username}</span></p>
            <p><span className="text-charcoal-soft">Password:</span> <span className="font-medium">{password}</span></p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setCreated(null);
                setUsername("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setEmail("");
                setContactNumber("");
              }}
              className="flex-1 bg-pine hover:bg-pine-dark text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Add Another
            </button>
            <button
              onClick={() => navigate("/leaders")}
              className="flex-1 border border-pine text-pine text-sm font-medium py-2.5 rounded-lg hover:bg-sage-light transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-semibold text-pine mb-6">Add Leader Account</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Last name">
            <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
          </Field>
        </div>

        <Field label="Username">
          <input required value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
        </Field>

        <Field label="Temporary password">
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-charcoal-soft mt-1">Share this with them directly so they can log in.</p>
        </Field>

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
          {submitting ? "Creating…" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
