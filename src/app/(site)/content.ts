/* Every human-visible string of the landing, in both languages. The locale is
   negotiated by src/middleware.ts (x-vercel-ip-country, then Accept-Language)
   and read server-side via the x-ns-locale request header — same URL for
   everyone, no /fr route. Only baked-in glyphs ("$", "0:52", "24/7", "0.8s",
   "9–5", "438", "31") stay universal. */

export type Locale = "en" | "fr";

const en = {
  nav: {
    bookCall: "Book a Call",
  },
  hero: {
    kicker: "AI systems for service businesses",
    h1: "We use the latest AI to make your business more money.",
    lead: "Speed-to-lead calling, automatic follow-ups, an office that runs itself, custom tools nobody else will build you. Everything plugs into what you already use, and everything points at the same number.",
  },
  graph: {
    title: "Every system we build feeds the same number.",
    ariaLabel:
      "Diagram: speed-to-lead, nurturing, automations, custom AI and the AI receptionist all feed your business, and everything funnels down into more booked jobs.",
    capLeft: "Works 24/7",
    capRight: "Plugs into your tools",
    center: "YOUR BUSINESS",
    chips: {
      speedToLead: { label: "Speed-to-lead:", stat: "Lead called in 0:52" },
      nurturing: { label: "Nurturing:", stat: "3 follow-ups sent" },
      automations: { label: "Automations:", stat: "12 invoices sent" },
      customAi: { label: "Custom AI:", stat: "Quote out in 4 min" },
      receptionist: { label: "Receptionist:", stat: "Answered in 0.8s" },
    },
    moneyLabel: "More booked jobs:",
    moneySub: "$ up and to the right",
  },
  pain: {
    kicker: "The problem",
    title: "Where you're leaking money.",
    cards: [
      {
        h3: "Leads that wait, walk.",
        p: "An hour-old lead is a cold lead. If nobody calls back in minutes, the job goes to whoever does.",
      },
      {
        h3: "Missed calls are paid-for losses.",
        p: "You paid ads, reviews and years of reputation to make that phone ring. Every ring that dies in voicemail is money you already spent.",
      },
      {
        h3: "Nights lost to admin.",
        p: "Invoices, reminders, review requests, scheduling. Hours of clicking that a machine should be doing while you sleep.",
      },
    ],
  },
  services: {
    kicker: "The systems",
    title: "What we build",
    sub: "Built on your stack, measured in booked jobs.",
    speedToLead: {
      status: "Speed-to-lead",
      h3: "First to call wins.",
      p: "A form comes in and our system calls the lead back in under a minute, qualifies them and books them into your calendar while your competitor is still checking email. If you need more lead flow, we run the ads too.",
    },
    nurturing: {
      status: "Lead nurturing & reactivation",
      h3: "Your CRM is full of money.",
      p: "Follow-ups go out on schedule until a lead answers, and the hundreds of old contacts sitting dead in your CRM get called with a reason to come back. You already paid for every one of them.",
    },
    receptionist: {
      status: "AI receptionist",
      h3: "Every call answered. Even at 2am.",
      p: "Emma picks up in under a second, speaks like your best front-desk person, answers questions, books the job and syncs it everywhere. She takes ten calls at once and never calls in sick.",
    },
    automations: {
      status: "Workflow automations",
      h3: "Monday morning, the work is done.",
      p: "Invoices sent when a job closes, review requests one click after, reminders, dispatch, reporting. The admin layer of your business, running by itself.",
    },
    customAi: {
      status: "Custom AI",
      h3: "For the problem no software fixes.",
      p: "The quote that takes you two evenings, the 200-page bid you dread reading, the questions your team asks you fifty times a day. If it's specific to your business, we build the tool for it.",
    },
  },
  speedToLeadArt: {
    submit: "Submit",
    webForm: "Web form",
    aiCallsBack: "AI calls back",
    yourCalendar: "Your calendar",
    booked: "Booked",
  },
  crmArt: {
    title: "Your CRM · old leads",
    count: "438 contacts",
    rows: [
      { name: "Water heater replacement", sub: "Went quiet · Jan 2025" },
      { name: "Roof inspection", sub: "No answer · Feb 2025" },
      { name: "Panel upgrade quote", sub: "Ghosted · Mar 2025" },
      { name: "Bathroom remodel", sub: "Closed lost · May 2025" },
    ],
    dead: "Gone cold",
    live: "Booked",
    foot: "3 booked this week",
  },
  emma: {
    titlePre: "Sales call with ",
    titleName: "Emma",
    incoming: "Incoming call · Sales client",
    answered: "Answered by AI Emma · 0.8s",
    bubbleCaller: "Hi, are you still open? I'd like to book an appointment.",
    bubbleEmma: "We are! I have Thursday 2:30 PM or Friday 10 AM free. Which suits you?",
    booked: "Appointment booked · Thu 2:30 PM",
    synced: "Synced to CRM & calendar",
  },
  automationsArt: {
    dayLabel: "Mon · 7:00 AM",
    nightLabel: "Fri · 11:58 PM",
    rows: [
      { t: "Invoice #2214 sent", s: "Job closed · sent automatically" },
      { t: "Review request out", s: "One click after the invoice" },
      { t: "Crew reminders queued", s: "Monday dispatch · 7:30 AM" },
    ],
  },
  benefits: {
    kicker: "What you get",
    title: "What lands in your business",
    items: [
      "Always on. 2pm or 2am.",
      "Jobs booked straight into your calendar",
      "Customers get answers in seconds",
      "Quotes out in minutes, not evenings",
      "A fraction of the cost of hiring",
      "Every lead chased until it answers",
      "The same service on every single call",
    ],
  },
  compare: {
    eyebrow: "The math",
    title: "against hiring.",
    aiHead: "With NativeSquare",
    tradHead: "Traditional hiring",
    aiRows: [
      "On duty 24/7",
      "Picks up in under a second",
      "One flat monthly cost",
      "Ten calls at the same time",
      "Same quality on call 1 and call 1,000",
    ],
    tradRows: [
      "Business hours only",
      "Callers wait on hold",
      "Salary, overhead, turnover",
      "One call at a time",
      "Depends who answers",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions you may have",
    items: [
      {
        q: "What exactly do you build?",
        a: "Systems that make you money with the newest AI available: speed-to-lead calling, follow-up sequences, a phone receptionist, back-office automations and custom tools. Each one is picked for your specific leaks, then wired into your business.",
      },
      {
        q: "Do I have to change my phone system, CRM or calendar?",
        a: "No. We build on top of what you already run. Your number, your CRM and your calendar stay.",
      },
      {
        q: "How fast do I see results?",
        a: "Reactivation and speed-to-lead show up in the first weeks, because they work on leads you already have. Everything is tracked, so you read the numbers yourself.",
      },
      {
        q: "What does it cost?",
        a: "A setup fee plus a monthly retainer, sized on your call and lead volume. We quote it on the call, once we know what the leaks are costing you.",
      },
      {
        q: "What if the AI gets something wrong?",
        a: "Every system is trained on your services, prices and rules, tested before launch, and hands off to a human the moment something goes beyond its scope.",
      },
      {
        q: "Can it sound like my company?",
        a: "Voice, greeting, vocabulary and tone are built from how your team actually talks. Your customers hear your company.",
      },
      {
        q: "What happens after launch?",
        a: "We monitor it, report on it and tune it monthly. You are not left alone with a robot.",
      },
      {
        q: "Can I turn it off?",
        a: "Anytime. Nothing about your phone system or your data is locked in.",
      },
      {
        q: "My business is unusual. Will this fit?",
        a: "The first call is a diagnosis, not a pitch. We map how leads and jobs actually move through your business and build around that.",
      },
      {
        q: "What do you measure?",
        a: "Answer rate, time to first call, booked jobs, revived leads, hours of admin removed. You get the numbers, not a feeling.",
      },
      {
        q: "Will it keep up as I grow?",
        a: "The same system takes ten calls a day or ten at once. New locations and new lines are configuration, not a rebuild.",
      },
      {
        q: "Why not just hire someone instead?",
        a: "Hire for judgment. For picking up in under a second at 2am and chasing every lead forever, a human was never the right tool.",
      },
    ],
  },
  finalCta: {
    kicker: "Let's talk",
    title: "Find out what the leaks cost you.",
    sub: "A 30-minute call. We look at how leads reach you today and tell you what we would build first.",
  },
  footer: {
    privacy: "Privacy Policy",
    terms: "Terms",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  nav: {
    bookCall: "Réserver un appel",
  },
  hero: {
    kicker: "Systèmes IA pour entreprises de services",
    h1: "On utilise les dernières IA pour faire gagner plus d'argent à votre entreprise.",
    lead: "Rappel des leads en moins d'une minute, relances automatiques, un bureau qui tourne tout seul, des outils sur mesure que personne d'autre ne vous construira. Tout se branche sur ce que vous utilisez déjà, et tout vise le même chiffre.",
  },
  graph: {
    title: "Chaque système qu'on installe nourrit le même chiffre.",
    ariaLabel:
      "Schéma : speed-to-lead, relances, automatisations, IA sur mesure et standard IA alimentent votre entreprise, et tout converge vers plus de chantiers signés.",
    capLeft: "Tourne 24h/24",
    capRight: "Branché sur vos outils",
    center: "VOTRE ENTREPRISE",
    chips: {
      speedToLead: { label: "Speed-to-lead :", stat: "Lead rappelé en 0:52" },
      nurturing: { label: "Relances :", stat: "3 relances parties" },
      automations: { label: "Automatisations :", stat: "12 factures envoyées" },
      customAi: { label: "IA sur mesure :", stat: "Devis sorti en 4 min" },
      receptionist: { label: "Standard IA :", stat: "Décroché en 0.8s" },
    },
    moneyLabel: "Plus de chantiers signés",
    moneySub: "",
  },
  pain: {
    kicker: "Le problème",
    title: "Là où vous perdez de l'argent",
    cards: [
      {
        h3: "Un lead qui attend, c'est un lead qui part.",
        p: "Un lead d'une heure est un lead froid. Si personne ne rappelle dans les minutes qui suivent, le chantier va à celui qui l'a fait.",
      },
      {
        h3: "Un appel manqué, c'est de l'argent déjà dépensé.",
        p: "Vous avez payé des pubs, des avis et des années de réputation pour faire sonner ce téléphone. Chaque sonnerie qui meurt sur le répondeur, c'est de l'argent déjà sorti.",
      },
      {
        h3: "Des soirées perdues en paperasse.",
        p: "Factures, rappels, demandes d'avis, planning. Des heures de clics qu'une machine devrait faire pendant que vous dormez.",
      },
    ],
  },
  services: {
    kicker: "Les systèmes",
    title: "Ce qu'on installe",
    sub: "Construit sur vos outils, mesuré en chantiers signés.",
    speedToLead: {
      status: "Speed-to-lead",
      h3: "Le premier qui rappelle gagne.",
      p: "Un formulaire arrive et notre système rappelle le lead en moins d'une minute, le qualifie et le place dans votre agenda pendant que votre concurrent relève ses mails. S'il vous faut plus de leads, on gère aussi vos pubs.",
    },
    nurturing: {
      status: "Relances",
      h3: "Votre CRM est plein d'argent qui dort.",
      p: "Les relances partent au bon rythme jusqu'à ce qu'un lead réponde, et les centaines de vieux contacts qui dorment dans votre CRM sont rappelés avec une raison de revenir. Vous les avez déjà payés, tous.",
    },
    receptionist: {
      status: "Standard IA",
      h3: "Chaque appel décroché. Même à 2h du matin.",
      p: "Emma décroche en moins d'une seconde, parle comme votre meilleure standardiste, répond aux questions, cale le rendez-vous et synchronise tout. Elle prend dix appels de front et n'est jamais malade.",
    },
    automations: {
      status: "Automatisations",
      h3: "Lundi matin, le travail est déjà fait.",
      p: "Les factures partent quand un chantier se termine, la demande d'avis juste après, les rappels, le dispatch, le reporting. La couche administrative de votre boîte, qui tourne toute seule.",
    },
    customAi: {
      status: "IA sur mesure",
      h3: "Pour le problème qu'aucun logiciel ne règle.",
      p: "Le devis qui vous prend deux soirées, l'appel d'offres de 200 pages que vous redoutez, les questions que votre équipe vous pose cinquante fois par jour. Si c'est propre à votre métier, on construit l'outil qui va avec.",
    },
  },
  speedToLeadArt: {
    submit: "Envoyer",
    webForm: "Formulaire web",
    aiCallsBack: "L'IA rappelle",
    yourCalendar: "Votre agenda",
    booked: "RDV posé",
  },
  crmArt: {
    title: "Votre CRM · vieux leads",
    count: "438 contacts",
    rows: [
      { name: "Remplacement chauffe-eau", sub: "Sans nouvelles · janv. 2025" },
      { name: "Inspection toiture", sub: "Pas de réponse · févr. 2025" },
      { name: "Devis tableau électrique", sub: "Disparu · mars 2025" },
      { name: "Rénovation salle de bain", sub: "Perdu · mai 2025" },
    ],
    dead: "Refroidi",
    live: "RDV posé",
    foot: "3 RDV posés cette semaine",
  },
  emma: {
    titlePre: "En ligne avec ",
    titleName: "Emma",
    incoming: "Appel entrant · Client",
    answered: "Décroché par Emma · 0.8s",
    bubbleCaller: "Bonjour, vous êtes ouverts ? J'ai une fuite sur ma toiture.",
    bubbleEmma: "Oui. Je peux vous envoyer un technicien demain matin. 8h30 ou 10h, qu'est-ce qui vous arrange ?",
    booked: "Rendez-vous posé · jeu. 8h30",
    synced: "Synchronisé CRM & agenda",
  },
  automationsArt: {
    dayLabel: "lun. · 7h00",
    nightLabel: "ven. · 23h58",
    rows: [
      { t: "Facture n°2214 envoyée", s: "Chantier terminé · partie toute seule" },
      { t: "Demande d'avis envoyée", s: "Juste après la facture" },
      { t: "Rappels équipe programmés", s: "Dispatch du lundi · 7h30" },
    ],
  },
  benefits: {
    kicker: "Ce que vous y gagnez",
    title: "Ce qui atterrit dans votre boîte",
    items: [
      "Toujours ouvert. 14h ou 2h du matin.",
      "Des rendez-vous posés directement dans votre agenda",
      "Vos clients ont leur réponse en quelques secondes",
      "Des devis en minutes, pas en soirées",
      "Une fraction du coût d'une embauche",
      "Chaque lead relancé jusqu'à réponse",
      "Le même service à chaque appel, sans exception",
    ],
  },
  compare: {
    eyebrow: "Le calcul",
    title: "face à une embauche.",
    aiHead: "Avec NativeSquare",
    tradHead: "Embauche classique",
    aiRows: [
      "De garde 24h/24",
      "Décroche en moins d'une seconde",
      "Un coût mensuel fixe",
      "Dix appels en même temps",
      "La même qualité au 1er et au 1000e appel",
    ],
    tradRows: [
      "Heures ouvrées seulement",
      "Vos clients patientent",
      "Salaire, charges, turnover",
      "Un appel à la fois",
      "Ça dépend de qui décroche",
    ],
  },
  faq: {
    kicker: "FAQ",
    title: "Questions fréquentes",
    items: [
      {
        q: "Vous construisez quoi, exactement ?",
        a: "Des systèmes qui vous rapportent de l'argent avec les IA les plus récentes : rappel de leads en moins d'une minute, séquences de relance, standard téléphonique, automatisations de back-office et outils sur mesure. Chacun est choisi pour vos fuites à vous, puis branché sur votre entreprise.",
      },
      {
        q: "Je dois changer de téléphonie, de CRM ou d'agenda ?",
        a: "Non. On construit par-dessus ce que vous utilisez déjà. Votre numéro, votre CRM et votre agenda restent.",
      },
      {
        q: "Les résultats arrivent en combien de temps ?",
        a: "La réactivation et le rappel rapide se voient dès les premières semaines, parce qu'ils travaillent sur des leads que vous avez déjà. Tout est mesuré, vous lisez les chiffres vous-même.",
      },
      {
        q: "Ça coûte combien ?",
        a: "Des frais d'installation plus un abonnement mensuel, dimensionnés sur votre volume d'appels et de leads. On le chiffre en rendez-vous, une fois qu'on sait ce que les fuites vous coûtent.",
      },
      {
        q: "Et si l'IA se trompe ?",
        a: "Chaque système est entraîné sur vos services, vos prix et vos règles, testé avant le lancement, et passe la main à un humain dès qu'une demande dépasse son périmètre.",
      },
      {
        q: "Ça peut ressembler à ma boîte ?",
        a: "La voix, l'accueil, le vocabulaire et le ton sont construits sur la façon dont votre équipe parle vraiment. Vos clients entendent votre entreprise.",
      },
      {
        q: "Et après le lancement ?",
        a: "On surveille, on rend compte et on ajuste chaque mois. Vous ne restez pas seul avec un robot.",
      },
      {
        q: "Je peux tout couper ?",
        a: "Quand vous voulez. Rien n'est verrouillé, ni votre téléphonie ni vos données.",
      },
      {
        q: "Mon métier est particulier. Ça collera ?",
        a: "Le premier appel est un diagnostic, pas un argumentaire. On cartographie comment les leads et les chantiers circulent réellement chez vous et on construit autour.",
      },
      {
        q: "Vous mesurez quoi ?",
        a: "Taux de décroché, délai de premier rappel, rendez-vous posés, leads ranimés, heures d'administratif supprimées. Vous avez les chiffres, pas une impression.",
      },
      {
        q: "Ça suivra si je grossis ?",
        a: "Le même système prend dix appels par jour ou dix en même temps. Un nouveau site ou une nouvelle ligne, c'est de la configuration, pas une reconstruction.",
      },
      {
        q: "Pourquoi pas embaucher quelqu'un, plutôt ?",
        a: "Embauchez pour le jugement. Pour décrocher en moins d'une seconde à 2h du matin et relancer chaque lead sans jamais lâcher, un humain n'a jamais été le bon outil.",
      },
    ],
  },
  finalCta: {
    kicker: "On en parle",
    title: "Découvrez ce que les fuites vous coûtent.",
    sub: "Un appel de 30 minutes. On regarde comment les leads arrivent chez vous aujourd'hui et on vous dit ce qu'on construirait en premier.",
  },
  footer: {
    privacy: "Politique de confidentialité",
    terms: "Conditions",
  },
};

export const content: Record<Locale, Dict> = { en, fr };

export function resolveLocale(value: string | null | undefined): Locale {
  return value === "fr" ? "fr" : "en";
}
