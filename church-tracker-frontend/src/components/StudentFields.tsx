import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Field, inputClass } from "./Form";
import { LEADER_YEAR_LEVEL_OPTIONS } from "../api/labels";
import type { Demography, LeaderYearLevel, School } from "../api/types";

const STUDENT_DEMOGRAPHIES: Demography[] = ["high_school", "college"];

interface StudentFieldsProps {
  demography: Demography;
  yearLevel: LeaderYearLevel | "";
  onYearLevelChange: (value: LeaderYearLevel | "") => void;
  schoolId: string;
  onSchoolIdChange: (value: string) => void;
}

export default function StudentFields({
  demography,
  yearLevel,
  onYearLevelChange,
  schoolId,
  onSchoolIdChange,
}: StudentFieldsProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const isStudent = STUDENT_DEMOGRAPHIES.includes(demography);

  // Schools are publicly readable (this form runs before login too), so
  // this fetch works whether or not the person has an account yet.
  useEffect(() => {
    api.get<School[]>("/schools/").then(setSchools).catch(() => {});
  }, []);

  if (!isStudent) return null;

  return (
    <>
      <Field label="Grade level / year">
        <select
          required
          value={yearLevel}
          onChange={(e) => onYearLevelChange(e.target.value as LeaderYearLevel)}
          className={inputClass}
        >
          <option value="" disabled>
            — Select —
          </option>
          {LEADER_YEAR_LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="School / campus">
        <select required value={schoolId} onChange={(e) => onSchoolIdChange(e.target.value)} className={inputClass}>
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
    </>
  );
}
