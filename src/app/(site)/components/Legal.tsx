"use client";

import { useState } from "react";
import {
  Shield,
  FileText,
  Scale,
  Lock,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  Building,
} from "lucide-react";

const Legal: React.FC = () => {
  const [activeSection, setActiveSection] = useState("mentions");

  const sections = [
    { id: "mentions", label: "Legal Mentions", icon: Building },
    { id: "terms", label: "Terms of Service", icon: Scale },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "cookies", label: "Cookie Policy", icon: Shield },
  ];

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen font-geist">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Center
          </h1>
          <p className="text-gray-600 max-w-2xl">
            At NativeSquare, we value transparency and trust. Here you will find
            all the legal documents governing our relationship and the
            protection of your data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-8">
              <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeSection === section.id
                        ? "bg-indigo-50 text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <section.icon
                      className={`w-4 h-4 ${
                        activeSection === section.id
                          ? "text-indigo-600"
                          : "text-gray-400"
                      }`}
                    />
                    {section.label}
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Contact Legal Team
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  For any questions regarding our terms or your data rights:
                </p>
                <a
                  href="mailto:admin@nativesquare.fr"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
                >
                  admin@nativesquare.fr
                </a>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-9">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm prose prose-indigo max-w-none prose-headings:font-geist prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
              {activeSection === "mentions" && (
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-3xl text-gray-900 mb-8 border-b border-gray-100 pb-4">
                    Legal Mentions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                        Publisher Information
                      </h4>
                      <ul className="list-none p-0 m-0 space-y-2 text-sm">
                        <li className="flex gap-2">
                          <strong>Company:</strong> NativeSquare SAS
                        </li>
                        <li className="flex gap-2">
                          <strong>Head Office:</strong> 9 rue des Colonnes,
                          75002 Paris, France
                        </li>
                        <li className="flex gap-2">
                          <strong>SIRET:</strong> 989 179 205 R.C.S. Paris
                        </li>
                        <li className="flex gap-2">
                          <strong>VAT:</strong> FR40989179205
                        </li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl text-gray-900">
                    1. Intellectual Property
                  </h3>
                  <p>
                    The website and all its components (including but not
                    limited to the logo, software, source code, texts, images,
                    and videos) are the exclusive property of NativeSquare SAS.
                    Any reproduction, representation, modification, or
                    adaptation of all or part of the elements of the site is
                    strictly prohibited without written authorization.
                  </p>

                  <h3 className="text-xl text-gray-900">2. Liability</h3>
                  <p>
                    NativeSquare SAS strives to provide accurate information on
                    its website but cannot be held responsible for omissions,
                    inaccuracies, or deficiencies in updates. The use of the
                    information provided on the site is under the sole
                    responsibility of the user.
                  </p>
                </section>
              )}

              {activeSection === "terms" && (
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-3xl text-gray-900 mb-8 border-b border-gray-100 pb-4">
                    Terms of Service
                  </h2>
                  <p className="text-sm text-gray-400 italic mb-8 uppercase tracking-wide">
                    Last Updated: December 2025
                  </p>

                  <h3 className="text-xl text-gray-900">
                    1. Scope of Services
                  </h3>
                  <p>
                    NativeSquare SAS provides custom software development,
                    product strategy, UI/UX design, and consulting services.
                    Each project is governed by a specific Master Services
                    Agreement (MSA) and Statement of Work (SOW) which takes
                    precedence over these general website terms.
                  </p>

                  <h3 className="text-xl text-gray-900">
                    2. Transfer of Rights
                  </h3>
                  <p>
                    Unless otherwise specified in a written contract, the
                    intellectual property rights to the developments carried out
                    for the client are transferred only upon full payment of the
                    agreed fees. NativeSquare retains a non-exclusive license to
                    showcase the work in its portfolio, unless a specific NDA is
                    signed.
                  </p>

                  <h3 className="text-xl text-gray-900">3. Payment Terms</h3>
                  <p>
                    Standard payment terms involve a 50% deposit upon signature
                    and 50% upon delivery of the project milestones, unless
                    otherwise specified. Late payments may result in service
                    suspension.
                  </p>

                  <h3 className="text-xl text-gray-900">
                    4. Limitation of Liability
                  </h3>
                  <p>
                    In no event shall NativeSquare SAS be liable for any
                    indirect, incidental, consequential, or special damages. Our
                    total liability for any claim arising out of or relating to
                    the services shall not exceed the amount paid by the client
                    for the specific service in question.
                  </p>

                  <h3 className="text-xl text-gray-900">5. Governing Law</h3>
                  <p>
                    These terms are governed by the laws of France. Any dispute
                    relating to their interpretation and/or execution shall be
                    subject to the exclusive jurisdiction of the courts of Paris
                    (or the city of registration).
                  </p>
                </section>
              )}

              {activeSection === "privacy" && (
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-3xl text-gray-900 mb-8 border-b border-gray-100 pb-4">
                    Privacy Policy (GDPR)
                  </h2>
                  <p className="text-sm text-gray-400 italic mb-8 uppercase tracking-wide">
                    Last Updated: December 2025
                  </p>

                  <h3 className="text-xl text-gray-900">1. Data Controller</h3>
                  <p>
                    NativeSquare SAS is the controller of the personal data
                    collected through this website. We are committed to
                    protecting your privacy in accordance with the General Data
                    Protection Regulation (GDPR).
                  </p>

                  <h3 className="text-xl text-gray-900">
                    2. Data Collection Purpose
                  </h3>
                  <p>We collect data for the following purposes:</p>
                  <ul>
                    <li>Responding to inquiries via our contact forms.</li>
                    <li>
                      Scheduling strategy calls and managing appointments.
                    </li>
                    <li>
                      Improving website performance and user experience through
                      analytics.
                    </li>
                    <li>
                      Sending newsletters or updates (only with explicit
                      consent).
                    </li>
                  </ul>

                  <h3 className="text-xl text-gray-900">3. Your Rights</h3>
                  <p>
                    Under the GDPR, you have the following rights regarding your
                    personal data:
                  </p>
                  <ul>
                    <li>
                      <strong>Access:</strong> The right to request copies of
                      your personal data.
                    </li>
                    <li>
                      <strong>Rectification:</strong> The right to request that
                      we correct inaccurate information.
                    </li>
                    <li>
                      <strong>Erasure:</strong> The right to request that we
                      erase your personal data.
                    </li>
                    <li>
                      <strong>Portability:</strong> The right to request that we
                      transfer your data to another organization.
                    </li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at{" "}
                    <strong>admin@nativesquare.fr</strong>.
                  </p>

                  <h3 className="text-xl text-gray-900">4. Data Retention</h3>
                  <p>
                    We retain personal data only for as long as necessary to
                    fulfill the purposes it was collected for, including for the
                    purposes of satisfying any legal, accounting, or reporting
                    requirements.
                  </p>
                </section>
              )}

              {activeSection === "cookies" && (
                <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-3xl text-gray-900 mb-8 border-b border-gray-100 pb-4">
                    Cookie Policy
                  </h2>

                  <h3 className="text-xl text-gray-900">
                    1. What are cookies?
                  </h3>
                  <p>
                    Cookies are small text files that are stored on your
                    computer or mobile device when you visit a website. They are
                    widely used to make websites work or work more efficiently.
                  </p>

                  <h3 className="text-xl text-gray-900">
                    2. How we use cookies
                  </h3>
                  <p>We use the following types of cookies:</p>
                  <ul>
                    <li>
                      <strong>Essential Cookies:</strong> Necessary for the
                      website to function correctly.
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how
                      visitors interact with the site (e.g., Google Analytics).
                    </li>
                    <li>
                      <strong>Functional Cookies:</strong> Remember your
                      preferences and settings.
                    </li>
                  </ul>

                  <h3 className="text-xl text-gray-900">3. Managing Cookies</h3>
                  <p>
                    Most web browsers allow you to control cookies through their
                    settings. You can choose to block or delete cookies, but
                    this may affect your experience on our website.
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
