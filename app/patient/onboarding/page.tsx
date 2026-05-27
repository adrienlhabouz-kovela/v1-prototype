"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Button, Card } from "@/components/ui";
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

  if (!patient) return null;

  const done = patient.onboardingComplete;

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
            Intervention déclarée : <span className="font-medium text-navy-900">{patient.intervention}</span>{" "}
            du {formatDate(patient.interventionDate)} · Protocole {patient.protocol}.
          </p>
          <p>
            KOVELA assure la <span className="font-medium">coordination</span> et la{" "}
            <span className="font-medium">continuité post-opératoire</span> entre vous et votre
            chirurgien.
          </p>
        </div>
      ),
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
  ];

  const current = steps[step];

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <UrgencyBanner />

        {done ? (
          <Card className="mt-6 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              ✓
            </div>
            <h1 className="font-display text-2xl tracking-tight text-navy-900">Onboarding complété</h1>
            <p className="mt-2 text-sm text-charcoal/55">
              Votre suivi post-opératoire est actif. Vous êtes considéré(e) comme patient activé.
            </p>
            <Button variant="primary" className="mt-4 w-full" onClick={() => router.push("/patient/messages")}>
              Accéder à ma messagerie
            </Button>
          </Card>
        ) : (
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
                    k.completeOnboarding(patient.id);
                  }}
                >
                  Finaliser l'onboarding
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </Shell>
  );
}
