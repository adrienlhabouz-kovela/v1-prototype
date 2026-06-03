"use client";

import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Button, Card } from "@/components/ui";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { useKovela } from "@/lib/store";
import { formatDateTime } from "@/lib/format";

const PATIENT_ID = "p1"; // Camille Moreau (patient de démo)

export default function PatientMessages() {
  const k = useKovela();
  const patient = k.patients.find((p) => p.id === PATIENT_ID);
  const [text, setText] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);

  if (!patient) return null;

  function notify(msg: string) {
    setConfirm(msg);
    window.setTimeout(() => setConfirm(null), 2500);
  }

  function send(content: string) {
    k.sendMessage(PATIENT_ID, content, "patient");
    notify("Message envoyé à l'équipe de coordination.");
  }

  function attach(kind: "photo" | "audio") {
    // Placeholder uniquement — aucune vraie pièce jointe.
    k.sendMessage(
      PATIENT_ID,
      kind === "photo" ? "[Photo jointe]" : "[Mémo vocal joint]",
      "patient"
    );
    notify(kind === "photo" ? "Photo envoyée." : "Mémo vocal envoyé.");
  }

  return (
    <Shell>
      <div className="mx-auto flex max-w-md flex-col" style={{ minHeight: "calc(100vh - 9rem)" }}>
        <UrgencyBanner />

        {confirm && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-2.5 text-sm text-teal-700 ring-1 ring-teal-100">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] text-white">
              ✓
            </span>
            {confirm}
          </div>
        )}

        <Card className="mt-4 flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 bg-navy-depth px-4 py-3.5 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold ring-1 ring-white/15">
              {patient.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold text-white">Messagerie de coordination</h1>
              <p className="text-xs text-navy-100/65">
                {k.surgeonName(patient.surgeonId)} · suivi post-opératoire
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {patient.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.author === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.author === "patient"
                      ? "bg-teal-600 text-white"
                      : m.author === "systeme"
                      ? "bg-navy-50 text-charcoal/70"
                      : "bg-navy-50 text-navy-900"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  {m.attachments?.map((a) => (
                    <div key={a.id} className="mt-1.5 flex items-center gap-1.5 text-xs opacity-80">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      <span className="font-medium">{a.kind === "photo" ? "Photo" : "Audio"}</span>
                      <span>· {a.label}</span>
                    </div>
                  ))}
                  <p className="mt-1 text-[10px] opacity-60">{formatDateTime(m.at)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-navy-900/[0.06] p-3">
            <div className="mb-2 flex gap-2">
              <Button variant="subtle" className="flex-1 text-xs" onClick={() => attach("photo")}>
                + Photo (placeholder)
              </Button>
              <Button variant="subtle" className="flex-1 text-xs" onClick={() => attach("audio")}>
                + Audio (placeholder)
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) {
                    send(text.trim());
                    setText("");
                  }
                }}
                placeholder="Écrire un message…"
                className="flex-1 rounded-full border border-navy-100 px-4 py-2 text-sm outline-none focus:border-teal-400"
              />
              <Button
                variant="primary"
                disabled={!text.trim()}
                onClick={() => {
                  send(text.trim());
                  setText("");
                }}
              >
                Envoyer
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-charcoal/45">
              Vos messages sont traités par une équipe humaine de coordination. Aucune réponse
              automatique par IA.
            </p>
            <div className="mt-2 rounded-xl bg-bone/70 px-3 py-2 text-[10.5px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
              <p className="font-medium text-navy-900">
                Quand utiliser ce canal vs le 15 / 112 ?
              </p>
              <ul className="mt-1 space-y-0.5">
                <li>
                  <span className="font-medium text-navy-900">Suivi non urgent</span> · question
                  d&apos;organisation, photo demandée, point d&apos;étape → message ici.
                </li>
                <li>
                  <span className="font-medium text-amber-900">Urgence ou inquiétude forte</span>
                  {" "}· contactez le <span className="font-semibold">15 / 112</span> ou suivez
                  les consignes de votre chirurgien.
                </li>
              </ul>
              <p className="mt-1.5 text-charcoal/55">
                L&apos;équipe KOVELA revient vers vous selon les délais définis avec votre cabinet.
              </p>
              <p className="mt-1.5 text-charcoal/55">
                Hors horaires KOVELA, votre message sera repris à l&apos;ouverture du service. En
                cas d&apos;urgence, contactez le <span className="font-semibold">15 / 112</span>
                {" "}ou les contacts d&apos;urgence transmis par votre cabinet.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
