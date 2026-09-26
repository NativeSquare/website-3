/**
 * Les textes des landings de pubs, en anglais seulement : elles ne servent
 * qu'au trafic americain de Meta. Une page par niche, un titre par porte de
 * l'arbre d'appel (telephone, leads payes, estimates), passe dans l'URL de la
 * pub (?porte=telephone) : le visiteur retrouve mot pour mot la phrase de la
 * pub qui l'a amene.
 *
 * Aucun chiffre : on n'a ni 55 avis ni etude a citer ici, on montre le
 * systeme. Plan : atlas/agence/mentorat-angelo/ads/plan-meta-ads.md, etape 3.
 */

export type Porte = "telephone" | "leads" | "estimates";
export type Niche = "windows";

export const PORTES: Porte[] = ["telephone", "leads", "estimates"];

export function lirePorte(valeur: string | undefined): Porte | undefined {
  return PORTES.includes(valeur as Porte) ? (valeur as Porte) : undefined;
}

type Accroche = {
  h1: string;
  lead: string;
  etapes: { h3: string; p: string }[];
};

export type Contenu = {
  kicker: string;
  metaTitle: string;
  cta: string;
  note: string;
  generique: Accroche;
  portes: Record<Porte, Accroche>;
  etapesTitre: string;
  demo: { h2: string; p: string };
  reserver: { h2: string; p: string };
  faq: { q: string; a: string }[];
};

export const contenu: Record<Niche, Contenu> = {
  windows: {
    kicker: "For Florida window & door companies",
    metaTitle: "Every call answered, every lead called back · NativeSquare",
    cta: "Book your free audit",
    note: "You see the system running on the call. Fixed price before anything starts.",
    generique: {
      h1: "Every call answered. Every lead called back in under a minute.",
      lead: "Homeowners call, fill out forms and ask for estimates all day, and the job goes to whoever answers first. We build the systems that answer, call back and follow up for window companies.",
      etapes: [
        { h3: "A call or a form comes in", p: "Day or night, from your site, your ads or your Google listing." },
        { h3: "The system answers in seconds", p: "It qualifies the homeowner, answers the usual questions and offers a time." },
        { h3: "The estimate lands in your calendar", p: "Synced to your CRM. You show up, you measure, you sell." },
      ],
    },
    portes: {
      telephone: {
        h1: "Your phone rings after 5. Nobody picks up.",
        lead: "Impact window jobs don't wait for Monday. Our AI receptionist answers every call, day and night, books the estimate and puts it straight in your calendar.",
        etapes: [
          { h3: "A call comes in at 6:40 pm", p: "Your crew is off, you're driving home. The phone rings anyway." },
          { h3: "Emma answers in under a second", p: "She speaks like your best front-desk person, answers questions and books the estimate." },
          { h3: "The estimate is in your calendar", p: "Synced to your CRM, with the notes. You see it in the morning." },
        ],
      },
      leads: {
        h1: "Paying for leads and calling them back the next day?",
        lead: "Every lead gets a call in under a minute, gets qualified and gets booked, while the other three companies the homeowner contacted are still checking email.",
        etapes: [
          { h3: "A lead comes in", p: "From your ads, a lead vendor, your website, wherever you pay for them." },
          { h3: "Called back in under a minute", p: "The system calls, qualifies the homeowner and offers two times." },
          { h3: "Booked before the competition calls", p: "The estimate is in your calendar. You paid for that lead, you get the job." },
        ],
      },
      estimates: {
        h1: "Most estimates go quiet. Nobody follows up.",
        lead: "Every open estimate gets a follow-up, on schedule, by text and email, until the homeowner answers. You already paid to earn that estimate.",
        etapes: [
          { h3: "An estimate goes out", p: "The homeowner says they'll think about it. Then nothing." },
          { h3: "Follow-ups go out on schedule", p: "Text and email, until they answer. Your name, your tone, no chasing." },
          { h3: "The job books, or you know it's dead", p: "Nothing sits in limbo. Your pipeline finally tells the truth." },
        ],
      },
    },
    etapesTitre: "How it works",
    demo: {
      h2: "Hear it for yourself.",
      p: "This is Emma taking a call. She picks up in under a second, answers like a person, books the job and syncs it everywhere. Ten calls at once, never sick, never off.",
    },
    reserver: {
      h2: "Pick a time.",
      p: "Thirty minutes on video. You tell me where the calls and leads are slipping, I show you the system running, you decide.",
    },
    faq: [
      {
        q: "What does it cost?",
        a: "It depends on what we build for you. On the call we look at your numbers together and you get a fixed price before anything starts.",
      },
      {
        q: "Do I have to change my software?",
        a: "No. We plug into what you already use: your phone line, your calendar, your CRM.",
      },
      {
        q: "What happens on the call?",
        a: "Thirty minutes on video, free. You tell me how calls, leads and estimates get lost today, I show you the system running on screen, and you decide if it's worth a second call.",
      },
    ],
  },
};
