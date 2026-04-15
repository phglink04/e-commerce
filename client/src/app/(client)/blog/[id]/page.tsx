import { notFound } from "next/navigation";
import BlogArticle from "@/components/client/blog-article";
import { getBlogPostBySlug } from "@/lib/blog";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getBlogPostBySlug(id);

  if (!post) {
    notFound();
  }

  return (
    <section className="bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(180deg,_#fbfffd_0%,_#eefcf5_100%)] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl">
        <BlogArticle post={post} />
      </div>
    </section>
  );
}
