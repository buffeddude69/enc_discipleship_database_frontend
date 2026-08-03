import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api/client";
import { inputClass } from "../components/Form";
import type { DiscipleshipStage, Ministry, School } from "../api/types";

export default function ManageLookups() {
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <h2 className="font-display text-2xl font-semibold text-pine">Manage Lists</h2>
      <SchoolsSection />
      <MinistriesSection />
      <DiscipleshipStagesSection />
    </div>
  );
}

function SchoolsSection() {
  const [schools, setSchools] = useState<School[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get<School[]>("/schools/").then(setSchools).catch(() => {});
  }

  useEffect(load, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post<School>("/schools/", { name: name.trim() });
      setName("");
      load();
    } catch {
      setError("Couldn't add that school. It may already exist.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this school? Members assigned to it will need a new school selected.")) return;
    try {
      await api.delete(`/schools/${id}/`);
      load();
    } catch {
      setError("Couldn't remove that school. Members may still be assigned to it.");
    }
  }

  return (
    <section>
      <h3 className="font-medium text-charcoal mb-3">Schools / Campuses</h3>
      <div className="bg-white rounded-2xl border border-sage-light p-5">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. De La Salle Santa Rosa, N/A"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-pine hover:bg-pine-dark disabled:opacity-60 text-white text-sm font-medium px-4 rounded-lg transition-colors shrink-0"
          >
            Add
          </button>
        </form>

        {error && <p className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2 mb-3">{error}</p>}

        <ul className="space-y-1.5">
          {schools.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm text-charcoal px-1">
              {s.name}
              <button onClick={() => handleDelete(s.id)} className="text-brick text-xs font-medium hover:text-brick/80">
                Remove
              </button>
            </li>
          ))}
          {schools.length === 0 && <p className="text-sm text-charcoal-soft">No schools added yet.</p>}
        </ul>
      </div>
    </section>
  );
}

function MinistriesSection() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get<Ministry[]>("/ministries/").then(setMinistries).catch(() => {});
  }

  useEffect(load, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post<Ministry>("/ministries/", { name: name.trim() });
      setName("");
      load();
    } catch {
      setError("Couldn't add that ministry. It may already exist.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this ministry? Members currently assigned to it will just lose that tag.")) return;
    try {
      await api.delete(`/ministries/${id}/`);
      load();
    } catch {
      setError("Couldn't remove that ministry. Please try again.");
    }
  }

  return (
    <section>
      <h3 className="font-medium text-charcoal mb-3">Ministry Teams</h3>
      <div className="bg-white rounded-2xl border border-sage-light p-5">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Music, Ushering, TSM"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-pine hover:bg-pine-dark disabled:opacity-60 text-white text-sm font-medium px-4 rounded-lg transition-colors shrink-0"
          >
            Add
          </button>
        </form>

        {error && <p className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2 mb-3">{error}</p>}

        <ul className="space-y-1.5">
          {ministries.map((m) => (
            <li key={m.id} className="flex items-center justify-between text-sm text-charcoal px-1">
              {m.name}
              <button onClick={() => handleDelete(m.id)} className="text-brick text-xs font-medium hover:text-brick/80">
                Remove
              </button>
            </li>
          ))}
          {ministries.length === 0 && <p className="text-sm text-charcoal-soft">No ministries added yet.</p>}
        </ul>
      </div>
    </section>
  );
}

function DiscipleshipStagesSection() {
  const [stages, setStages] = useState<DiscipleshipStage[]>([]);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.get<DiscipleshipStage[]>("/discipleship-stages/").then(setStages).catch(() => {});
  }

  useEffect(load, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post<DiscipleshipStage>("/discipleship-stages/", {
        name: name.trim(),
        order: order ? Number(order) : 0,
      });
      setName("");
      setOrder("");
      load();
    } catch {
      setError("Couldn't add that stage. It may already exist.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this discipleship stage? Members currently on it will just lose that tag.")) return;
    try {
      await api.delete(`/discipleship-stages/${id}/`);
      load();
    } catch {
      setError("Couldn't remove that stage. Please try again.");
    }
  }

  return (
    <section>
      <h3 className="font-medium text-charcoal mb-3">Discipleship Stages</h3>
      <div className="bg-white rounded-2xl border border-sage-light p-5">
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Believer, Growing"
            className={inputClass}
          />
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="Order"
            className={`${inputClass} w-24`}
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-pine hover:bg-pine-dark disabled:opacity-60 text-white text-sm font-medium px-4 rounded-lg transition-colors shrink-0"
          >
            Add
          </button>
        </form>

        {error && <p className="text-sm text-brick bg-brick-light rounded-lg px-3 py-2 mb-3">{error}</p>}

        <ul className="space-y-1.5">
          {stages.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm text-charcoal px-1">
              <span>
                {s.name} <span className="text-charcoal-soft">· order {s.order}</span>
              </span>
              <button onClick={() => handleDelete(s.id)} className="text-brick text-xs font-medium hover:text-brick/80">
                Remove
              </button>
            </li>
          ))}
          {stages.length === 0 && <p className="text-sm text-charcoal-soft">No stages added yet.</p>}
        </ul>
      </div>
    </section>
  );
}
