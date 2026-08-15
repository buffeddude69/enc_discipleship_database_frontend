import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Field, inputClass } from "../components/Form";
import StudentFields from "../components/StudentFields";
import { extractErrorMessage } from "../api/client";
import type { User } from "../api/types";

export default function Register() {
  const { register } = useAuth();
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
  const isStudent = demography === "high_school" || demography === "college";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({
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
      navigate("/groups");
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't create your account. That username may already be taken, or a field needs fixing."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl font-semibold text-pine">Create Your Account</h1>
          <p className="text-charcoal-soft mt-2">Sign up as a group leader.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-sage-light p-6 space-y-4">
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

          <Field label="Password">
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Contact number">
            <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={inputClass} />
          </Field>

          <Field label="I am a...">
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
            {submitting ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-sm text-charcoal-soft">
            Already have an account?{" "}
            <Link to="/login" className="text-pine font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
