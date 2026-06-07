"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress/store";
import { levelForXp } from "@/lib/content/levels";

export default function SettingsPage() {
  const { state, ready, profile, switchProfile, reset } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!ready || !profile) {
    return <div className="pt-10 text-center text-abyss-100/60">Chargement…</div>;
  }

  const level = levelForXp(state.xp);

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <div className="label-caps">Paramètres</div>
        <h1 className="mt-1 font-display text-2xl text-sail">Ton profil</h1>
      </header>

      {/* profil actif */}
      <div className="card flex items-center gap-4 p-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
          {profile.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl text-sail">{profile.name}</div>
          <div className="text-xs text-abyss-100/70">
            Niveau {level.id} · {level.name} · {state.xp} XP
          </div>
        </div>
      </div>

      {/* changer de profil */}
      <button onClick={switchProfile} className="btn-primary w-full">
        🔄 Changer de profil
      </button>

      {/* réinitialiser la progression du profil actif */}
      <div className="pt-2">
        <div className="label-caps mb-2">Zone sensible</div>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-abyss-100/70 ring-1 ring-white/10 transition hover:text-coral-400"
          >
            Réinitialiser la progression de {profile.name}
          </button>
        ) : (
          <div className="rounded-2xl bg-coral-500/10 p-4 text-center ring-1 ring-coral-500/25">
            <p className="text-sm text-coral-400">
              Effacer toute la progression de {profile.name} ? C&apos;est irréversible.
            </p>
            <p className="mt-1 text-[0.7rem] text-abyss-100/50">
              Les autres profils ne sont pas touchés.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setConfirmReset(false)} className="btn-ghost">
                Annuler
              </button>
              <button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="btn bg-coral-500 text-white hover:bg-coral-400"
              >
                Effacer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
