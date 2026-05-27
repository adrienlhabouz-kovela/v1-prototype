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

  if (!patient) return null;

  function attach(kind: "photo" | "audio") {
    // Placeholder uniquement — aucune vraie pièce jointe.
    k.sendMessage(
      PATIENT_ID,
      kind === "photo" ? "[Photo jointe]" : "[Mémo vocal joint]",
      "patient"
    );
  }

  return (
    <Shell>
      <div className="mx-auto flex max-w-md flex-col" style={{ minHeight: "calc(100vh - 9rem)" }}>
        <UrgencyBanner />

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
                      <span>{a.kind === "photo" ? "🖼" : "🎧"}</span>
                      <span>{a.label}</span>
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
                    k.sendMessage(PATIENT_ID, text.trim(), "patient");
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
                  k.sendMessage(PATIENT_ID, text.trim(), "patient");
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
          </div>
        </Card>
      </div>
    </Shell>
  );
}
