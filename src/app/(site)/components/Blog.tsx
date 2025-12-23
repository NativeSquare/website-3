import Link from "next/link";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { posts } from "../data/content";

const Blog: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-bold font-geist text-gray-900 mb-4">
            Insights
          </h1>
          <p className="text-lg text-gray-600">
            Thoughts on engineering, design, and product strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, idx) => (
            <Link
              href={`/blog/${post.slug}`}
              key={idx}
              className="flex flex-col group cursor-pointer block"
            >
              <div className="relative overflow-hidden rounded-2xl mb-5 aspect-video bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                  {post.category}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </div>
              </div>
              <h2 className="text-xl font-bold font-geist text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform w-max">
                Read Article <ChevronRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

