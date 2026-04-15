import Link from "next/link";
import type { JSX } from "react";
import type { BlogPost } from "@/types/blog";

interface BlogArticleProps {
  post: BlogPost;
}

export default function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-10">
      <div className={`h-2 rounded-full bg-gradient-to-r ${post.accent}`} />
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span>{post.category}</span>
        <span>•</span>
        <span>{post.readTime}</span>
      </div>
      <h1 className="mt-4 text-3xl font-black text-slate-900 md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        {post.summary}
      </p>

      <div className="prose prose-slate mt-10 max-w-none prose-h3:text-2xl prose-h3:font-black prose-h3:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">
        {post.content.map((block, index) => {
          if (block.type === "paragraph") {
            return <p key={index}>{block.content}</p>;
          }

          if (block.type === "heading") {
            const HeadingTag =
              `h${block.level || 3}` as keyof JSX.IntrinsicElements;
            return <HeadingTag key={index}>{block.content}</HeadingTag>;
          }

          if (block.type === "list") {
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }

          return <hr key={index} className="my-8 border-slate-200" />;
        })}
      </div>

      <div className="mt-10">
        <Link
          href="/blog"
          className="text-sm font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4"
        >
          Back to all blogs
        </Link>
      </div>
    </article>
  );
}
