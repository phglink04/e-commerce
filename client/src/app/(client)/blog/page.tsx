import BlogPostGrid from "@/components/client/blog-post-grid";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
  return (
    <section className="bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-success font-serif text-xl font-bold md:text-3xl lg:text-4xl">
            Blog
          </h1>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            Short, practical guides for plant care, styling, and sustainable
            gardening.
          </p>
        </div>

        <div className="mt-10">
          <BlogPostGrid posts={blogPosts} />
        </div>
      </div>
    </section>
  );
}
