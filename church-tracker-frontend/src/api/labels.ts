import type { AttendanceStatus, RoleInGroup, YearLevel } from "../api/types";

export const YEAR_LEVEL_OPTIONS: { value: YearLevel; label: string }[] = [
  { value: "elementary", label: "Elementary" },
  { value: "grade_7", label: "Grade 7" },
  { value: "grade_8", label: "Grade 8" },
  { value: "grade_9", label: "Grade 9" },
  { value: "grade_10", label: "Grade 10" },
  { value: "grade_11", label: "Grade 11" },
  { value: "grade_12", label: "Grade 12" },
  { value: "college_1", label: "1st Year College" },
  { value: "college_2", label: "2nd Year College" },
  { value: "college_3", label: "3rd Year College" },
  { value: "college_4", label: "4th Year College" },
  { value: "college_5_plus", label: "5th+ Year College" },
  { value: "out_of_school", label: "Out of School" },
  { value: "adult", label: "Adult" },
];

export const YEAR_LEVEL_LABELS: Record<YearLevel, string> = Object.fromEntries(
  YEAR_LEVEL_OPTIONS.map((o) => [o.value, o.label])
) as Record<YearLevel, string>;

export const ROLE_LABELS: Record<RoleInGroup, string> = {
  member: "Member",
  intern: "Intern",
  leader: "Leader",
};

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  new: "New (joined this month)",
  active: "Active (attended this month)",
  inactive: "Inactive (no attendance this month)",
};

export const ATTENDANCE_DOT_COLOR: Record<AttendanceStatus, string> = {
  new: "bg-amber",
  active: "bg-pine",
  inactive: "bg-brick",
};
