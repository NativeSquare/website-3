import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Le moteur de mesure. Une visite par arrivee sur le site depuis une pub, un
 * rendez-vous par reservation Cal.com, rattache a sa visite.
 *
 * Doctrine : atlas/agence/acquisition/moteur-de-mesure.md
 */
export default defineSchema({
  /**
   * Une ligne par arrivee. `visiteId` est frappe par le site et voyage ensuite
   * jusqu'a Cal.com, c'est lui qui relie la pub au client.
   */
  visites: defineTable({
    visiteId: v.string(),
    /* Identifiant durable du navigateur : plusieurs visites, une personne. */
    visiteurId: v.string(),

    /* Ce que LinkedIn passe dans l'URL de destination. Les campagnes portent le
       nom de leur audience, donc `campagneNom` contient le metier et la
       tranche d'age. */
    compteNom: v.optional(v.string()),
    campagneId: v.optional(v.string()),
    campagneNom: v.optional(v.string()),
    groupeId: v.optional(v.string()),
    groupeNom: v.optional(v.string()),
    creaId: v.optional(v.string()),

    /* UTM, pour les sources qui ne sont pas LinkedIn. */
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    utmTerm: v.optional(v.string()),

    /* Tout le reste de la chaine de requete, au cas ou. */
    parametres: v.optional(v.record(v.string(), v.string())),

    chemin: v.string(),
    referent: v.optional(v.string()),
    pays: v.optional(v.string()),

    /* Ce que le pixel Meta laisse dans le navigateur (_fbp toujours, _fbc si
       la visite vient d'une pub) et le navigateur lui-meme : les indices que
       l'API Conversions renvoie a Meta avec la reservation. */
    fbp: v.optional(v.string()),
    fbc: v.optional(v.string()),
    agent: v.optional(v.string()),
  })
    .index("by_visiteId", ["visiteId"])
    .index("by_visiteurId", ["visiteurId"])
    .index("by_campagneNom", ["campagneNom"]),

  /**
   * Une ligne par reservation Cal.com. Les champs d'issue sont vides a la
   * creation : ils se remplissent a la main dans le tableau de bord Convex
   * apres l'appel. C'est cette saisie qui rend les campagnes lisibles.
   */
  rendezvous: defineTable({
    /* Absent si la personne a reserve sans etre passee par une pub. */
    visiteId: v.optional(v.string()),
    calUid: v.string(),
    titre: v.optional(v.string()),
    nom: v.optional(v.string()),
    email: v.optional(v.string()),
    debut: v.optional(v.string()),
    statut: v.optional(v.string()),

    /* Saisi apres l'appel, dans le tableau de bord. */
    issue: v.optional(
      v.union(
        v.literal("qualifie"),
        v.literal("non_qualifie"),
        v.literal("absent"),
        v.literal("signe"),
        v.literal("perdu"),
      ),
    ),
    montant: v.optional(v.number()),
    note: v.optional(v.string()),
  })
    .index("by_calUid", ["calUid"])
    .index("by_visiteId", ["visiteId"]),

  /**
   * Une ligne par sequence post-booking en cours. Contient ce que Cal.com ne
   * sait pas : le portable, le fuseau du prospect et la phrase notee pendant
   * l'appel. Le champ taches garde les identifiants planifies, pour pouvoir
   * tout annuler si le rendez-vous saute.
   */
  sequences: defineTable({
    calUid: v.string(),
    prenom: v.string(),
    nom: v.optional(v.string()),
    email: v.string(),
    telephone: v.optional(v.string()),
    entreprise: v.optional(v.string()),
    note: v.optional(v.string()),
    fuseau: v.string(),
    debut: v.string(),
    lienVisio: v.optional(v.string()),
    taches: v.array(v.id("_scheduled_functions")),
    annulee: v.optional(v.boolean()),
  }).index("by_calUid", ["calUid"]),

  /** Ce qui est parti, ce qui a echoue. Un envoi par ligne. */
  envois: defineTable({
    calUid: v.string(),
    etape: v.string(),
    canal: v.union(v.literal("email"), v.literal("sms"), v.literal("agenda")),
    destinataire: v.string(),
    etat: v.union(v.literal("envoye"), v.literal("echec"), v.literal("ignore")),
    erreur: v.optional(v.string()),
  }).index("by_calUid", ["calUid"]),
});
