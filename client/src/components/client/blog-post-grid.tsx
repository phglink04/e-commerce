import Link from "next/link";
import type { BlogPost } from "@/types/blog";

interface BlogPostGridProps {
  posts: BlogPost[];
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-emerald-200"
        >
          <div className={`h-2 rounded-full bg-gradient-to-r ${post.accent}`} />
          <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            <span>{post.category}</span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="mt-3 text-xl font-black text-slate-900">
            {post.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {post.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-emerald-700">
              {post.summary}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Read
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
