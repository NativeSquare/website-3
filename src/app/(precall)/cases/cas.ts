/**
 * Les deux one-pagers en page web (roofing, septic), meme contenu que les PDF de
 * public/precall/ et que la slide 7 de la video pre-appel. Source :
 * atlas/agence/mentorat-angelo/assets-precall/one-pager-resultats.html. Le
 * fichier source les notait « d'illustration » ; Alexandre a dit le 30/10/2026
 * que ce n'est plus le cas et a demande les memes chiffres que les PDF. Pour les
 * changer un jour : ici, dans CasClients.tsx, dans la video et dans les PDF.
 */

export type NomCas = "roofing" | "septic";

export type Cas = {
  tag: string;
  tagline: string;
  title: string;
  sub: string;
  stats: { big: string; lbl: string }[];
  situation: string[];
  quote: string;
  by: string;
  /* [ligne, avant, apres] */
  ba: [string, string, string][];
  timeline: string[];
};

export const AUTEUR = {
  nom: "Alexandre",
  role: "Growth manager at NativeSquare",
  contact: "office@nativesquare.fr · nativesquare.fr",
};

export const CE_QU_ON_CONSTRUIT = [
  {
    icone: "tel",
    titre: "Call coverage, day and night",
    detail: "Every call answered, qualified, booked on the calendar.",
  },
  {
    icone: "relance",
    titre: "Follow-up until yes or no",
    detail: "Open estimates chased automatically. Old customers called back.",
  },
  {
    icone: "reglages",
    titre: "Back office on autopilot",
    detail: "Invoices, review requests, reminders, reports.",
  },
] as const;

export const CAS: Record<NomCas, Cas> = {
  roofing: {
    tag: "Case study · Roofing",
    tagline: "Custom systems for roofing companies. Built for your shop, tuned by us.",
    title: "Residential roofer, Central Florida: 31 more booked jobs in 90 days",
    sub: "Three crews, retail and storm work, around $2.4M a year. The owner was answering the phone from the roof, and estimates were going out and never coming back.",
    stats: [
      { big: "+31", lbl: "booked jobs in the first 90 days" },
      { big: "94%", lbl: "of inbound calls answered, up from 61%" },
      { big: "7 h", lbl: "a week back to the owner" },
    ],
    situation: [
      "Calls hit voicemail while the crews were on roofs. Nobody called back the same day.",
      "Estimates went out and sat there. Follow-up happened when he remembered.",
      "Storm leads from paid ads got a call back the next afternoon, at $60 a lead.",
    ],
    quote: "I stopped losing jobs to whoever picked up first.",
    by: "Owner, residential roofing company, Central Florida",
    ba: [
      ["The phone", "The owner, from the roof. Voicemail after 5 pm.", "Answered in seconds, day and night. Estimate booked on the calendar."],
      ["Estimates", "Sent, then forgotten. Followed up when he remembered.", "Chased automatically until a yes or a real no."],
      ["Paid leads", "Form submissions answered the next afternoon.", "Called back within minutes, before the next roofer."],
      ["Evenings", "Invoices, review requests and paperwork after dinner.", "Running in the background. Evenings are his again."],
    ],
    timeline: ["Week 1 · diagnose", "Week 2 · first system live", "Week 5 · full build", "Ongoing · we tune it"],
  },
  septic: {
    tag: "Case study · Septic",
    tagline: "Custom systems for septic companies. Built for your shop, tuned by us.",
    title: "Septic company, Georgia: $94k in jobs from customers they already had",
    sub: "Pumping, repair and installs, four trucks. Emergencies at night went to voicemail, and the pumping schedule lived in the owner's head.",
    stats: [
      { big: "+$94k", lbl: "in rebooked pumping and installs, six months" },
      { big: "1,240", lbl: "past customers called back for pumping due" },
      { big: "88%", lbl: "of after-hours calls answered" },
    ],
    situation: [
      "A backed-up system at 9 pm rang through to voicemail. The next name on the list got the job.",
      "Years of pumping records, and nobody ever called those customers back.",
      "Install quotes went out and waited for the homeowner to remember.",
    ],
    quote: "The work was sitting in our own files the whole time. We just never called.",
    by: "Owner, septic company, Georgia",
    ba: [
      ["Emergencies", "A backed-up tank at 9 pm went to voicemail.", "Answered in seconds, dispatched, the job is his."],
      ["Old customers", "Tanks pumped years ago, nobody called them back.", "Every customer gets a call when their pumping is due."],
      ["Install quotes", "Sent, then waiting on the homeowner.", "Followed up until a yes or a real no."],
      ["Evenings", "Invoices, reminders and paperwork after the last job.", "Running in the background. Evenings are his again."],
    ],
    timeline: ["Week 1 · diagnose", "Week 2 · first system live", "Week 5 · full build", "Ongoing · we tune it"],
  },
};
