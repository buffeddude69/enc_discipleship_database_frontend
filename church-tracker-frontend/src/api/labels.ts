import type { AttendanceStatus, Demography, GroupDemography, LeaderRole, LeaderYearLevel, MemberRole, YearLevel } from "../api/types";

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

export const ROLE_LABELS: Record<MemberRole, string> = {
  member: "Member",
  intern: "Intern",
};

export const LEADER_ROLE_LABELS: Record<LeaderRole, string> = {
  small_group_leader: "Small Group Leader",
  leadership_group_leader: "Leadership Group Leader",
  campus_missionary: "Campus Missionary",
};

export const LEADER_YEAR_LEVEL_OPTIONS: { value: LeaderYearLevel; label: string }[] = [
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
];

export const LEADER_YEAR_LEVEL_LABELS: Record<LeaderYearLevel, string> = Object.fromEntries(
  LEADER_YEAR_LEVEL_OPTIONS.map((o) => [o.value, o.label])
) as Record<LeaderYearLevel, string>;

export const DEMOGRAPHY_LABELS: Record<Demography, string> = {
  high_school: "High School",
  college: "College",
  single_young_professional: "Single / Young Professional",
  married: "Married",
  parent: "Parent",
  senior: "Senior",
};

export const AREA_LABELS: Record<string, string> = {
  binan: "Binan",
  nuvali: "Nuvali",
  santa_rosa_city: "Santa Rosa City",
};

export const GROUP_DEMOGRAPHY_LABELS: Record<GroupDemography, string> = {
  high_school: "High School",
  college: "College",
  mixed: "Mixed",
  others: "Others",
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
