import { useEffect, useState, type FormEvent } from "react";
import { api, extractErrorMessage } from "../api/client";
import { Field, inputClass } from "./Form";
import { YEAR_LEVEL_OPTIONS } from "../api/labels";
import type { DiscipleshipStage, Member, Ministry, School } from "../api/types";

interface MemberFormProps {
  initial?: Member;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function MemberForm({ initial, onSubmit, submitLabel }: MemberFormProps) {
  const [firstName, setFirstName] = useState(initial?.first_name ?? "");
  const [lastName, setLastName] = useState(initial?.last_name ?? "");
  const [gender, setGender] = useState<Member["gender"]>(initial?.gender ?? "male");
  const [role, setRole] = useState<Member["role"]>(initial?.role ?? "member");
  const [yearLevel, setYearLevel] = useState<Member["year_level"] | "">(initial?.year_level ?? "");
  const [schoolId, setSchoolId] = useState(initial?.school ? String(initial.school) : "");
  const [ministryIds, setMinistryIds] = useState<number[]>(initial?.ministries ?? []);
  const [discipleshipStageId, setDiscipleshipStageId] = useState(
    initial?.discipleship_stage ? String(initial.discipleship_stage) : ""
  );
  const [remarks, setRemarks] = useState(initial?.remarks ?? "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [remarksPhoto, setRemarksPhoto] = useState<File | null>(null);

  const [schools, setSchools] = useState<School[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [stages, setStages] = useState<DiscipleshipStage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<School[]>("/schools/").then(setSchools).catch(() => {});
    api.get<Ministry[]>("/ministries/").then(setMinistries).catch(() => {});
    api.get<DiscipleshipStage[]>("/discipleship-stages/").then(setStages).catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        first_name: firstName,
        last_name: lastName,
        gender,
        role,
        year_level: yearLevel,
        school: schoolId,
        is_in_ministry: ministryIds.length > 0,
        ministries: ministryIds,
        discipleship_stage: discipleshipStageId || null,
        remarks,
      };
      if (profilePicture) payload.profile_picture = profilePicture;
      if (remarksPhoto) payload.remarks_photo = remarksPhoto;
      await onSubmit(payload);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't save this profile. Please make sure every required field is filled in."));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name">
          <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Last name">
          <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Profile picture">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files?.[0] ?? null)}
          className={inputClass}
        />
        {initial?.profile_picture && !profilePicture && (
          <p className="text-xs text-charcoal-soft mt-1">A photo is already set. Choose a new file to replace it.</p>
        )}
      </Field>

      <Field label="Gender">
        <select required value={gender} onChange={(e) => setGender(e.target.value as Member["gender"])} className={inputClass}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </Field>

      <Field label="Role">
        <select required value={role} onChange={(e) => setRole(e.target.value as Member["role"])} className={inputClass}>
          <option value="member">Member</option>
          <option value="intern">Intern</option>
        </select>
        <p className="text-xs text-charcoal-soft mt-1">
          People who are already Leaders have their own Leader account instead of a profile here.
        </p>
      </Field>

      <Field label="Year level / life stage">
        <select
          required
          value={yearLevel}
          onChange={(e) => setYearLevel(e.target.value as Member["year_level"])}
          className={inputClass}
        >
          <option value="" disabled>
            — Select —
          </option>
          {YEAR_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="School / campus">
        <select required value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className={inputClass}>
          <option value="" disabled>
            — Select —
          </option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {schools.length === 0 && (
          <p className="text-xs text-brick mt-1">
            No schools set up yet. Ask a staff/coordinator account to add one under "Lists".
          </p>
        )}
      </Field>

      <Field label="Ministry team(s) (if serving)">
        {ministries.length === 0 ? (
          <p className="text-sm text-charcoal-soft">No ministries set up yet.</p>
        ) : (
          <div className="space-y-1.5">
            {ministries.map((m) => (
              <label key={m.id} className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={ministryIds.includes(m.id)}
                  onChange={(e) => {
                    setMinistryIds((prev) =>
                      e.target.checked ? [...prev, m.id] : prev.filter((id) => id !== m.id)
                    );
                  }}
                  className="w-4 h-4"
                />
                {m.name}
              </label>
            ))}
          </div>
        )}
      </Field>

      <Field label="Discipleship stage">
        <select
          required
          value={discipleshipStageId}
          onChange={(e) => setDiscipleshipStageId(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            — Select —
          </option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Remarks (an encouraging note or story about this member)">
        <textarea
          required
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={4}
          className={inputClass}
          placeholder="Share something encouraging about their journey…"
        />
      </Field>

      <Field label="Remarks photo (optional)">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setRemarksPhoto(e.target.files?.[0] ?? null)}
          className={inputClass}
        />
      </Field>

      {error && <p role="alert" className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-pine hover:bg-pine-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
