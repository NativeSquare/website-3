import type { Metadata } from "next";
import { Suspense } from "react";
import SuiviRelance from "../../components/SuiviRelance";
import LienReservation from "../../components/LienReservation";
import GuideCalculateur from "../../components/GuideCalculateur";
import { Conversation, Flux, Liste } from "../../components/GuideSchemas";

/* Le cadeau des messages de relance, V3 (28/10/2026) : « 8 places an HVAC
   company loses jobs ». Une page, pas un PDF : on voit qui l'ouvre (`?r=` dans
   l'adresse), et le texte se corrige sans renvoyer de fichier.
   Texte et sources : atlas/agence/mentorat-angelo/assets-precall/
   guide-hvac-v3-contenu-2026-10-28.md. Les chiffres du secteur viennent de
   sources tierces, dites comme telles dans les notes de bas de page.
   URL : /hvac/guide?r=<identifiant du lead>&utm_source=meta&utm_medium=sms
   Non indexee : c'est un tunnel. */

export const metadata: Metadata = {
  title: "8 places an HVAC company loses jobs",
  description: "Eight places an HVAC company loses jobs it already paid for, with a ten-minute check for each.",
  robots: { index: false, follow: false },
};

function Bouton({ texte = "Pick a time" }: { texte?: string }) {
  return (
    <Suspense fallback={<a className="btn btn-primary" href="/hvac/call">{texte}</a>}>
      <LienReservation>{texte}</LienReservation>
    </Suspense>
  );
}

function Verif({ children }: { children: React.ReactNode }) {
  return (
    <p className="ld-g-verif">
      <strong>Check it (10 minutes):</strong> {children}
    </p>
  );
}

function Section({ n, titre, children }: { n: number; titre: string; children: React.ReactNode }) {
  return (
    <section className="ld-g-section">
      <h2>
        <span>{n}</span>
        {titre}
      </h2>
      {children}
    </section>
  );
}

export default function GuidePage() {
  return (
    <section className="ld-section ld-reserver">
      <div className="ld-wrap">
        <article className="ld-guide ld-g">
          <h1>8 places an HVAC company loses jobs</h1>
          <p className="ld-g-gros">
            Every job you win cost you something.
            <br />
            An ad. A review. A year of showing up on time.
          </p>
          <p>
            Between &ldquo;the phone rang&rdquo; and &ldquo;the invoice went out&rdquo;, some of those jobs walk away.
            This guide shows you where.
          </p>
          <p>Each part has three things:</p>
          <ul className="ld-g-liste-simple">
            <li>what it costs you</li>
            <li>a check you can do in 10 minutes</li>
            <li>what we do about it</li>
          </ul>
          <p>At the end there is a calculator. You put in your own numbers. It tells you what you lose in a year.</p>
          <div className="ld-g-haut">
            <Bouton />
            <span>if you&rsquo;d rather go through it together</span>
          </div>

          <Section n={1} titre="Not enough calls coming in">
            <p className="ld-g-gros">If the phone doesn&rsquo;t ring, nothing else matters.</p>
            <p>Word of mouth is the best lead you can get. But you can&rsquo;t turn it up when you want.</p>
            <Flux
              etapes={[
                { titre: "Ad", sous: "Facebook, Instagram, Google" },
                { titre: "Short form", sous: "name, phone, what you need" },
                { titre: "Called in a minute", sous: "qualified and booked", accent: true },
                { titre: "Booked job", sous: "in your calendar" },
              ]}
            />
            <p>
              <strong>What a lead costs.</strong> HVAC reference points, from published data:
            </p>
            <ul className="ld-g-liste-simple">
              <li>Local Services Ads: about <strong>$51</strong> a lead</li>
              <li>Google search ads: about <strong>$104</strong> a lead, <strong>$149</strong> for non-branded searches<sup>1</sup></li>
            </ul>
            <p>
              Your numbers will be different. But look at it this way: a lead that goes nowhere is{" "}
              <strong>$50 to $150 you already spent.</strong>
            </p>
            <Verif>
              Take last month&rsquo;s marketing spend. Divide it by the number of calls and forms you got. That&rsquo;s your cost per lead. Write it down.
            </Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <ul>
                <li><strong>We test before we spend big.</strong> Different ads at the same time. We cut what doesn&rsquo;t work and keep what does.</li>
                <li><strong>We know what burns money.</strong> Ads shown inside random phone apps, bad placements, pages that don&rsquo;t work on a phone. We shut those off.</li>
                <li><strong>We track every lead from first click to booked job.</strong> Not clicks. Jobs.</li>
                <li><strong>We know a good number from a bad one.</strong> If your cost per lead or your click rate is far off the normal range for HVAC, something is broken. We find what.</li>
                <li><strong>We hook it to everything below.</strong> A new lead gets a call in a minute, gets booked, gets followed up, gets asked for a review.</li>
                <li><strong>If one source dries up, we add another.</strong> Facebook and Instagram, Google, Local Services Ads, calling lists. We can run the media buying for you too.</li>
              </ul>
            </div>
          </Section>

          <Section n={2} titre="The phone rings and nobody picks up">
            <p>
              You&rsquo;re under a house. Your office person is on the other line. It&rsquo;s 7:40 pm and somebody&rsquo;s AC just died.
            </p>
            <p className="ld-g-gros">They won&rsquo;t leave a message. They call the next company on the list.</p>
            <Conversation
              lignes={[
                { de: "client", texte: "Hi, my AC just died. Can someone come tonight?" },
                { de: "nous", texte: "Yes. I have 8:30 pm or first thing tomorrow. Which is better?" },
              ]}
              pied="Booked · 8:30 pm · in your calendar"
            />
            <p>
              <strong>What it costs you.</strong> Studies of home service companies put unanswered calls between <strong>14%</strong> and <strong>27%</strong>.<sup>2</sup>{" "}
              About <strong>8 in 10</strong> callers hang up on voicemail without a word.<sup>3</sup>
            </p>
            <p>
              Say you miss 8 calls a week. 1 in 5 would have booked. Your average job is $450.
              <br />
              8 × 0.2 × $450 = <strong>$720 a week. About $37,000 a year.</strong>
              <br />
              If one of those callers wanted a $7,500 replacement, that one call beats the whole week.
            </p>
            <Verif>
              Call your own business line tonight from a number it doesn&rsquo;t know. Time how long until a person answers or calls back. Then count last week&rsquo;s missed calls in your phone log.
            </Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>
                Every call is answered in seconds, day and night, by a voice that sounds like your best front-desk person. It answers questions, books the job, and puts it in your calendar.
              </p>
            </div>
          </Section>

          <Section n={3} titre="A new lead waits too long">
            <p>
              A homeowner fills out your form. Their furnace is dead. They fill out three other forms.{" "}
              <strong>The first company to call wins.</strong>
            </p>
            <p>
              <strong>Harvard Business Review studied this.</strong><sup>4</sup> Their finding: most companies are{" "}
              <strong>not responding nearly fast enough.</strong>
            </p>
            <p>
              The researcher behind it, Dr. James Oldroyd, says the answer is <strong>5 minutes</strong>. A lead called within 5 minutes is the one most likely to turn into a customer. After about <strong>30 minutes, the lead is almost dead.</strong><sup>5</sup>
            </p>
            <Flux
              etapes={[
                { titre: "Form comes in" },
                { titre: "Called back", sous: "under a minute", accent: true },
                { titre: "Qualified" },
                { titre: "In your calendar", sous: "before the others call" },
              ]}
            />
            <p>Think about your own shop. How long does a form sit before somebody calls?</p>
            <Verif>Fill out your own contact form from your phone. Time how long until somebody calls.</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>
                A new lead gets a call back in <strong>under a minute</strong>. We ask the right questions and book the job in your calendar before the other guys open the email.
              </p>
            </div>
          </Section>

          <Section n={4} titre="A lead that said yes, then went quiet">
            <p>
              Not everyone books on the first try. They get busy. They forget. Most owners call once. Maybe twice. Then they move on.
            </p>
            <Flux
              etapes={[
                { titre: "Lead doesn't book" },
                { titre: "Text + e-mail", sous: "same day" },
                { titre: "Follow-up", sous: "next day, then a few days later" },
                { titre: "Booked", accent: true },
              ]}
            />
            <Verif>Open your lead list from last month. How many got a second contact? A third?</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>
                A lead that didn&rsquo;t book gets a text and an e-mail the same day, again the next day, and again a few days later. Each one gives them something useful, not just &ldquo;any update?&rdquo;. It stops when they book or say no. <strong>It&rsquo;s the same follow-up that sent you this guide.</strong>
              </p>
            </div>
          </Section>

          <Section n={5} titre="The estimate that goes quiet">
            <p>
              The estimate goes out. The homeowner says &ldquo;we&rsquo;ll think about it&rdquo;. Nobody brings it up again. Two weeks later they signed with whoever followed up.
            </p>
            <Liste
              titre="Your estimates"
              lignes={[
                { nom: "Furnace replacement", sous: "Sent 9 days ago · no answer", etat: "Gone quiet" },
                { nom: "AC install", sous: "Sent 6 days ago · no answer", etat: "Gone quiet" },
                { nom: "Heat pump quote", sous: "Texted today, again in 3 days", etat: "Booked", ok: true },
              ]}
            />
            <p>
              Companies that sell follow-up software report close rates going from the low 30s to <strong>40–50%</strong> when every estimate gets a three-step follow-up.<sup>6</sup> I can&rsquo;t verify their data. Read it as a direction.
            </p>
            <p>
              Do your own math. 20 estimates a month. 25% close. $6,000 average job. Lift the close rate to 30% and you close <strong>one more install a month. $72,000 a year.</strong>
            </p>
            <Verif>Take last month&rsquo;s estimates. How many got a second contact?</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>Every estimate gets a text or a call the next day, again in three days, again in a week. Until it&rsquo;s a yes or a real no.</p>
            </div>
          </Section>

          <Section n={6} titre="The review nobody asked for">
            <p>
              <strong>97%</strong> of people read reviews before they pick a local business.<sup>7</sup> A homeowner choosing who replaces a furnace compares you with two other names. They compare the stars and how many reviews.
            </p>
            <p className="ld-g-gros">Every finished job is a review you didn&rsquo;t ask for.</p>
            <Conversation
              lignes={[{ de: "nous", texte: "Thanks for choosing us today! Would you leave a quick review? One tap, it takes 20 seconds." }]}
              pied="Google review posted ★★★★★"
            />
            <Verif>Count your Google reviews from the last 90 days. Count your jobs from the same 90 days. Divide.</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>Right after the job, the customer gets a text with a one-tap link to review you. Nobody has to remember.</p>
            </div>
          </Section>

          <Section n={7} titre="The customers who already trust you">
            <p>
              You have a list of people who paid you in the last two years. Most haven&rsquo;t heard from you since the invoice.
            </p>
            <p>
              A short message before summer and before winter, with a tune-up offer, costs almost nothing. It reaches people who don&rsquo;t need convincing. Some tune-ups find a dying unit.
            </p>
            <Liste
              titre="Your customer list · 438 contacts"
              lignes={[
                { nom: "Water heater replacement", sous: "Went quiet · Jan 2025", etat: "Booked", ok: true },
                { nom: "Furnace tune-up", sous: "Last call · Oct 2024", etat: "Booked", ok: true },
                { nom: "AC repair", sous: "No contact since the invoice", etat: "Gone cold" },
              ]}
            />
            <p>
              Say you have 800 past customers. 5% book a $350 job. That&rsquo;s <strong>$14,000.</strong> If one of them turns into a $7,500 replacement, add that on top.
            </p>
            <Verif>Pull your customers from the last two years. How many heard from you in the last 12 months, besides an invoice?</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>Your customer list lives in one place. Every season it gets a message, with a reason to book.</p>
            </div>
          </Section>

          <Section n={8} titre="The evenings you give to the office">
            <p>
              Invoices. Reminders. Dispatch notes. Review requests. The weekly numbers. If you do it by hand, it&rsquo;s time that doesn&rsquo;t bring in a job.
            </p>
            <Liste
              titre="Monday, 7:00 am · already done"
              lignes={[
                { nom: "Invoice #2214 sent", sous: "Job closed · sent automatically", etat: "Done", ok: true },
                { nom: "Review request out", sous: "One click after the invoice", etat: "Done", ok: true },
                { nom: "Crew reminders queued", sous: "Dispatch · 7:30 am", etat: "Done", ok: true },
              ]}
            />
            <p>Six hours a week at $75 an hour is <strong>$23,400 a year.</strong></p>
            <Verif>Keep a list for one week. Every office task, with the time it took.</Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>The invoice goes out when the job closes. Reminders, dispatch and reports run on their own.</p>
            </div>
          </Section>

          <section className="ld-g-section">
            <h2>Add it up</h2>
            <p>Put in your numbers. The total at the bottom is what&rsquo;s left on the table every year.</p>
            <GuideCalculateur />
          </section>

          <div className="ld-guide-cta">
            <h2>If you also think this money is better in your pocket, you&rsquo;ll want to hear more about what we do.</h2>
            <p>Book your call and see if you qualify.</p>
            <Bouton texte="Book your call" />
          </div>

          <p className="ld-guide-sources">
            <sup>1</sup> SearchLight Digital data (816 contractors, January 2026), as reported by{" "}
            <a href="https://www.enrichlabs.ai/blog/hvac-marketing-complete-guide-2026" target="_blank" rel="noreferrer">Enrich Labs</a> and{" "}
            <a href="https://www.webtonic.io/blog/heating-ventilation-google-ads-statistics" target="_blank" rel="noreferrer">Webtonic</a>. Vendor-reported.{" "}
            <sup>2</sup> CallRail small-business benchmark, January 2025 (14%); Invoca, 2024 (27%). As reported by third-party sites; originals not read.{" "}
            <sup>3</sup> Industry surveys cited by answering-service vendors. No primary source found.{" "}
            <sup>4</sup> J. Oldroyd, K. McElheran, D. Elkington,{" "}
            <a href="https://scholarsarchive.byu.edu/facpub/9711" target="_blank" rel="noreferrer">The Short Life of Online Sales Leads</a>, Harvard Business Review, 2011.{" "}
            <sup>5</sup> Summary of Dr. Oldroyd&rsquo;s research in{" "}
            <a href="https://www.cbsnews.com/news/online-sales-leads-how-long-are-they-hot/" target="_blank" rel="noreferrer">CBS MoneyWatch</a>, 2010.{" "}
            <sup>6</sup> Vendor-reported close rates for HVAC estimates with and without follow-up. Not verified.{" "}
            <sup>7</sup> BrightLocal,{" "}
            <a href="https://www.brightlocal.com/research/local-consumer-review-survey/2026/" target="_blank" rel="noreferrer">Local Consumer Review Survey 2026</a>.
          </p>
        </article>
      </div>
      <Suspense fallback={null}>
        <SuiviRelance page="guide" />
      </Suspense>
    </section>
  );
}
