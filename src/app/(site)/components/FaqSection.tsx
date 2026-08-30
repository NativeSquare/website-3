import type { Dict } from "../content";

/* Native <details>/<summary> accordion — no JavaScript needed, exactly like
   the mockup. The rotating crosshair is pure CSS on details[open]. */
export default function FaqSection({ t }: { t: Dict }) {
  return (
    <section className="faq-sec">
      <div className="container">
        <div className="faq-head">
          <div className="pill">{t.faq.kicker}</div>
          <h2 className="statement">{t.faq.title}</h2>
        </div>
        <div className="faq-list">
          {t.faq.items.map((item) => (
            <details key={item.q}>
              <span className="hr-dash" aria-hidden="true"></span>
              <summary>
                {item.q}
                <span className="x"></span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
