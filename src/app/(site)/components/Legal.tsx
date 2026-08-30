"use client";

import { useState } from "react";
import { Shield, Scale, Lock, Building } from "lucide-react";

const Legal: React.FC = () => {
  const [activeSection, setActiveSection] = useState("mentions");

  const sections = [
    { id: "mentions", label: "Legal Mentions", icon: Building },
    { id: "terms", label: "Terms of Service", icon: Scale },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "cookies", label: "Cookie Policy", icon: Shield },
  ];

  return (
    <div
      className="pt-32 pb-24 min-h-screen"
      style={{ background: "var(--gray-98)", color: "var(--gray-5)" }}
    >
      <div className="container-md max-[1023px]:px-16 max-md:px-5">
        <div className="mb-12">
          <h1 className="font-title fs-56 font-medium leading-none tracking-tighter max-[1023px]:!text-[40px] max-md:!text-[32px]">
            Legal Center
          </h1>
          <p className="mt-4 fs-16 leading-snug tracking-tight text-gray-30 max-w-2xl">
            At NativeSquare, we value transparency and trust. Here you will
            find all the legal documents governing our relationship and the
            protection of your data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium tracking-tight transition-all ${
                      activeSection === section.id
                        ? "bg-gray-94 text-gray-5"
                        : "text-gray-40 hover:bg-gray-94 hover:text-gray-5"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.label}
                  </button>
                ))}
              </nav>

              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "var(--gray-94)",
                  border: "1px solid var(--gray-90)",
                }}
              >
                <h4 className="text-[13px] font-medium tracking-tight mb-3">
                  Contact Legal Team
                </h4>
                <p className="text-[13px] leading-relaxed text-gray-40 mb-3">
                  For any questions regarding our terms or your data rights:
                </p>
                <a
                  href="mailto:office@nativesquare.fr"
                  className="text-[14px] font-medium tracking-tight"
                  style={{ color: "var(--primary-blue)" }}
                >
                  office@nativesquare.fr
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-9">
            <div
              className="rounded-2xl p-8 sm:p-12"
              style={{
                background: "var(--gray-94)",
                border: "1px solid var(--gray-90)",
              }}
            >
              {activeSection === "mentions" && (
                <section>
                  <h2 className="font-title fs-32 font-medium leading-tight tracking-tight mb-8 pb-4" style={{ borderBottom: "1px solid var(--gray-90)" }}>
                    Legal Mentions
                  </h2>

                  <div
                    className="p-6 rounded-xl mb-10"
                    style={{ background: "var(--gray-98)", border: "1px solid var(--gray-90)" }}
                  >
                    <h4 className="text-[12px] font-medium tracking-tight uppercase mb-4" style={{ color: "var(--primary-blue)" }}>
                      Publisher Information
                    </h4>
                    <ul className="space-y-2 text-[14px] leading-relaxed text-gray-30">
                      <li><strong className="text-gray-5">Company:</strong> NativeSquare SAS</li>
                      <li><strong className="text-gray-5">Head Office:</strong> 9 rue des Colonnes, 75002 Paris, France</li>
                      <li><strong className="text-gray-5">SIREN:</strong> 995 089 851</li>
                      <li><strong className="text-gray-5">SIRET (head office):</strong> 995 089 851 00019</li>
                      <li><strong className="text-gray-5">VAT:</strong> FR87995089851</li>
                      <li><strong className="text-gray-5">DUNS:</strong> 285767978</li>
                    </ul>
                  </div>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">1. Intellectual Property</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    The website and all its components (including but not limited to the logo, software, source code, texts, images, and videos) are the exclusive property of NativeSquare SAS. Any reproduction, representation, modification, or adaptation of all or part of the elements of the site is strictly prohibited without written authorization.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">2. Liability</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    NativeSquare SAS strives to provide accurate information on its website but cannot be held responsible for omissions, inaccuracies, or deficiencies in updates. The use of the information provided on the site is under the sole responsibility of the user.
                  </p>
                </section>
              )}

              {activeSection === "terms" && (
                <section>
                  <h2 className="font-title fs-32 font-medium leading-tight tracking-tight mb-8 pb-4" style={{ borderBottom: "1px solid var(--gray-90)" }}>
                    Terms of Service
                  </h2>
                  <p className="text-[13px] tracking-tight text-gray-40 italic mb-8 uppercase">Last Updated: December 2025</p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">1. Scope of Services</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    NativeSquare SAS provides custom software development, product strategy, UI/UX design, and consulting services. Each project is governed by a specific Master Services Agreement (MSA) and Statement of Work (SOW) which takes precedence over these general website terms.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">2. Transfer of Rights</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    Unless otherwise specified in a written contract, the intellectual property rights to the developments carried out for the client are transferred only upon full payment of the agreed fees. NativeSquare retains a non-exclusive license to showcase the work in its portfolio, unless a specific NDA is signed.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">3. Payment Terms</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    Standard payment terms involve a 50% deposit upon signature and 50% upon delivery of the project milestones, unless otherwise specified. Late payments may result in service suspension.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">4. Limitation of Liability</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    In no event shall NativeSquare SAS be liable for any indirect, incidental, consequential, or special damages. Our total liability for any claim arising out of or relating to the services shall not exceed the amount paid by the client for the specific service in question.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">5. Governing Law</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    These terms are governed by the laws of France. Any dispute relating to their interpretation and/or execution shall be subject to the exclusive jurisdiction of the courts of Paris.
                  </p>
                </section>
              )}

              {activeSection === "privacy" && (
                <section>
                  <h2 className="font-title fs-32 font-medium leading-tight tracking-tight mb-8 pb-4" style={{ borderBottom: "1px solid var(--gray-90)" }}>
                    Privacy Policy (GDPR)
                  </h2>
                  <p className="text-[13px] tracking-tight text-gray-40 italic mb-8 uppercase">Last Updated: December 2025</p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">1. Data Controller</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    NativeSquare SAS is the controller of the personal data collected through this website. We are committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR).
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">2. Data Collection Purpose</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30 mb-3">We collect data for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2 fs-15 leading-relaxed tracking-tight text-gray-30">
                    <li>Responding to inquiries via our contact forms.</li>
                    <li>Scheduling strategy calls and managing appointments.</li>
                    <li>Improving website performance and user experience through analytics.</li>
                    <li>Sending newsletters or updates (only with explicit consent).</li>
                  </ul>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">3. Your Rights</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30 mb-3">Under the GDPR, you have the following rights:</p>
                  <ul className="list-disc pl-6 space-y-2 fs-15 leading-relaxed tracking-tight text-gray-30">
                    <li><strong className="text-gray-5">Access:</strong> The right to request copies of your personal data.</li>
                    <li><strong className="text-gray-5">Rectification:</strong> The right to request that we correct inaccurate information.</li>
                    <li><strong className="text-gray-5">Erasure:</strong> The right to request that we erase your personal data.</li>
                    <li><strong className="text-gray-5">Portability:</strong> The right to request that we transfer your data to another organization.</li>
                  </ul>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30 mt-4">
                    To exercise these rights, please contact us at <strong className="text-gray-5">office@nativesquare.fr</strong>.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">4. Data Retention</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    We retain personal data only for as long as necessary to fulfill the purposes it was collected for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                  </p>
                </section>
              )}

              {activeSection === "cookies" && (
                <section>
                  <h2 className="font-title fs-32 font-medium leading-tight tracking-tight mb-8 pb-4" style={{ borderBottom: "1px solid var(--gray-90)" }}>
                    Cookie Policy
                  </h2>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">1. What are cookies?</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently.
                  </p>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">2. How we use cookies</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30 mb-3">We use the following types of cookies:</p>
                  <ul className="list-disc pl-6 space-y-2 fs-15 leading-relaxed tracking-tight text-gray-30">
                    <li><strong className="text-gray-5">Essential Cookies:</strong> Necessary for the website to function correctly.</li>
                    <li><strong className="text-gray-5">Analytics Cookies:</strong> Help us understand how visitors interact with the site.</li>
                    <li><strong className="text-gray-5">Functional Cookies:</strong> Remember your preferences and settings.</li>
                  </ul>

                  <h3 className="fs-20 font-medium leading-snug tracking-tight mt-8 mb-3">3. Managing Cookies</h3>
                  <p className="fs-15 leading-relaxed tracking-tight text-gray-30">
                    Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, but this may affect your experience on our website.
                  </p>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Legal;
