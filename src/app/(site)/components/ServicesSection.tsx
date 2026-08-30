import type { ReactNode } from "react";
import type { Dict } from "../content";
import SpeedToLeadArt from "./SpeedToLeadArt";
import CrmReactivationArt from "./CrmReactivationArt";
import EmmaCallCard from "./EmmaCallCard";
import OvernightAutomationsArt from "./OvernightAutomationsArt";
import ToolOrbitArt from "./ToolOrbitArt";

function ServiceBand({
  service,
  flip,
  children,
}: {
  service: { status: string; h3: string; p: string };
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="svc-band">
      <div className={flip ? "svc-grid flip" : "svc-grid"}>
        <header className="svc-head">
          <div className="status">
            <span className="bez">
              <span className="dot pulse" style={{ background: "var(--green)" }}></span>
            </span>
            <span>{service.status}</span>
          </div>
          <h3 className="svc-h">{service.h3}</h3>
          <p className="svc-p">{service.p}</p>
        </header>
        <div className="svc-media-wrap corners">
          <i className="x tl"></i>
          <i className="x tr"></i>
          <i className="x bl"></i>
          <i className="x br"></i>
          <div className="svc-media">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({ t }: { t: Dict }) {
  const s = t.services;
  return (
    <section className="services-sec">
      <div className="container-wide">
        <div className="sec-head">
          <span className="v-line" style={{ left: 0 }} aria-hidden="true"></span>
          <span className="v-line" style={{ right: 0 }} aria-hidden="true"></span>
          <div className="pill">{s.kicker}</div>
          <h2 className="statement">{s.title}</h2>
          <p className="feature-sub">{s.sub}</p>
        </div>
      </div>

      {/* 1 — Speed-to-lead */}
      <ServiceBand service={s.speedToLead}>
        <SpeedToLeadArt t={t} />
      </ServiceBand>

      {/* 2 — Lead nurturing & reactivation */}
      <ServiceBand service={s.nurturing} flip>
        <CrmReactivationArt t={t} />
      </ServiceBand>

      {/* 3 — AI receptionist (Emma persona card) */}
      <ServiceBand service={s.receptionist}>
        <EmmaCallCard t={t} />
      </ServiceBand>

      {/* 4 — Workflow automations */}
      <ServiceBand service={s.automations} flip>
        <OvernightAutomationsArt t={t} />
      </ServiceBand>

      {/* 5 — Custom AI (tool-logo orbit) */}
      <ServiceBand service={s.customAi}>
        <ToolOrbitArt />
      </ServiceBand>
    </section>
  );
}
