import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Project } from "../data/content";

type Props = {
  project: Project;
};

const ProjectDetail = ({ project }: Props) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end pb-12 px-4">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Projects
            </Link>
            <div className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
              {project.category}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-geist text-white mb-4">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 font-geist">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 font-geist">
                Client
              </h3>
              <p className="text-gray-600">Confidential Enterprise Client</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 font-geist">
                Timeline
              </h3>
              <p className="text-gray-600">4 Months</p>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-white bg-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors shadow-lg"
            >
              Visit Live Site <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="lg:col-span-2 prose prose-lg prose-indigo text-gray-600 font-geist">
            <h2 className="text-3xl font-bold text-gray-900 font-geist mb-6">The Challenge</h2>
            <p className="mb-8 leading-relaxed">
              {project.description} The client approached us with a legacy codebase that was
              struggling to scale. User latency was high, and the mobile experience was
              non-existent. Our goal was to modernize the stack while maintaining 100% data
              integrity during migration.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 font-geist mb-6">Our Solution</h2>
            <p className="mb-6 leading-relaxed">
              We architected a solution using cloud-native principles. By breaking down the
              monolith into microservices, we improved deployment velocity and isolated failure
              points.
            </p>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 my-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-geist">Key Outcomes</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                  <span>Reduced server response time by 60%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                  <span>Increased daily active users to 25k+</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                  <span>Zero downtime deployment pipeline</span>
                </li>
              </ul>
            </div>

            <p className="leading-relaxed">
              The result is a platform that is not only faster but also easier for the internal
              team to maintain. We continue to support the client with feature updates and
              infrastructure monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

