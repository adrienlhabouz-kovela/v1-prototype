// KOVELA — bibliothèque de templates superviseur.
// Aucun template ne donne de conseil médical. Coordination uniquement.

import type { Template } from "./types";

export const templates: Template[] = [
  {
    id: "t1",
    title: "Message reçu",
    body: "Bonjour, nous avons bien reçu votre message dans le cadre de la coordination de votre suivi post-opératoire. Nous revenons vers vous rapidement.",
  },
  {
    id: "t2",
    title: "Demande de précision",
    body: "Bonjour, afin de bien structurer votre suivi, pourriez-vous nous préciser quelques éléments de contexte (date, déroulé) ? Merci.",
  },
  {
    id: "t3",
    title: "Demande de photo",
    body: "Bonjour, pour compléter votre dossier de suivi, vous pouvez joindre une photo via la messagerie si vous le souhaitez. Cela nous aide à transmettre les éléments à votre chirurgien.",
  },
  {
    id: "t4",
    title: "Rappel urgence 15 / 112",
    body: "Rappel important : KOVELA n'est pas un service d'urgence. En cas d'urgence, contactez le 15 / 112 ou suivez les consignes de votre chirurgien.",
  },
  {
    id: "t5",
    title: "Réponse d'attente",
    body: "Bonjour, votre message est bien pris en compte. Nous coordonnons le suivi avec l'équipe et revenons vers vous dès que possible.",
  },
  {
    id: "t6",
    title: "Patient silencieux",
    body: "Bonjour, nous n'avons pas eu de vos nouvelles depuis quelques jours. Comment se passe votre suivi post-opératoire ? N'hésitez pas à nous écrire.",
  },
  {
    id: "t7",
    title: "Escalade en cours",
    body: "Bonjour, nous transmettons les éléments de votre suivi à votre chirurgien pour la suite de la coordination. Nous revenons vers vous.",
  },
  {
    id: "t8",
    title: "Onboarding incomplet",
    body: "Bonjour, votre espace de suivi n'est pas encore finalisé. Vous pouvez compléter votre onboarding pour activer la coordination post-opératoire.",
  },
  {
    id: "t9",
    title: "Clôture",
    body: "Bonjour, votre suivi structuré arrive à son terme. Nous clôturons la coordination. Prenez soin de vous et bon rétablissement.",
  },
  {
    id: "t10",
    title: "Rappel limites KOVELA",
    body: "Pour rappel, KOVELA assure la coordination et la continuité post-opératoire. Nous ne donnons pas d'avis médical : toute décision médicale relève de votre chirurgien.",
  },
];
