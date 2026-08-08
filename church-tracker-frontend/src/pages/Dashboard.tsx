import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { DashboardData } from "../api/types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DashboardData>("/dashboard/").then(setData).catch(() => setError("Couldn't load dashboard data."));
  }, []);

  if (error) return <p className="text-brick bg-brick-light rounded-lg px-4 py-3 max-w-2xl mx-auto">{error}</p>;
  if (!data) return <p className="text-charcoal-soft">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="font-display text-2xl font-semibold text-pine">Dashboard</h2>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Member Profiles" value={data.total_members} />
        <StatCard label="Leader Accounts" value={data.total_leaders} />
        <StatCard label="Group Memberships" value={data.total_memberships} />
      </div>

      <Section title="By Role">
        <StatRow label="Members" value={data.by_role.member} />
        <StatRow label="Interns" value={data.by_role.intern} />
      </Section>

      <Section title="This Month's Attendance">
        <StatRow label="New" value={data.by_attendance_status.new} dotClass="bg-amber" />
        <StatRow label="Active" value={data.by_attendance_status.active} dotClass="bg-pine" />
        <StatRow label="Inactive" value={data.by_attendance_status.inactive} dotClass="bg-brick" />
      </Section>

      <Section title="By School / Campus">
        {Object.entries(data.by_school).length === 0 && (
          <p className="text-sm text-charcoal-soft">No data yet.</p>
        )}
        {Object.entries(data.by_school).map(([name, count]) => (
          <StatRow key={name} label={name} value={count} />
        ))}
      </Section>

      <Section title="Students by Area">
        {Object.entries(data.by_area).length === 0 && (
          <p className="text-sm text-charcoal-soft">No data yet.</p>
        )}
        {Object.entries(data.by_area).map(([name, count]) => (
          <StatRow key={name} label={name} value={count} />
        ))}
      </Section>

      <Section title="Leaders by Area">
        {Object.entries(data.leaders_by_area).length === 0 && (
          <p className="text-sm text-charcoal-soft">No data yet.</p>
        )}
        {Object.entries(data.leaders_by_area).map(([name, count]) => (
          <StatRow key={name} label={name} value={count} />
        ))}
      </Section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-sage-light p-5 text-center">
      <p className="font-display text-3xl font-semibold text-pine">{value}</p>
      <p className="text-sm text-charcoal-soft mt-1">{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-medium text-charcoal mb-3">{title}</h3>
      <div className="bg-white rounded-2xl border border-sage-light p-5 space-y-2.5">{children}</div>
    </section>
  );
}

function StatRow({ label, value, dotClass }: { label: string; value: number; dotClass?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-charcoal">
        {dotClass && <span className={`inline-block w-2 h-2 rounded-full ${dotClass}`} />}
        {label}
      </span>
      <span className="font-medium text-charcoal">{value}</span>
    </div>
  );
}
