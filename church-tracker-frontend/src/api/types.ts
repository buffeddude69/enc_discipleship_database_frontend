// These mirror the DRF serializers exactly -- keep in sync with the backend.

export type LeaderRole = "small_group_leader" | "leadership_group_leader" | "campus_missionary";
export type Demography = "student_youth" | "single_young_professional" | "married" | "parent" | "senior";
export type Gender = "male" | "female";
export type Area = "binan" | "nuvali" | "santa_rosa_city";

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  leader_role: LeaderRole;
  demography: Demography;
  gender: Gender;
  area: Area;
  contact_number: string;
  is_staff: boolean;
  groups_led: string[];
  groups_member_of: string[];
}

export type GroupType = "small_group" | "leadership_group" | "campus_ministry";
export type GenderComposition = "men" | "women" | "mixed";
export type MeetingFrequency = "weekly" | "biweekly" | "monthly" | "other";
export type MeetingDay =
  | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | "";

export interface Group {
  id: number;
  name: string;
  leader: number;
  leader_name: string;
  group_type: GroupType;
  gender_composition: GenderComposition;
  meeting_frequency: MeetingFrequency;
  meeting_frequency_note: string;
  meeting_day: MeetingDay;
  meeting_time: string | null;
  venue: string;
  is_active: boolean;
  member_count: number;
  active_member_count: number;
  created_at: string;
  updated_at: string;
}

export type YearLevel =
  | "elementary" | "grade_7" | "grade_8" | "grade_9" | "grade_10" | "grade_11" | "grade_12"
  | "college_1" | "college_2" | "college_3" | "college_4" | "college_5_plus"
  | "out_of_school" | "adult";

export interface School {
  id: number;
  name: string;
}

export interface Ministry {
  id: number;
  name: string;
}

export interface DiscipleshipStage {
  id: number;
  name: string;
  order: number;
}

export type MemberRole = "member" | "intern";

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  role: MemberRole;
  year_level: YearLevel;
  school: number;
  school_name: string;
  is_in_ministry: boolean;
  ministries: number[];
  ministry_names: string[];
  discipleship_stage: number | null;
  discipleship_stage_name: string | null;
  remarks: string;
  remarks_photo: string | null;
  needs_update: boolean;
  group_names: string[];
  created_at: string;
  updated_at: string;
}

export type AttendanceStatus = "new" | "active" | "inactive";
export type PersonType = "member" | "leader";

export interface GroupMembership {
  id: number;
  group: number;
  group_name: string;
  member: number | null;
  member_detail: Member | null;
  leader: number | null;
  leader_detail: User | null;
  person_name: string;
  person_type: PersonType;
  attendance_status: AttendanceStatus;
  date_joined_group: string;
  status_updated_at: string;
  needs_update: boolean;
}

export interface DashboardData {
  total_members: number;
  total_memberships: number;
  total_leaders: number;
  by_role: { member: number; intern: number };
  by_attendance_status: { new: number; active: number; inactive: number };
  by_school: Record<string, number>;
  by_area: Record<string, number>;
  leaders_by_area: Record<string, number>;
}
