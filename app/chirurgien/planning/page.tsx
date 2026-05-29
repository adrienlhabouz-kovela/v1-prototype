"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Modal, PageHeader } from "@/components/ui";
import { useKovela, type PlanningInput } from "@/lib/store";
import {
  formatDate,
  formatDateTime,
  onboardingLabels,
  onboardingStyles,
  planningLabels,
  planningStyles,
} from "@/lib/format";
import type { Patient } from "@/lib/types";

const MY_SURGEON_ID = "s1";

const PROTOCOLS = ["J+8 / J+15", "J+12 / J+15", "J+8 / J+12 / J+15"];

const TEMPLATE_FIELDS = [
  "prénom",
  "nom",
  "téléphone",
  "email",
  "date intervention",
  "heure",
  "type intervention",
  "lieu",
  "durée de suivi",
  "commentaire cabinet",
];

// Exemple fictif pour simuler un import (aucun vrai fichier).
const EXAMPLE_ROWS: PlanningInput[] = [
  {
    name: "Amélie Rousseau",
    intervention: "Blépharoplastie",
    interventionDate: "2026-06-10",
    interventionTime: "08:30",
    clinic: "Clinique du Parc",
    phone: "06 00 00 01 11",
    email: "amelie.rousseau@exemple.test",
    protocol: "J+8 / J+15",
    cabinetNote: "",
  },
  {
    name: "Yacine Hadji",
    intervention: "Otoplastie",
    interventionDate: "2026-06-12",
    interventionTime: "10:00",
    clinic: "Clinique du Parc",
    phone: "06 00 00 01 12",
    email: "yacine.hadji@exemple.test",
    protocol: "J+12 / J+15",
    cabinetNote: "Dossier transmis par le cabinet.",
  },
  {
    name: "Inès Fabre",
    intervention: "Lifting cervico-facial",
    interventionDate: "2026-06-15",
    interventionTime: "14:00",
    clinic: "Institut Lutèce",
    phone: "06 00 00 01 13",
    email: "ines.fabre@exemple.test",
    protocol: "J+8 / J+15",
    cabinetNote: "",
  },
];

const FLOW = [
  "Planning opératoire",
  "Onboarding préparé",
  "Lien d'activation envoyé",
  "Patient actif",
  "Supervision & CR",
];

function toDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function emptyInput(): PlanningInput {
  return {
    name: "",
    intervention: "",
    interventionDate: "",
    interventionTime: "09:00",
    clinic: "Clinique du Parc",
    phone: "",
    email: "",
    protocol: "J+8 / J+15",
    cabinetNote: "",
  };
}

export default function PlanningPage() {
  const k = useKovela();
  const config = k.surgeon(MY_SURGEON_ID)?.config;
  const interventionTypes = useMemo(
    () => (config ? Object.keys(config.interventionDurations) : []),
    [config]
  );
  const protocolFor = (intervention: string): string | undefined =>
    config?.interventionDurations[intervention] ?? config?.defaultProtocol;
  const firstType = interventionTypes[0] ?? "";
  // Le planning reprend les préférences du cabinet (lieu + type + durée).
  const addDefaults: PlanningInput = {
    ...emptyInput(),
    clinic: config?.locations[0] ?? "Clinique du Parc",
    intervention: firstType,
    protocol: protocolFor(firstType) ?? config?.defaultProtocol ?? "J+8 / J+15",
  };

  const planning = useMemo(
    () =>
      k.patients
        .filter((p) => p.surgeonId === MY_SURGEON_ID)
        .sort((a, b) => new Date(b.interventionDate).getTime() - new Date(a.interventionDate).getTime()),
    [k.patients]
  );

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [postponeTarget, setPostponeTarget] = useState<Patient | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Patient | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <Shell>
      <PageHeader
        eyebrow={k.surgeonName(MY_SURGEON_ID)}
        title="Planning opératoire"
        subtitle="Une fois le service cabinet activé, le cabinet transmet son planning opératoire à KOVELA. L'équipe prépare ensuite l'onboarding patient et le suivi."
      >
        <Button variant="secondary" onClick={() => setImportOpen(true)}>
          Importer un planning
        </Button>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          Ajouter un patient
        </Button>
      </PageHeader>

      {/* Flux d'entrée KOVELA */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-charcoal/60">
          {FLOW.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-full bg-navy-50 px-2.5 py-1 font-medium text-navy-900">{step}</span>
              {i < FLOW.length - 1 && <span className="text-teal-500">→</span>}
            </span>
          ))}
        </div>
      </Card>

      {config && !config.referentielComplete && (
        <Card className="mb-6 border border-amber-200 bg-amber-50/40 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-charcoal/75">
              Le planning peut être transmis, mais KOVELA aura besoin du{" "}
              <span className="font-medium text-navy-900">référentiel de suivi cabinet</span> pour
              préparer les parcours patients selon les habitudes de votre cabinet.
            </p>
            <Link href="/chirurgien/referentiel-suivi">
              <Button variant="subtle">Compléter le référentiel</Button>
            </Link>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                <th className="px-5 py-3.5 font-medium">Patient</th>
                <th className="px-5 py-3.5 font-medium">Intervention</th>
                <th className="px-5 py-3.5 font-medium">Date & heure</th>
                <th className="px-5 py-3.5 font-medium">Lieu</th>
                <th className="px-5 py-3.5 font-medium">Suivi</th>
                <th className="px-5 py-3.5 font-medium">Onboarding</th>
                <th className="px-5 py-3.5 font-medium">Superviseur</th>
                <th className="px-5 py-3.5 font-medium">Statut KOVELA</th>
                <th className="px-5 py-3.5 font-medium">MAJ</th>
                <th className="px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {planning.map((p) => {
                const cancelled = p.planningStatus === "annule";
                return (
                  <tr
                    key={p.id}
                    className={`border-b border-navy-900/[0.04] align-top ${
                      cancelled ? "opacity-55" : "hover:bg-teal-50/30"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-navy-900">{p.name}</div>
                      <div className="text-xs text-charcoal/45">{p.phone}</div>
                      <div className="text-xs text-charcoal/45">{p.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/70">{p.intervention}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">
                      {formatDate(p.interventionDate)}
                      <div className="text-xs text-charcoal/45">{p.interventionTime}</div>
                    </td>
                    <td className="px-5 py-3.5 text-charcoal/70">{p.clinic}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{p.protocol}</td>
                    <td className="px-5 py-3.5">
                      <Badge className={onboardingStyles[p.onboardingStatus]}>
                        {onboardingLabels[p.onboardingStatus]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.supervisorId ? (
                        <span className="text-charcoal/70">{k.supervisorName(p.supervisorId)}</span>
                      ) : (
                        <span className="text-amber-600">Non assigné</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={planningStyles[p.planningStatus]}>
                        {planningLabels[p.planningStatus]}
                      </Badge>
                      {p.planningStatus === "reporte" && (
                        <div className="mt-1 text-[11px] text-amber-600">
                          Date mise à jour — onboarding à reprogrammer
                        </div>
                      )}
                      {cancelled && (
                        <div className="mt-1 text-[11px] text-charcoal/45">
                          Intervention annulée — suivi non activé
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-charcoal/45">
                      {formatDate(p.planningUpdatedAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col items-start gap-1 text-xs">
                        <button
                          onClick={() => setEditTarget(p)}
                          className="font-medium text-teal-600 hover:text-teal-700"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setPostponeTarget(p)}
                          className="text-charcoal/60 hover:text-navy-900"
                        >
                          Reporter
                        </button>
                        {!p.onboardingComplete && (
                          <button
                            onClick={() => k.resendOnboardingLink(p.id)}
                            className="text-charcoal/60 hover:text-navy-900"
                          >
                            Renvoyer lien
                          </button>
                        )}
                        <Link
                          href={`/chirurgien/patient/${p.id}`}
                          className="text-charcoal/60 hover:text-navy-900"
                        >
                          Voir dossier
                        </Link>
                        {!cancelled && (
                          <button
                            onClick={() => setCancelTarget(p)}
                            className="text-rose-600 hover:text-rose-700"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
        Données fictives. Aucune vraie intégration agenda, aucune notification réelle. Les patients
        importés apparaissent ensuite côté Admin (à attribuer) puis, une fois l'onboarding complété,
        dans le suivi superviseur.
      </p>

      {/* Modal ajout */}
      <PlanningFormModal
        open={addOpen}
        title="Ajouter un patient au planning"
        initial={addDefaults}
        submitLabel="Ajouter au planning"
        interventionTypes={interventionTypes}
        protocolFor={protocolFor}
        onClose={() => setAddOpen(false)}
        onSubmit={(input) => {
          k.addPlanningPatient(input);
          setAddOpen(false);
        }}
      />

      {/* Modal modification */}
      <PlanningFormModal
        open={editTarget !== null}
        title={`Modifier — ${editTarget?.name ?? ""}`}
        initial={
          editTarget
            ? {
                name: editTarget.name,
                intervention: editTarget.intervention,
                interventionDate: toDateInput(editTarget.interventionDate),
                interventionTime: editTarget.interventionTime,
                clinic: editTarget.clinic,
                phone: editTarget.phone,
                email: editTarget.email,
                protocol: editTarget.protocol,
                cabinetNote: editTarget.cabinetNote,
              }
            : emptyInput()
        }
        submitLabel="Enregistrer les modifications"
        interventionTypes={interventionTypes}
        protocolFor={protocolFor}
        onClose={() => setEditTarget(null)}
        onSubmit={(input) => {
          if (editTarget) k.updatePlanningPatient(editTarget.id, input);
          setEditTarget(null);
        }}
      />

      {/* Modal report */}
      <PostponeModal
        target={postponeTarget}
        onClose={() => setPostponeTarget(null)}
        onConfirm={(date, time) => {
          if (postponeTarget) k.postponeIntervention(postponeTarget.id, date, time);
          setPostponeTarget(null);
        }}
      />

      {/* Modal annulation */}
      <Modal
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        title={`Annuler l'intervention — ${cancelTarget?.name ?? ""}`}
      >
        <p className="text-sm text-charcoal/70">
          L'intervention sera marquée comme annulée. Mention affichée :{" "}
          <span className="font-medium text-navy-900">« Intervention annulée — suivi non activé »</span>.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCancelTarget(null)}>
            Retour
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (cancelTarget) k.cancelIntervention(cancelTarget.id);
              setCancelTarget(null);
            }}
          >
            Confirmer l'annulation
          </Button>
        </div>
      </Modal>

      {/* Modal import */}
      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onValidate={(rows) => {
          k.importPlanning(rows);
          setImportOpen(false);
        }}
      />
    </Shell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-charcoal/60">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

function PlanningFormModal({
  open,
  title,
  initial,
  submitLabel,
  interventionTypes,
  protocolFor,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  initial: PlanningInput;
  submitLabel: string;
  interventionTypes?: string[];
  protocolFor?: (intervention: string) => string | undefined;
  onClose: () => void;
  onSubmit: (input: PlanningInput) => void;
}) {
  const [form, setForm] = useState<PlanningInput>(initial);

  // Réinitialise le formulaire à chaque ouverture / changement de cible.
  const [seed, setSeed] = useState("");
  const currentSeed = `${open}-${initial.name}-${initial.interventionDate}`;
  if (open && seed !== currentSeed) {
    setSeed(currentSeed);
    setForm(initial);
  }

  const set = (k: keyof PlanningInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom du patient (fictif)">
          <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Prénom Nom" />
        </Field>
        <Field label="Type d'intervention">
          {interventionTypes && interventionTypes.length > 0 ? (
            <select
              className={inputCls}
              value={form.intervention}
              onChange={(e) => {
                const v = e.target.value;
                const newProto = protocolFor?.(v);
                setForm((f) => ({ ...f, intervention: v, protocol: newProto ?? f.protocol }));
              }}
            >
              {[form.intervention, ...interventionTypes]
                .filter((v, i, a) => v && a.indexOf(v) === i)
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          ) : (
            <input className={inputCls} value={form.intervention} onChange={set("intervention")} placeholder="ex : Rhinoplastie" />
          )}
        </Field>
        <Field label="Date d'intervention">
          <input type="date" className={inputCls} value={form.interventionDate} onChange={set("interventionDate")} />
        </Field>
        <Field label="Heure">
          <input type="time" className={inputCls} value={form.interventionTime} onChange={set("interventionTime")} />
        </Field>
        <Field label="Lieu / clinique">
          <input className={inputCls} value={form.clinic} onChange={set("clinic")} />
        </Field>
        <Field label="Durée de suivi prévue">
          <select className={inputCls} value={form.protocol} onChange={set("protocol")}>
            {[form.protocol, ...PROTOCOLS]
              .filter((v, i, a) => v && a.indexOf(v) === i)
              .map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
          </select>
          <span className="mt-1 block text-[11px] text-charcoal/45">
            Durée proposée selon les préférences de fonctionnement du cabinet. Modifiable patient par patient.
          </span>
        </Field>
        <Field label="Téléphone (fictif)">
          <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="06 00 00 00 00" />
        </Field>
        <Field label="Email (fictif)">
          <input className={inputCls} value={form.email} onChange={set("email")} placeholder="prenom.nom@exemple.test" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Commentaire cabinet">
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              value={form.cabinetNote}
              onChange={set("cabinetNote")}
            />
          </Field>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" disabled={!form.name.trim()} onClick={() => onSubmit(form)}>
          {submitLabel}
        </Button>
      </div>
    </Modal>
  );
}

function PostponeModal({
  target,
  onClose,
  onConfirm,
}: {
  target: Patient | null;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seed, setSeed] = useState("");
  if (target && seed !== target.id) {
    setSeed(target.id);
    setDate(toDateInput(target.interventionDate));
    setTime(target.interventionTime);
  }

  return (
    <Modal open={target !== null} onClose={onClose} title={`Reporter — ${target?.name ?? ""}`}>
      <p className="mb-4 text-sm text-charcoal/70">
        Nouvelle date d'intervention. L'onboarding sera à reprogrammer.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nouvelle date">
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Heure">
          <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Retour
        </Button>
        <Button variant="primary" disabled={!date} onClick={() => onConfirm(date, time)}>
          Reporter l'intervention
        </Button>
      </div>
    </Modal>
  );
}

function ImportModal({
  open,
  onClose,
  onValidate,
}: {
  open: boolean;
  onClose: () => void;
  onValidate: (rows: PlanningInput[]) => void;
}) {
  const [preview, setPreview] = useState<PlanningInput[] | null>(null);

  function close() {
    setPreview(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={close} title="Importer un planning opératoire" wide>
      <p className="text-sm text-charcoal/70">
        Import simulé (aucun vrai fichier traité). Formats attendus : CSV / Excel avec les colonnes
        suivantes.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TEMPLATE_FIELDS.map((f) => (
          <span key={f} className="rounded-md bg-navy-50 px-2 py-0.5 text-[11px] text-charcoal/70">
            {f}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-navy-200 bg-navy-50/40 p-6 text-center">
        <p className="text-sm text-charcoal/60">Déposez un fichier CSV / Excel (simulation)</p>
        <div className="mt-3 flex justify-center gap-2">
          <Button variant="subtle" disabled>
            Choisir un fichier
          </Button>
          <Button variant="secondary" onClick={() => setPreview(EXAMPLE_ROWS)}>
            Charger un exemple
          </Button>
        </div>
      </div>

      {preview && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal/50">
            Aperçu de l'import ({preview.length} patients)
          </p>
          <div className="overflow-hidden rounded-xl ring-1 ring-navy-100">
            <table className="w-full text-xs">
              <thead className="bg-navy-50/60 text-left text-charcoal/50">
                <tr>
                  <th className="px-3 py-2 font-medium">Patient</th>
                  <th className="px-3 py-2 font-medium">Intervention</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Heure</th>
                  <th className="px-3 py-2 font-medium">Suivi</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t border-navy-900/[0.05]">
                    <td className="px-3 py-2 text-navy-900">{r.name}</td>
                    <td className="px-3 py-2 text-charcoal/70">{r.intervention}</td>
                    <td className="px-3 py-2 text-charcoal/70">{r.interventionDate}</td>
                    <td className="px-3 py-2 text-charcoal/70">{r.interventionTime}</td>
                    <td className="px-3 py-2 text-charcoal/70">{r.protocol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={close}>
          Fermer
        </Button>
        <Button variant="primary" disabled={!preview} onClick={() => preview && onValidate(preview)}>
          Valider l'import
        </Button>
      </div>
    </Modal>
  );
}
