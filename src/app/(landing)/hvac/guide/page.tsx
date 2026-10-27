import type { Metadata } from "next";
import { Suspense } from "react";
import SuiviRelance from "../../components/SuiviRelance";
import LienReservation from "../../components/LienReservation";

/* Le cadeau des messages de relance : « 5 ways to get more jobs as an HVAC
   company ». Une page, pas un PDF : on voit qui l'ouvre (`?r=` dans l'adresse),
   et le texte se corrige sans renvoyer de fichier. Les deux chiffres cites ont
   leur source en bas ; les autres conseils sont des verifications a faire dans
   sa propre entreprise, sans resultat annonce.
   URL : /hvac/guide?r=<identifiant du lead>&utm_source=meta&utm_medium=sms
   Non indexee : c'est un tunnel. */

export const metadata: Metadata = {
  title: "5 ways to get more jobs as an HVAC company",
  description: "Five places an HVAC company wins or loses jobs, with a ten-minute check for each.",
  robots: { index: false, follow: false },
};

const CONSEILS: Array<{ titre: string; corps: React.ReactNode; verifier: string }> = [
  {
    titre: "Call back every missed call within minutes",
    corps: (
      <>
        A customer whose call goes to voicemail is usually calling the next company on the list.
        Research published in Harvard Business Review in 2011 looked at how fast companies answered
        online sales leads, and found that the ones that responded within an hour were far likelier
        to qualify a lead than the ones that waited longer.<sup>1</sup>
      </>
    ),
    verifier:
      "Call your own business line after hours, from a number you don't use. Time how long it takes for a person to answer or call you back.",
  },
  {
    titre: "Follow up on every estimate until you get a yes or a real no",
    corps: (
      <>
        An estimate that goes out and is never mentioned again usually just sits in the
        customer&rsquo;s inbox. Pick a simple rule and stick to it: a call or text the next day,
        again after three days, again after a week.
      </>
    ),
    verifier: "List last month's estimates and count how many got a second contact.",
  },
  {
    titre: "Ask every happy customer for a Google review, and answer every review you get",
    corps: (
      <>
        Almost everyone reads reviews before choosing a local business: 97% of consumers do,
        according to BrightLocal&rsquo;s 2026 Local Consumer Review Survey.<sup>2</sup> A reply
        under each review, good or bad, shows the next customer how you treat people.
      </>
    ),
    verifier: "Count the reviews you got in the last 90 days, and how many you answered.",
  },
  {
    titre: "Keep your Google Business Profile complete and accurate",
    corps: (
      <>
        When someone searches for an HVAC company near them, your profile is one of the first
        things they see: your categories, service area, hours, photos, and a phone number that
        actually gets answered.
      </>
    ),
    verifier:
      "Search “HVAC near me” on your phone from your own town, and look at what a customer sees.",
  },
  {
    titre: "Call your past customers before each season",
    corps: (
      <>
        People who already hired you know you and trust you. A short reminder before summer and
        before winter, with an offer of a tune-up, costs a few calls and gets you in front of
        customers who don&rsquo;t need convincing.
      </>
    ),
    verifier:
      "Pull your customer list for the last two years and count how many heard from you in the last 12 months.",
  },
];

export default function GuidePage() {
  return (
    <section className="ld-section ld-reserver">
      <div className="ld-wrap">
        <article className="ld-guide">
          <h1>5 ways to get more jobs as an HVAC company</h1>
          <p className="ld-guide-intro">
            In our experience, these are the five places an HVAC company wins or loses jobs. Each
            one comes with a check you can do in your own shop in ten minutes.
          </p>

          <ol className="ld-guide-liste">
            {CONSEILS.map((c, i) => (
              <li key={c.titre}>
                <h2>
                  <span>{i + 1}</span>
                  {c.titre}
                </h2>
                <p>{c.corps}</p>
                <p className="ld-guide-verif">
                  <strong>Check it:</strong> {c.verifier}
                </p>
              </li>
            ))}
          </ol>

          <div className="ld-guide-cta">
            <h2>Want us to look at how your shop handles these five?</h2>
            <p>Pick a time for a 30-minute video call.</p>
            <Suspense fallback={<a className="btn btn-primary" href="/hvac/call">Pick a time</a>}>
              <LienReservation>Pick a time</LienReservation>
            </Suspense>
          </div>

          <p className="ld-guide-sources">
            <sup>1</sup> J. Oldroyd, K. McElheran, D. Elkington,{" "}
            <a href="https://scholarsarchive.byu.edu/facpub/9711" target="_blank" rel="noreferrer">
              The Short Life of Online Sales Leads
            </a>
            , Harvard Business Review, 2011. <sup>2</sup> BrightLocal,{" "}
            <a
              href="https://www.brightlocal.com/research/local-consumer-review-survey/2026/"
              target="_blank"
              rel="noreferrer"
            >
              Local Consumer Review Survey 2026
            </a>
            .
          </p>
        </article>
      </div>
      <Suspense fallback={null}>
        <SuiviRelance page="guide" />
      </Suspense>
    </section>
  );
}
