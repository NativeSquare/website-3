import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import type { Post } from "../data/content";

type Props = {
  post: Post;
};

const BlogPost = ({ post }: Props) => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Insights
        </Link>

        <div className="mb-8">
          <div className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            {post.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-geist text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>NativeSquare Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden mb-10 bg-gray-100 aspect-video shadow-sm">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div
          className="prose prose-lg prose-indigo text-gray-600 font-geist max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        ></div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-geist">
            Want to build something similar?
          </h3>
          <p className="text-gray-600 mb-6">
            Let&apos;s discuss how we can apply these insights to your next project.
          </p>
          <Link
            href="https://calendar.app.google/BFYre7dXNFCy6GfT6"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-black transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

