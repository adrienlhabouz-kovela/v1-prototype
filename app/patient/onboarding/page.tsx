"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card } from "@/components/ui";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { useKovela } from "@/lib/store";
import { formatDate } from "@/lib/format";

const PATIENT_ID = "p1"; // Camille Moreau (patient de démo)

export default function PatientOnboarding() {
  const k = useKovela();
  const router = useRouter();
  const patient = k.patients.find((p) => p.id === PATIENT_ID);

  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState({ limites: false, consent: false, urgence: false });
  const [infoStatus, setInfoStatus] = useState<"pending" | "confirmed" | "reported">("pending");
  const [prefs, setPrefs] = useState({ photo: true, audio: true, relances: true, notifications: true });

  if (!patient) return null;

  const done = patient.onboardingComplete;
  const cabinetConfig = k.surgeon(patient.surgeonId)?.config;

  const steps = [
    {
      title: "Bienvenue dans votre suivi KOVELA",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
          <p className="font-display text-lg text-navy-900">
            Votre suivi post-op, organisé simplement.
          </p>
          <p>
            Bonjour {patient.name.split(" ")[0]}, votre chirurgien{" "}
            <span className="font-medium text-navy-900">{k.surgeonName(patient.surgeonId)}</span> vous
            a invité(e) à un suivi post-opératoire structuré.
          </p>
          <p>
            KOVELA assure la <span className="font-medium">coordination</span> et la{" "}
            <span className="font-medium">continuité post-opératoire</span> entre vous et votre
            chirurgien.
          </p>
        </div>
      ),
      canNext: true,
    },
    {
      title: "Confirmez vos informations",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
          <p className="text-charcoal/60">
            Vérifiez que ces informations correspondent bien à votre situation.
          </p>
          <dl className="divide-y divide-navy-900/[0.05] rounded-xl bg-navy-50/40 p-2 text-sm">
            <Row label="Chirurgien" value={k.surgeonName(patient.surgeonId)} />
            <Row label="Type d'intervention" value={patient.intervention} />
            <Row label="Date d'intervention" value={formatDate(patient.interventionDate)} />
            <Row label="Durée de suivi prévue" value={patient.protocol} />
          </dl>
          {infoStatus === "pending" && (
            <div className="flex gap-2 pt-1">
              <Button variant="primary" onClick={() => setInfoStatus("confirmed")}>
                C'est correct
              </Button>
              <Button
                variant="subtle"
                onClick={() => {
                  k.reportCabinetIssue(patient.id);
                  setInfoStatus("reported");
                }}
              >
                Signaler une erreur au cabinet
              </Button>
            </div>
          )}
          {infoStatus === "confirmed" && (
            <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Informations confirmées</Badge>
          )}
          {infoStatus === "reported" && (
            <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
              Signalement envoyé à l'équipe KOVELA
            </Badge>
          )}
        </div>
      ),
      canNext: infoStatus !== "pending",
    },
    {
      title: "Comprendre les limites du service",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
          <UrgencyBanner />
          <ul className="list-disc space-y-1.5 pl-5">
            <li>KOVELA ne remplace pas une consultation médicale.</li>
            <li>KOVELA ne donne pas d'avis médical : toute décision relève de votre chirurgien.</li>
            <li>KOVELA assure la coordination et la continuité de votre suivi post-opératoire.</li>
            <li>Vos messages sont traités par une équipe humaine de coordination.</li>
          </ul>
          <label className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              checked={accepted.limites}
              onChange={(e) => setAccepted((a) => ({ ...a, limites: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal-600"
            />
            <span className="text-navy-900">J'ai compris les limites du service.</span>
          </label>
        </div>
      ),
      canNext: accepted.limites,
    },
    {
      title: "Consentement (fictif)",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
          <p>
            J'accepte que mes messages et pièces jointes soient utilisés dans le cadre de la
            coordination de mon suivi post-opératoire, sous supervision humaine.
          </p>
          <p className="text-xs text-charcoal/45">
            Consentement de démonstration uniquement. Aucune donnée réelle n'est collectée.
          </p>
          <label className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              checked={accepted.consent}
              onChange={(e) => setAccepted((a) => ({ ...a, consent: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal-600"
            />
            <span className="text-navy-900">Je donne mon consentement.</span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={accepted.urgence}
              onChange={(e) => setAccepted((a) => ({ ...a, urgence: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal-600"
            />
            <span className="text-navy-900">
              Je confirme avoir pris connaissance du rappel d'urgence (15 / 112).
            </span>
          </label>
        </div>
      ),
      canNext: accepted.consent && accepted.urgence,
    },
    {
      title: "Préférences de suivi",
      content: (
        <div className="space-y-3 text-sm leading-relaxed text-charcoal/70">
          <p className="text-charcoal/60">
            Indiquez vos préférences pour le suivi (uniquement organisationnel).
          </p>
          {(
            [
              ["photo", "Autoriser l'envoi de photos dans la messagerie"],
              ["audio", "Autoriser l'envoi de mémos vocaux dans la messagerie"],
              ["relances", "Accepter les relances de suivi (équipe de coordination)"],
              ["notifications", "Accepter les notifications liées au suivi"],
            ] as [keyof typeof prefs, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-start gap-2 rounded-xl border border-navy-100 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal-600"
              />
              <span className="text-navy-900">{label}</span>
            </label>
          ))}
          <p className="text-[11px] text-charcoal/45">
            Aucune question médicale, aucune analyse de symptôme. Périmètre strictement organisationnel.
          </p>
        </div>
      ),
      canNext: true,
    },
  ];

  const current = steps[step];

  // « Mon suivi en bref » — écran d'accueil après onboarding.
  if (done) {
    return (
      <Shell>
        <div className="mx-auto max-w-md">
          <UrgencyBanner />
          <Card className="mt-4 overflow-hidden">
            <div className="bg-navy-900 px-5 py-5 text-white">
              <p className="text-[11px] uppercase tracking-[0.18em] text-teal-300">Mon suivi en bref</p>
              <h1 className="mt-1 font-display text-2xl text-white">
                Bonjour {patient.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-navy-100/75">
                Votre suivi post-opératoire est activé.
              </p>
            </div>
            <div className="space-y-2.5 p-5 text-sm">
              <Row label="Chirurgien" value={k.surgeonName(patient.surgeonId)} />
              <Row label="Intervention" value={patient.intervention} />
              <Row label="Durée de suivi" value={patient.protocol} />
              {cabinetConfig?.welcomeMessage && (
                <div className="mt-2 rounded-xl bg-teal-50/60 p-3 text-xs italic leading-relaxed text-navy-900">
                  « {cabinetConfig.welcomeMessage} »
                </div>
              )}
              <div className="mt-3 rounded-xl bg-navy-50/50 p-3 text-xs text-charcoal/70">
                <p className="font-medium text-navy-900">Prochaine étape</p>
                <p className="mt-0.5">
                  Échangez avec l'équipe de coordination depuis votre messagerie encadrée par
                  KOVELA. Aucune réponse automatique : un humain vous répondra.
                </p>
              </div>
            </div>
            <div className="border-t border-navy-900/[0.06] p-4">
              <Button variant="primary" className="w-full" onClick={() => router.push("/patient/messages")}>
                Accéder à ma messagerie
              </Button>
            </div>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <UrgencyBanner />

        <Card className="mt-6 p-6">
          <div className="mb-4 flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-teal-500" : "bg-navy-100"}`}
              />
            ))}
          </div>
          <h1 className="font-display text-2xl tracking-tight text-navy-900">{current.title}</h1>
          <div className="mt-4">{current.content}</div>

          <div className="mt-6 flex gap-2">
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Retour
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button
                variant="primary"
                className="ml-auto"
                disabled={current.canNext === false}
                onClick={() => setStep((s) => s + 1)}
              >
                Continuer
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ml-auto"
                disabled={current.canNext === false}
                onClick={() => {
                  k.logPatientConsents(patient.id, prefs);
                  k.completeOnboarding(patient.id);
                }}
              >
                Finaliser l'onboarding
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5">
      <span className="text-xs text-charcoal/55">{label}</span>
      <span className="text-right text-sm font-medium text-navy-900">{value}</span>
    </div>
  );
}
