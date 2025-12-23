import { notFound } from "next/navigation";
import BlogPost from "../../components/BlogPost";
import { posts } from "../../data/content";

type Params = {
  slug: string;
};

export default function BlogPostPage({ params }: { params: Params }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}

