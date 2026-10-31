import type { Metadata } from "next";
import { Suspense } from "react";
import SuiviRelance from "../../components/SuiviRelance";
import LienReservation from "../../components/LienReservation";
import GuideCalculateur from "../../components/GuideCalculateur";
import GuidePopup from "../../components/GuidePopup";
import { Conversation, Flux, Liste, SchemaEntonnoir } from "../../components/GuideSchemas";

/* Le cadeau des messages de relance, V4 (31/10/2026) : « 8 places an HVAC
   company loses jobs ». Une page, pas un PDF : on voit qui l'ouvre (`?r=` dans
   l'adresse), et le texte se corrige sans renvoyer de fichier.
   V4 : le guide s'ouvre sur l'entonnoir (haut = generation de leads, bas =
   conversion de leads), avec quatre parties de chaque cote. Les huit parties
   restent huit : l'annonce « 8 ways to get more HVAC jobs » ne change pas.
   Texte, sources et ce qui n'a pas ete mis : atlas/agence/mentorat-angelo/
   assets-precall/guide-hvac-v4-contenu-2026-10-31.md. Les chiffres du secteur
   viennent de sources tierces, dites comme telles dans les notes de bas de page.
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

/* Le bandeau qui ouvre chaque moitie de l'entonnoir. */
function Partie({ etiquette, titre, texte }: { etiquette: string; titre: string; texte: string }) {
  return (
    <div className="ld-g-partie">
      <small>{etiquette}</small>
      <h2>{titre}</h2>
      <p>{texte}</p>
    </div>
  );
}

/* Un conseil d'expert : un titre, un texte, souvent ce qu'on fait sur notre propre campagne. */
function Astuce({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="ld-g-astuce">
      <h3>{titre}</h3>
      {children}
    </div>
  );
}

function Faire({ children }: { children: React.ReactNode }) {
  return (
    <p className="ld-g-faire">
      <strong>This week:</strong> {children}
    </p>
  );
}

/* Ce que nous faisons sur notre propre campagne HVAC (lancee le 10/10/2026) :
   jamais un resultat de client, il n'y en a pas encore. */
function Nous({ children }: { children: React.ReactNode }) {
  return (
    <p className="ld-g-nous">
      <strong>On our own HVAC campaign:</strong> {children}
    </p>
  );
}

/* Un morceau de partie qui garde son titre : les parties 5 a 7 en ont deux. */
function Sous({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="ld-g-sous">
      <h3>{titre}</h3>
      {children}
    </div>
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

          <h2 className="ld-g-titre-ctx">How a lead becomes a job</h2>
          <p>Every shop has the same funnel, whether you ever draw it or not.</p>
          <p>
            <strong>The top is lead generation.</strong> Strangers find you and raise a hand: a call, a form, a text.
          </p>
          <p>
            <strong>The bottom is lead conversion.</strong> Those leads get answered, followed up, booked, and turned
            into customers who come back.
          </p>
          <SchemaEntonnoir />
          <p>
            It&rsquo;s easy to work on one half and forget the other. A leak at the top leaves you less to work with. A
            leak at the bottom wastes every dollar you spent above it. This guide has four parts for each half, and we
            work on both, including the hand-off between them.
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

          <Partie
            etiquette="Top of the funnel · parts 1 to 4"
            titre="Lead generation"
            texte="Getting strangers to find you and raise a hand."
          />

          <Section n={1} titre="Customers can't find you">
            <p className="ld-g-gros">If the phone doesn&rsquo;t ring, nothing else matters.</p>
            <p>
              Word of mouth is the best lead you can get. But you can&rsquo;t turn it up when you want. Search is the
              door you can open yourself: Google Maps, Google ads, and now the AI answers on top of the results.
            </p>

            <Astuce titre="Fill out your Google profile like it’s your storefront">
              <p>
                Google ranks local results on relevance, distance and prominence. Prominence counts how well known you
                are, including how many reviews you have. Google also says you can&rsquo;t pay for a better local
                ranking.<sup>1</sup> So the profile itself matters: every service you offer, your service area, your
                real hours, the phone number you actually answer, and photos of your trucks and finished jobs.
              </p>
              <Liste
                titre="Your Google profile · 5-minute check"
                lignes={[
                  { nom: "Services and service area", sous: "Everything you do, every town you cover", etat: "Done", ok: true },
                  { nom: "Hours", sous: "Holidays included", etat: "Done", ok: true },
                  { nom: "Phone number", sous: "The one that gets answered", etat: "Done", ok: true },
                  { nom: "Photos", sous: "Trucks, crew, finished jobs", etat: "Add 10" },
                ]}
              />
              <Faire>open your profile and fill in every empty field.</Faire>
            </Astuce>

            <Astuce titre="Pay per lead, not per click">
              <p>
                Local Services Ads are pay-per-lead: you&rsquo;re charged when a customer reaches you by call, message
                or booking, not for views.<sup>2</sup> Google screens advertisers first. The checks can include a
                license, insurance and a background check.<sup>2</sup> Leads it finds invalid or low quality are not
                charged, and poor ones are credited, usually within 30 days. Google no longer gives credits for a job
                type you don&rsquo;t do or an area you don&rsquo;t cover, so set both tight.<sup>3</sup>
              </p>
              <Faire>
                if you run these ads, open last month&rsquo;s leads and mark every wrong job or wrong area. Many of
                them? Tighten your settings.
              </Faire>
            </Astuce>

            <Astuce titre="Answer the phone. Google keeps score.">
              <p>
                On Local Services Ads, Google ranks you on more than your bid. It looks at how well you respond to
                customers, and it says missed calls may hurt that.<sup>4</sup> So answering the phone changes how often
                you show up, on top of the jobs you save (part 5 shows the math).
              </p>
              <Faire>count last week&rsquo;s missed calls.</Faire>
            </Astuce>

            <Astuce titre="Write the page for the question, for Google and for AI answers">
              <p>
                Customers now ask Google and AI assistants things like &ldquo;my furnace isn&rsquo;t heating, who can
                come tonight?&rdquo; Google says its AI answers (AI Overviews and AI Mode) have no extra requirements
                and need no special optimization. The normal SEO fundamentals apply.<sup>5</sup> So the work is the
                usual work, done well: one page per service and per town, with what you fix, where you work, your
                hours, how fast you come, what changes the price, and real photos of your crew and your jobs.
              </p>
              <Faire>write one page for your most common emergency call.</Faire>
            </Astuce>

            <Verif>
              Search &ldquo;[your main service] near me&rdquo; on your phone, from a customer&rsquo;s neighborhood. Write
              down where you show up, how many reviews the first three results have compared to you, and whether the
              phone number on your listing is the one you answer.
            </Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <p>
                We look at where you show up today. Then we connect every call and form from search to the follow-up in
                parts 5 to 8, so a call from Google gets the same speed as a call from an ad.
              </p>
            </div>
          </Section>

          <Section n={2} titre="Your ads bring clicks, not booked jobs">
            <p>
              Facebook, Instagram and Google ads can fill your calendar. They can also burn money without a sound.
              These are the things we check first.
            </p>
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
              <li>Google search ads: about <strong>$104</strong> a lead, <strong>$149</strong> for non-branded searches<sup>6</sup></li>
            </ul>
            <p>
              Your numbers will be different. But look at it this way: a lead that goes nowhere is{" "}
              <strong>$50 to $150 you already spent.</strong>
            </p>

            <Astuce titre="Choose where the ad lands, on purpose">
              <p>
                There are three common destinations. A form inside Facebook (a Meta instant form) takes a few taps.
                Meta offers two types: one built for volume, and &ldquo;Higher intent&rdquo;, which adds a review step
                before people submit.<sup>7</sup> Your own landing page is slower, but you can ask the questions that
                qualify the lead and book the call on the same page. A phone button works for emergencies.
              </p>
              <p>
                The more you ask before you take a phone number, the fewer leads you get, and the better they are. That
                is our rule of thumb, not Meta&rsquo;s. Pick from what a booked job is worth: a $7,500 replacement can
                carry a quiz, a $450 repair usually can&rsquo;t.
              </p>
              <Nous>
                ours is a quiz page that asks two questions before it asks for a phone number, then books the call. We
                also built the instant-form route, so the two can be compared on the same ads.
              </Nous>
            </Astuce>

            <Astuce titre="ABO or CBO: it depends on what you're testing">
              <p>
                Meta&rsquo;s Advantage+ campaign budget, the new name for CBO, spreads one budget across your ad sets
                for you. With a budget per ad set (ABO), you decide where each dollar goes.<sup>8</sup> When you&rsquo;re
                testing ads on a small budget, we give each ad its own budget and put one ad in each ad set, so every
                ad gets a fair chance. Once you have winners, a campaign budget lets Meta shift spend toward them. Again,
                that&rsquo;s our rule, not Meta&rsquo;s.
              </p>
              <Nous>
                ours is ABO: three ad sets, one video each, the same audience (all of the US, 25 and up, no interest
                targeting). The only thing that changes is the hook.
              </Nous>
            </Astuce>

            <Astuce titre="Test the opening first">
              <p>
                On a video ad, change the opening line and keep everything else identical. Then you know what made the
                difference. Change three things at once and you learn nothing.
              </p>
              <Nous>three openings on the same video: a question, a contrast, and a myth to correct.</Nous>
            </Astuce>

            <Astuce titre="Don't edit an ad that is still learning">
              <p>
                Meta says a significant edit can restart the learning phase: pausing, or changing the audience, the
                creative or the optimization event. Big budget or bid changes can count too. Its benchmark is about 50
                optimization events since the last significant edit.<sup>9</sup> So change one thing at a time, write
                down the date, and don&rsquo;t judge an ad before it has had real traffic. Our own rule of thumb is not
                to cut an ad before about 1,000 visitors.
              </p>
            </Astuce>

            <Astuce titre="Optimize for the event that pays">
              <p>
                Meta looks for more of whatever event you tell it to optimize for. Pick &ldquo;lead&rdquo; and it finds
                people who leave their details. If it also receives your bookings, it can learn to find people who
                book, once there are enough of them to learn from.
              </p>
              <Nous>
                we send each booking to Meta as its own event, with the person&rsquo;s role and revenue range, so the
                data is there to optimize on.
              </Nous>
            </Astuce>

            <Verif>
              Take last month&rsquo;s marketing spend. Divide it by the number of calls and forms you got. That&rsquo;s
              your cost per lead. Write it down. Then divide it by the number of jobs you booked. That&rsquo;s what a
              job really costs you.
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

          <Section n={3} titre="You can't tell which dollar brought which job">
            <p>
              If you can&rsquo;t say which ad, search or text brought a job, you can&rsquo;t say what to spend more on.
              This is where the picture gets blurry.
            </p>

            <Astuce titre="Send every lead twice, with the same ID">
              <p>
                Meta can receive an event from the visitor&rsquo;s browser (the Pixel) and from your server (the
                Conversions API). If you send both, give each copy the same event name and the same event ID, and Meta
                keeps one. Without an ID, it can&rsquo;t merge them.<sup>10</sup> Browsers block some trackers, so the
                server copy fills the gaps.
              </p>
              <Nous>
                every lead goes to Meta from the browser and from our server with the same ID, and we check that both
                show up in Events Manager.
              </Nous>
            </Astuce>

            <Astuce titre="Put a name tag on every ad">
              <p>
                Tag the link of each ad, so a booking points to the ad that brought it, not only to
                &ldquo;Facebook&rdquo;.
              </p>
              <Nous>our links carry the ad name, so every booking in our database shows the ad behind it.</Nous>
            </Astuce>

            <Astuce titre="Read the funnel one screen at a time">
              <p>
                Add an event on every step: page seen, each question, contact left, qualification done, call booked.
                Then split by ad and by device. The screen where most people stop is the one to fix first.
              </p>
              <Nous>we read ours step by step in PostHog, by ad and by phone or computer.</Nous>
            </Astuce>

            <Astuce titre="Check click quality before you blame the ad">
              <p>
                Compare three numbers: link clicks in Meta, landing page views, and real visits on your side. A big gap
                means people click and leave before the page loads, or click by accident.
              </p>
              <Nous>
                we compare Meta&rsquo;s link clicks with the clicks our own server records, so we know none are lost in
                measurement.
              </Nous>
            </Astuce>

            <Verif>
              Take your last 10 booked jobs. For each one, write where it came from: which ad, which search, which
              referral. More than two you can&rsquo;t place? You&rsquo;re guessing.
            </Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <ul>
                <li><strong>We follow every lead from first click to booked job,</strong> in the browser and on the server.</li>
                <li><strong>Every ad has its own tag,</strong> so you see jobs per ad, not clicks per ad.</li>
                <li><strong>We read the funnel screen by screen</strong> and fix the worst screen first.</li>
                <li><strong>We check the numbers add up:</strong> the clicks Meta reports against the visits we record.</li>
              </ul>
            </div>
          </Section>

          <Section n={4} titre="The people who almost said yes">
            <p>
              Most people don&rsquo;t book on the first visit. They look, leave and keep shopping. On our own campaign,
              most visitors leave before they leave a number.
            </p>

            <Astuce titre="Build an audience from people who looked and didn't convert">
              <p>
                In Meta you can build an audience from your website visitors, choose how many days they stay in it, and
                leave out the people who already gave their details.<sup>11</sup> Show them the next step, not the same
                pitch again.
              </p>
              <p>
                Size matters. Google serves an audience list only once it has at least 100 active users in the last 30
                days.<sup>12</sup> On small traffic, that can take a while.
              </p>
              <Nous>
                our Google lists held 16 to 24 people when we checked on 15/10, too small to serve. Our visitors come
                from Facebook and Instagram, so Meta is where retargeting makes sense for us.
              </Nous>
            </Astuce>

            <Astuce titre="Follow up on every channel, and tag each one">
              <p>
                A lead may see your ad, search your name, then open your text. That&rsquo;s several touches, and you
                want to know which one brought them back. Give every link in a text or an e-mail a source, a channel and
                a message tag.
              </p>
              <Nous>
                every link in our follow-up texts and e-mails carries the channel, the message and the lead&rsquo;s ID.
                We see that a lead opened the guide from the second text, and we get an alert when they do.
              </Nous>
            </Astuce>

            <Astuce titre="Be the name people give when they're asked">
              <p>
                People who work with homes get asked &ldquo;who do you use for HVAC?&rdquo; Realtors, property managers,
                landlords. Pick five. Bring each one a one-page price sheet and promise a callback within the hour.
                After any job that went well, ask the customer who else they know that needs HVAC work.
              </p>
              <Faire>write down five names. Call two.</Faire>
            </Astuce>

            <Verif>
              Open your ad account. Is there an audience of people who visited your site and didn&rsquo;t leave their
              details? If not, you pay to reach each person once.
            </Verif>
            <div className="ld-g-fait">
              <h3>What we do</h3>
              <ul>
                <li><strong>We build audiences from visitors who engaged and didn&rsquo;t convert,</strong> and leave out the ones who already did.</li>
                <li><strong>We tag every link in every follow-up,</strong> so you see which message brought each lead back.</li>
                <li><strong>We watch the size of each audience</strong> and use the channel that can actually serve it.</li>
              </ul>
            </div>
          </Section>

          <Partie
            etiquette="Bottom of the funnel · parts 5 to 8"
            titre="Lead conversion"
            texte="Turning the leads you paid for into booked jobs, and those customers into repeat customers."
          />

          <Section n={5} titre="Calls and forms wait too long">
            <Sous titre="The phone rings and nobody picks up">
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
                <strong>What it costs you.</strong> Studies of home service companies put unanswered calls between <strong>14%</strong> and <strong>27%</strong>.<sup>13</sup>{" "}
                About <strong>8 in 10</strong> callers hang up on voicemail without a word.<sup>14</sup>
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
            </Sous>

            <Sous titre="A new lead waits too long">
              <p>
                A homeowner fills out your form. Their furnace is dead. They fill out three other forms.{" "}
                <strong>The first company to call wins.</strong>
              </p>
              <p>
                <strong>Harvard Business Review studied this.</strong><sup>15</sup> Their finding: most companies are{" "}
                <strong>not responding nearly fast enough.</strong>
              </p>
              <p>
                The researcher behind it, Dr. James Oldroyd, says the answer is <strong>5 minutes</strong>. A lead called within 5 minutes is the one most likely to turn into a customer. After about <strong>30 minutes, the lead is almost dead.</strong><sup>16</sup>
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
            </Sous>
          </Section>

          <Section n={6} titre="Leads and estimates go quiet">
            <Sous titre="A lead that said yes, then went quiet">
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
            </Sous>

            <Sous titre="The estimate that goes quiet">
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
                Companies that sell follow-up software report close rates going from the low 30s to <strong>40–50%</strong> when every estimate gets a three-step follow-up.<sup>17</sup> I can&rsquo;t verify their data. Read it as a direction.
              </p>
              <p>
                Do your own math. 20 estimates a month. 25% close. $6,000 average job. Lift the close rate to 30% and you close <strong>one more install a month. $72,000 a year.</strong>
              </p>
              <Verif>Take last month&rsquo;s estimates. How many got a second contact?</Verif>
              <div className="ld-g-fait">
                <h3>What we do</h3>
                <p>Every estimate gets a text or a call the next day, again in three days, again in a week. Until it&rsquo;s a yes or a real no.</p>
              </div>
            </Sous>
          </Section>

          <Section n={7} titre="Reviews and the customers you already have">
            <Sous titre="The review nobody asked for">
              <p>
                <strong>97%</strong> of people read reviews before they pick a local business.<sup>18</sup> A homeowner choosing who replaces a furnace compares you with two other names. They compare the stars and how many reviews.
              </p>
              <p className="ld-g-gros">Every finished job is a review you didn&rsquo;t ask for.</p>
              <Conversation
                lignes={[{ de: "nous", texte: "Thanks for choosing us today! Would you leave a quick review? One tap, it takes 20 seconds." }]}
                pied="Google review posted ★★★★★"
              />
              <Astuce titre="Ask every customer the same way, with no deal attached">
                <p>
                  Google lets you ask real customers for reviews. It doesn&rsquo;t allow rewards, like a discount or a
                  free service, and it doesn&rsquo;t allow asking only the customers you expect to be happy.<sup>19</sup>{" "}
                  If you break those rules, Google can restrict your profile, for example by blocking new reviews for a
                  while.<sup>19</sup> So ask everyone, with the same text, and offer nothing in return.
                </p>
                <Faire>text the review link to your last ten customers.</Faire>
              </Astuce>
              <Verif>Count your Google reviews from the last 90 days. Count your jobs from the same 90 days. Divide.</Verif>
              <div className="ld-g-fait">
                <h3>What we do</h3>
                <p>Right after the job, the customer gets a text with a one-tap link to review you. Nobody has to remember.</p>
              </div>
            </Sous>

            <Sous titre="The customers who already trust you">
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
              <Astuce titre="Sell a maintenance plan with every job">
                <p>
                  A plan means a scheduled visit, twice a year. Software vendors that sell to HVAC shops say plans bring
                  steady income when installs slow down, and that regular visits are a chance to spot repair needs and
                  sell upgrades.<sup>20</sup> I won&rsquo;t quote the retention numbers you see online. They come from
                  vendors too.
                </p>
                <Faire>add a two-visit plan to your next tune-up or install estimate.</Faire>
              </Astuce>
              <Verif>Pull your customers from the last two years. How many heard from you in the last 12 months, besides an invoice?</Verif>
              <div className="ld-g-fait">
                <h3>What we do</h3>
                <p>Your customer list lives in one place. Every season it gets a message, with a reason to book.</p>
              </div>
            </Sous>
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
            <sup>1</sup> Google,{" "}
            <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noreferrer">Tips to improve your local ranking on Google</a>.{" "}
            <sup>2</sup> Google Ads,{" "}
            <a href="https://ads.google.com/intl/en_us/home/resources/articles/build-online-presence-with-local-services-ads" target="_blank" rel="noreferrer">How to grow your business with Local Services Ads</a>; Google, Local Services Help,{" "}
            <a href="https://support.google.com/localservices/answer/6230381" target="_blank" rel="noreferrer">How providers qualify</a>.{" "}
            <sup>3</sup> Google, Local Services Help,{" "}
            <a href="https://support.google.com/localservices/answer/15100654" target="_blank" rel="noreferrer">About automated lead credits</a> and{" "}
            <a href="https://support.google.com/localservices/answer/7195435" target="_blank" rel="noreferrer">How leads work</a>.{" "}
            <sup>4</sup> Google, Local Services Help,{" "}
            <a href="https://support.google.com/localservices/answer/7527305" target="_blank" rel="noreferrer">About ad rankings</a>.{" "}
            <sup>5</sup> Google Search Central,{" "}
            <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noreferrer">AI features and your website</a>.{" "}
            <sup>6</sup> SearchLight Digital data (816 contractors, January 2026), as reported by{" "}
            <a href="https://www.enrichlabs.ai/blog/hvac-marketing-complete-guide-2026" target="_blank" rel="noreferrer">Enrich Labs</a> and{" "}
            <a href="https://www.webtonic.io/blog/heating-ventilation-google-ads-statistics" target="_blank" rel="noreferrer">Webtonic</a>. Vendor-reported.{" "}
            <sup>7</sup> Meta Business Help,{" "}
            <a href="https://www.facebook.com/business/help/252352181957512/" target="_blank" rel="noreferrer">About instant form types</a>. Read through search extracts.{" "}
            <sup>8</sup> Meta Business Help,{" "}
            <a href="https://www.facebook.com/business/help/773289396357218" target="_blank" rel="noreferrer">About Advantage+ campaign budget</a>. Read through search extracts.{" "}
            <sup>9</sup> Meta Business Help,{" "}
            <a href="https://www.facebook.com/business/help/112167992830700" target="_blank" rel="noreferrer">About the learning phase</a> and{" "}
            <a href="https://www.facebook.com/business/help/942374239243867" target="_blank" rel="noreferrer">Last significant edit</a>. Read through search extracts.{" "}
            <sup>10</sup> Meta for Developers,{" "}
            <a href="https://developers.facebook.com/documentation/ads-commerce/conversions-api/deduplicate-pixel-and-server-events" target="_blank" rel="noreferrer">Handling duplicate Pixel and Conversions API events</a>. Read through search extracts.{" "}
            <sup>11</sup> Meta Business Help,{" "}
            <a href="https://www.facebook.com/business/help/666509013483225" target="_blank" rel="noreferrer">Create a custom audience from website events</a>; Meta for Developers,{" "}
            <a href="https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/guides/engagement-custom-audiences.md" target="_blank" rel="noreferrer">Engagement custom audiences</a> (exclusion rules). Read through search extracts.{" "}
            <sup>12</sup> Google Ads Help,{" "}
            <a href="https://support.google.com/google-ads/answer/7558048" target="_blank" rel="noreferrer">About audience segments in Audience manager</a>.{" "}
            <sup>13</sup> CallRail small-business benchmark, January 2025 (14%); Invoca, 2024 (27%). As reported by third-party sites; originals not read.{" "}
            <sup>14</sup> Industry surveys cited by answering-service vendors. No primary source found.{" "}
            <sup>15</sup> J. Oldroyd, K. McElheran, D. Elkington,{" "}
            <a href="https://scholarsarchive.byu.edu/facpub/9711" target="_blank" rel="noreferrer">The Short Life of Online Sales Leads</a>, Harvard Business Review, 2011.{" "}
            <sup>16</sup> Summary of Dr. Oldroyd&rsquo;s research in{" "}
            <a href="https://www.cbsnews.com/news/online-sales-leads-how-long-are-they-hot/" target="_blank" rel="noreferrer">CBS MoneyWatch</a>, 2010.{" "}
            <sup>17</sup> Vendor-reported close rates for HVAC estimates with and without follow-up. Not verified.{" "}
            <sup>18</sup> BrightLocal,{" "}
            <a href="https://www.brightlocal.com/research/local-consumer-review-survey/2026/" target="_blank" rel="noreferrer">Local Consumer Review Survey 2026</a>.{" "}
            <sup>19</sup> Google Business Profile Help,{" "}
            <a href="https://support.google.com/business/answer/7400114" target="_blank" rel="noreferrer">Prohibited &amp; restricted content</a> and{" "}
            <a href="https://support.google.com/business/answer/14114287" target="_blank" rel="noreferrer">Business Profile restrictions for policy violations</a>.{" "}
            <sup>20</sup> Blogs of HVAC software vendors:{" "}
            <a href="https://www.servicetitan.com/blog/recession-proof-hvac-business" target="_blank" rel="noreferrer">ServiceTitan</a> and{" "}
            <a href="https://fieldedge.com/blog/hvac-service-agreement-programs/" target="_blank" rel="noreferrer">FieldEdge</a>. Vendor claims, not verified.
          </p>
        </article>
      </div>
      <Suspense fallback={null}>
        <SuiviRelance page="guide" />
        <GuidePopup />
      </Suspense>
    </section>
  );
}
