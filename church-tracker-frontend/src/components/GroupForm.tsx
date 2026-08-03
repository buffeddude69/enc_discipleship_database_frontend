import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Field, inputClass } from "./Form";
import type { Group, User } from "../api/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

interface GroupFormProps {
  initial?: Group;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel: string;
}

export default function GroupForm({ initial, onSubmit, submitLabel }: GroupFormProps) {
  const { user } = useAuth();

  const [name, setName] = useState(initial?.name ?? "");
  const [groupType, setGroupType] = useState<Group["group_type"]>(initial?.group_type ?? "small_group");
  const [genderComposition, setGenderComposition] = useState<Group["gender_composition"]>(
    initial?.gender_composition ?? "mixed"
  );
  const [meetingFrequency, setMeetingFrequency] = useState<Group["meeting_frequency"]>(
    initial?.meeting_frequency ?? "weekly"
  );
  const [meetingDay, setMeetingDay] = useState<Group["meeting_day"]>(initial?.meeting_day ?? "");
  const [meetingTime, setMeetingTime] = useState(initial?.meeting_time?.slice(0, 5) ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [leaderId, setLeaderId] = useState<string>(initial?.leader ? String(initial.leader) : "");

  const [leaders, setLeaders] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.is_staff) {
      api.get<User[]>("/auth/leaders/").then(setLeaders).catch(() => {});
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        group_type: groupType,
        gender_composition: genderComposition,
        meeting_frequency: meetingFrequency,
        meeting_day: meetingDay,
        meeting_time: meetingTime || null,
        venue,
        is_active: isActive,
        ...(user?.is_staff && leaderId ? { leader: Number(leaderId) } : {}),
      });
    } catch {
      setError("Couldn't save the group. Please check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sage-light p-6 space-y-4">
      <Field label="Group name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Friday Youth Circle"
        />
      </Field>

      {user?.is_staff && (
        <Field label="Leader">
          <select value={leaderId} onChange={(e) => setLeaderId(e.target.value)} className={inputClass}>
            <option value="">— Assign to myself —</option>
            {leaders.map((l) => (
              <option key={l.id} value={l.id}>
                {l.first_name} {l.last_name}
                {l.is_staff ? " (Staff)" : ""}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Group type">
        <select value={groupType} onChange={(e) => setGroupType(e.target.value as Group["group_type"])} className={inputClass}>
          <option value="small_group">Small Group</option>
          <option value="leadership_group">Leadership Group</option>
          <option value="campus_ministry">Campus Ministry</option>
        </select>
      </Field>

      <Field label="Gender composition">
        <select
          value={genderComposition}
          onChange={(e) => setGenderComposition(e.target.value as Group["gender_composition"])}
          className={inputClass}
        >
          <option value="mixed">Mixed</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
      </Field>

      <Field label="How often does the group meet?">
        <select
          value={meetingFrequency}
          onChange={(e) => setMeetingFrequency(e.target.value as Group["meeting_frequency"])}
          className={inputClass}
        >
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Meeting day">
        <select value={meetingDay} onChange={(e) => setMeetingDay(e.target.value as Group["meeting_day"])} className={inputClass}>
          <option value="">— Not set —</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d[0].toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Meeting time">
        <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Venue">
        <input value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClass} placeholder="e.g. Leader's home, Room 203" />
      </Field>

      {initial && (
        <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
          Group is currently active
        </label>
      )}

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
