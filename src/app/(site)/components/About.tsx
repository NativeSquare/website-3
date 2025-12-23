import { Award, Heart, Target, Users } from "lucide-react";
import FAQ from "./FAQ";
import CTA from "./CTA";

const About: React.FC = () => {
  return (
    <div className="pt-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-geist tracking-tighter text-gray-900 mb-8">
          We are <span className="text-indigo-600">NativeSquare</span>.
        </h1>
        <div className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed space-y-6">
          <p>
            NativeSquare was born from a simple observation: most businesses
            struggle not because of a lack of ideas, but because of the gap
            between a vision and a market-ready product.
          </p>
          <p>
            We are a team of product-minded engineers and designers who have
            spent years building, launching, and scaling our own applications.
            Today, our internal studio manages a portfolio of apps serving over
            25,000 paying users globally.
          </p>
          <p>
            This hands-on experience is what we bring to our clients. We
            don&apos;t just build software; we build revenue-generating assets.
            From your initial strategy to your technical infrastructure and
            sales funnels, we handle the complexity so you can focus on leading
            your business.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Results-Driven
              </h3>
              <p className="text-gray-600 text-sm">
                Every decision we make is focused on driving your business
                forward and maximizing ROI.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                True Partnership
              </h3>
              <p className="text-gray-600 text-sm">
                Your success is our success. We&apos;re invested in your growth
                and work as an extension of your business.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-fuchsia-50 rounded-xl flex items-center justify-center mb-4 text-fuchsia-600">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                Customer-Centric
              </h3>
              <p className="text-gray-600 text-sm">
                We build products people love to use. Beautiful design and
                intuitive experiences are at our core.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold font-geist text-gray-900 mb-2">
                End-to-End
              </h3>
              <p className="text-gray-600 text-sm">
                From initial concept to market launch and beyond, we handle
                every aspect of bringing your product to life.
              </p>
            </div>
          </div>
        </div>
      </div>

      <FAQ />
      <CTA />
    </div>
  );
};

export default About;
