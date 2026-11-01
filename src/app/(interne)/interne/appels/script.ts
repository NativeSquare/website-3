/* Les mots du script, tels qu'Alexandre les a validés le 30/10/2026
   (atlas/agence/mentorat-angelo/ressources/console-appel-v2-2026-10-30.html).
   Toute correction se fait là-bas d'abord ; ce fichier n'invente aucune réplique.
   `anonyme` : la version quand le prénom du patron n'est pas connu.
   `aValider` : pas encore validé par Alexandre. */

export type Ligne = { pause?: string; texte: string; anonyme?: string };
export type Carte = { lui: string; moi: Ligne[]; note?: string; aValider?: boolean };
export type Onglet = { id: string; titre: string; but: string; lignes: Ligne[]; cartes: Carte[] };

const L = (texte: string, pause?: string, anonyme?: string): Ligne => ({ texte, pause, anonyme });

/* ———————————————— cold call : une liste, un fait, un comment ———————————————— */

export const FROID: Onglet[] = [
  {
    id: "opener",
    titre: "Opener",
    but: "Une formule banale, puis qui tu es et pourquoi lui, puis la pause : il réagit avant que tu demandes le rendez-vous. Une objection se traite d'abord, dans les cartes dessous.",
    lignes: [
      L("Hey {prenom}, it's Alex, how's it going?", "1 · l'accroche : tu ne confirmes pas qui il est, tu ne demandes pas si tu tombes mal", "Hey, it's Alex, how's it going?"),
      L(
        "Good. I am calling you because I work with HVAC owners to help them book more jobs, mostly by {comment}. I noticed {fait}, which is why I'm calling you specifically.",
        "il répond · 2 · la valeur : aucun mot à changer, la phrase finit en baissant la voix",
      ),
      L(
        "I know I'm calling out of the blue, so I won't try to explain everything over the phone. What I'd like to do is set up a quick call, either today or tomorrow, to show you how we would help you win more of those jobs.",
        "3 · la pause : tu te tais, il réagit. Positif ou neutre (« ok », « go on », « what's this about? ») : tu continues · 4 · le rendez-vous",
      ),
    ],
    cartes: [
      {
        lui: "« That's not me »",
        moi: [
          L("Oh, sorry about that. Is {prenom} around?", undefined, "Oh, sorry about that. Is the owner around?"),
          L("No worries, when's the best time to catch {prenom}?", "non :", "No worries, when's the best time to catch the owner?"),
          L("Perfect, thanks. Have a good one.", "tu notes l'heure :"),
        ],
        note: "S'il demande « what's this regarding? » : « It's about the jobs coming into the shop. I'll catch {prenom} later, when's {prenom} usually around? ». Ensuite : « Pas le patron », avec l'heure en note.",
      },
      {
        lui: "« I'm busy » · « I don't have time »",
        moi: [
          L(
            "Yeah I know you're busy and I'm calling you out of the blue, but honestly, that's exactly part of why I am calling you. We literally help you book more jobs with less of your time. So if you tell me you're busy that's music to my ears. The meeting is only 30 minutes and we will show you how you can book more jobs in less time. I'm only proposing it to you because I know it's worth your time. Do you have 30 minutes today or tomorrow?",
          ),
        ],
        note: "Tu reconnais ce qu'il dit, tu dis pourquoi ça vaut quand même le coup, tu reproposes le rendez-vous. S'il insiste avec une raison : onglet Objections, vague 2.",
      },
      {
        lui: "« Not interested » · « Not looking »",
        moi: [
          L(
            "Got it, look, I'm calling you out of the blue here, but I know what we do will help you book more jobs and will help you grow your business so I am sure it's worth 30 minutes of your time. Do you have 30 minutes today or tomorrow to dedicate to growing your business?",
          ),
        ],
        note: "S'il insiste : vague 2.",
      },
      {
        lui: "« I already work with a company for that »",
        aValider: true,
        moi: [
          L(
            "Got it, yeah that makes sense. What we do sits on top of that, so you keep what you have, and we take care of what happens once the lead comes in: every call answered, every lead called back fast, every open estimate followed up. So whether it's any of that or something else, I still think it makes sense to set up a quick call, today or tomorrow, to show you how it fits with what you already have. Does today or tomorrow work better?",
          ),
        ],
        note: "Construite sur l'exemple de la vidéo. Une carte par type de boîte (lead gen, VA ou standard, assistant IA) reste à écrire.",
      },
    ],
  },
  {
    id: "vague2",
    titre: "Vague 2 · les questions",
    but: "Il insiste avec une raison : tu remets la porte d'entrée (le téléphone), avec les questions d'Angelo, puis tu reviens au rendez-vous.",
    lignes: [
      L("Is there someone dedicated to answering phones and booking estimates, or does that fall on you?", "la question d'ouverture"),
      L("How many calls would you say you miss per day?", "quantifier"),
      L("What would it look like for you if you didn't have to handle phone calls anymore?", "l'upside, par lui"),
      L("Have you tried anything to solve this in the past?", "l'historique"),
      L("Why not?", "il répond"),
      L("So what we do is build custom agents that answer 24/7, talk to and qualify potential customers, and book estimates right into your calendar.", "le pitch, une phrase"),
    ],
    cartes: [
      {
        lui: "« You didn't leave a message »",
        moi: [L("Yeah, I didn't, and most homeowners won't either. They just call the next company on the list. That's actually why I'm calling.")],
      },
      {
        lui: "« I don't think we miss any calls »",
        moi: [
          L(
            "Fair enough. Thing is, the ones you miss don't show up anywhere: eight out of ten people who hit a voicemail don't leave a message, they just call the next company. You only know about mine because I'm the one calling back. So when you're out on an install and it rings, what happens?",
          ),
        ],
        note: "« Eight out of ten », jamais « a study says » : 80 % des appelants qui tombent sur une messagerie ne laissent pas de message (Vonage, Invoca, BIA/Kelsey, repris par Numa et Phonely).",
      },
    ],
  },
  {
    id: "close",
    titre: "Close",
    but: "Une heure précise, deux choix, le jour même si possible. Puis son portable pour les textos et la confirmation vérifiée à voix haute : c'est ici que le no-show se joue.",
    lignes: [
      L("Perfect. Does later today at {heure} or tomorrow morning work better for you?", "il a dit oui au rendez-vous · à adapter"),
      L("Does this number text as well? Is it your personal number?", "verrouillage"),
      L("I just sent you over that email confirmation. Can you make sure you got it on your end? The system's been a little wonky recently.", "tu valides le booker, puis :"),
      L("Got the confirmation on my end. {prenom}, I'll see you at {heure}.", "il l'a", "Got the confirmation on my end. I'll see you at {heure}."),
    ],
    cartes: [
      {
        lui: "« Just send me an email »",
        aValider: true,
        moi: [
          L(
            "I get it, you're super busy, but that's kind of what I'm calling about. I've already built you guys an entire custom system to handle those calls. I don't want to waste your time. Would you be free tonight at 5 PM? I could just show you a quick demo.",
          ),
        ],
        note: "Ancien texte, à revoir.",
      },
      {
        lui: "« Call me back » · « I'll text you later »",
        aValider: true,
        moi: [
          L(
            "Like I said, it's a super quick meeting. If you hate it, we never have to talk again. It's completely free. We're helping some HVAC companies in the area and we can only take on a couple companies at a time to make sure we deliver the best results.",
          ),
        ],
        note: "Ancien texte, à revoir.",
      },
      {
        lui: "« How much is it? »",
        aValider: true,
        moi: [L("(Pas de réplique jouée.)")],
        note: "La doctrine : aucun prix au téléphone, tu vends le rendez-vous. À demander à Angelo.",
      },
    ],
  },
];

/* ———————————————— rappels : il a laissé ses coordonnées ———————————————— */

export const RAPPELS: Onglet[] = [
  {
    id: "t1",
    titre: "Ouverture",
    but: "Appeler vite : chaque heure qui passe, il oublie qu'il a laissé ses coordonnées. Pas de message vocal (consigne d'Angelo) : s'il ne décroche pas, tu passes au texto avec le lien.",
    lignes: [
      L("Hey {prenom}, it's Alex, how are you doing?"),
      L(
        "You left me your info to get more HVAC jobs {quand}, but I see you haven't booked a call yet, so I wanted to make sure you have all you need and set up your call real quick.",
        "il répond :",
      ),
    ],
    cartes: [
      {
        lui: "« I don't remember filling that out »",
        moi: [L("No worries. You checked if your area was available for HVAC leads, that's what I'm following up on. Is booking more jobs something you're working on right now?")],
        note: "Tu ne discutes pas : tu lui rappelles ce qu'il a fait et tu enchaînes sur une question. Ancienne carte du setter.",
      },
      {
        lui: "« Who is this? What company? »",
        moi: [L("It's Alex with NativeSquare. We help HVAC companies book more jobs. You left your info on our site a bit ago, I'm just following up. Quick question: are you able to take on more jobs right now?")],
        note: "Ancienne carte du setter.",
      },
      {
        lui: "« I'm busy right now »",
        moi: [L("Totally fair, this is going to take thirty seconds, I promise. One question and I'll let you go.")],
        note: "Angelo.",
      },
      {
        lui: "« I'm not interested »",
        moi: [L("Totally fair, I haven't given you anything to be interested in just yet...")],
        note: "Angelo. Tu enchaînes directement sur la première question de l'onglet suivant.",
      },
    ],
  },
  {
    id: "t2",
    titre: "Questions et pont",
    but: "Ses mots notés mot pour mot, un État confirmé (il fixe le fuseau du rendez-vous), un chiffre, un cap et une échéance. Puis le pont.",
    lignes: [
      L("So why did you leave us your info? What is the thing you'd like to change in your business right now, what's top of your mind?", "sa raison"),
      L("Got it. I see you're based in {etat}, right?", "il répond, tu notes ses mots · sa zone"),
      L("I see you can take on {x} jobs. What's your objective, where would you like to be, and when?", "il confirme · son objectif"),
      L("Got it. That's exactly what we do, and the call is where we explain how we'd get you there.", "il répond · le pont, à valider"),
    ],
    cartes: [
      {
        lui: "« I just wanted to see the price »",
        moi: [L("Makes sense. It depends on your area and on how many jobs you want to take on, so I can't quote it blind. That's exactly what the consultation covers. Quick question first: what's top of your mind in the business right now?")],
        note: "Pas de prix sur ce call : le prix est le levier d'Angelo, il se dit au proposal call.",
      },
      {
        lui: "« Nothing really »",
        moi: [L("No problem. Are you able to take on more jobs right now, or are you kind of booked out?")],
      },
      {
        lui: "« We're packed out, super busy »",
        moi: [L("Honestly, that's exactly why I'm calling. We've been helping implement some backend infrastructure into these businesses so they could take on more jobs. Would that be something you're interested in?")],
      },
      {
        lui: "« A lot » · « I don't know »",
        moi: [L("Best guess. 5? 10? 20?")],
        note: "Tu pousses jusqu'au nombre : sans chiffre, il n'y a pas de douleur à faire valoir au call.",
      },
      {
        lui: "« Just send me an email »",
        moi: [L("I will send that email over for sure, but it's difficult to identify which one of our solutions is best fit for your business. That's why we have the consultation in place, to help me get familiar with your operation so I can propose something that actually fits.")],
      },
      {
        lui: "« Is the 50 leads guarantee real? »",
        aValider: true,
        moi: [L("Good question. Let's go through exactly how it works on the call, so you get the full answer and not half of one.")],
        note: "À trancher avec Angelo : qui porte la garantie, que se passe-t-il à 49 ? Tant que c'est ouvert, tu ne la défends pas et tu ne l'inventes pas.",
      },
    ],
  },
  {
    id: "t3",
    titre: "Réserver",
    but: "Il réserve PENDANT l'appel, à deux heures précises dans son fuseau, avec l'e-mail de sa fiche (c'est ce qui démarre la séquence). Puis l'e-mail relu à voix haute et la confirmation vérifiée avant de raccrocher.",
    lignes: [
      L("Does {h1} or {h2} work better, {etat} time?", "tes deux créneaux se tapent au-dessus"),
      L("What's the best email for the invite?", "il choisit :"),
      L("Just to be sure, I have {email}. Is that right?", "tu ouvres le booker, tu choisis le créneau, tu tapes son e-mail"),
      L("The invite just hit your inbox. Can you check it came through?", "il confirme"),
      L("Perfect. See you {h1}.", "il regarde"),
    ],
    cartes: [
      {
        lui: "« Call me back »",
        moi: [L("I can definitely call you back, but this is a free consultation and it only takes thirty minutes. Why don't we get it set up for {h1}?")],
        note: "D'accord d'abord, rediriger ensuite.",
      },
      {
        lui: "« I need to check my schedule »",
        moi: [L("Totally fair. Open your calendar, I'll wait. Does {h1} or {h2} work?")],
      },
      {
        lui: "« Not this week »",
        moi: [L("No problem. What about early next week? Monday at 9 or Tuesday at 2?")],
        note: "Même pour la semaine suivante, tu gardes deux heures précises.",
      },
      {
        lui: "« I'll book it myself later »",
        moi: [L("Let's do it now, it takes twenty seconds. I'll stay on the line.")],
        note: "« Later » est une perte : ces leads ne reviennent pas.",
      },
      {
        lui: "« I didn't get the text »",
        moi: [L("No problem, I'll just book it for you. What's the best email for the invite?")],
      },
    ],
  },
];

/* Les phrases pour quand il glisse : un seul, puis tu reprends. */
export const GLISSE: string[] = [
  "Just one more question and I'll let you go.",
  "This is going to take 30 seconds, I promise.",
  "I'm not selling you anything right now, I'm just trying to figure out if we'd be a fit.",
];
