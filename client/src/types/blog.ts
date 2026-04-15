export type BlogContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; content: string; level?: 2 | 3 | 4 }
  | { type: "list"; items: string[] }
  | { type: "separator" };

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  accent: string;
  summary: string;
  content: BlogContentBlock[];
};
