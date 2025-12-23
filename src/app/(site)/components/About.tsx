import { Award, Heart, Target, Users } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-geist text-gray-900 mb-6">
          We are <span className="text-indigo-600">NativeSquare</span>.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A collective of engineers, designers, and strategists obsessed with
          building software that matters. We don&apos;t just write code; we
          solve business problems.
        </p>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Precision
              </h3>
              <p className="text-gray-600 text-sm">
                We believe in pixel-perfect implementation and robust
                architecture.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600 text-sm">
                We work as an extension of your team, not just a vendor.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-4 text-fuchsia-600">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Passion
              </h3>
              <p className="text-gray-600 text-sm">
                We love what we do, and it shows in the quality of our work.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Excellence
              </h3>
              <p className="text-gray-600 text-sm">
                We don&apos;t settle for &quot;good enough&quot;. We aim for
                world-class.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold font-geist text-gray-900 mb-12 text-center">
          Meet the Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
              alt="CEO"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-bold font-geist">
                James Carter
              </h3>
              <p className="text-gray-300">Technical Director</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
              alt="CTO"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-bold font-geist">
                Sarah Lin
              </h3>
              <p className="text-gray-300">Head of Design</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
              alt="Lead Dev"
              className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-bold font-geist">
                Marcus Reid
              </h3>
              <p className="text-gray-300">Lead Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

