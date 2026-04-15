import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "plants-belong-in-every-home",
    title: "Why Plants Belong in Every Home",
    description:
      "Indoor plants improve mood, clean the air, and make a room feel more alive.",
    readTime: "5 min read",
    category: "Lifestyle",
    accent: "from-emerald-500 to-lime-400",
    summary:
      "A practical look at why greenery improves homes and how to start with low-maintenance plants.",
    content: [
      {
        type: "paragraph",
        content:
          "Plants are more than decoration. They soften hard spaces, improve focus, and help make a room feel calmer and more personal.",
      },
      { type: "separator" },
      {
        type: "heading",
        content: "Natural air and mood support",
        level: 3,
      },
      {
        type: "paragraph",
        content:
          "Indoor greenery can help reduce visual stress and makes homes feel healthier. That is why even one well-placed plant can change the tone of a room.",
      },
      {
        type: "list",
        items: [
          "Use easy plants like snake plant or pothos to start.",
          "Place plants near indirect light for faster growth.",
          "Choose pots with drainage to avoid root rot.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "low-light-plants-for-urban-living",
    title: "Low-Light Plants for Urban Living",
    description:
      "A compact shortlist of plants that thrive when your apartment does not get much sun.",
    readTime: "4 min read",
    category: "Care Guide",
    accent: "from-slate-700 to-emerald-600",
    summary:
      "Low-light spaces are not a dead end. Pick the right species and your home can still feel lush.",
    content: [
      {
        type: "paragraph",
        content:
          "North-facing windows, shaded corners, and dense city apartments can still support healthy plant growth if you match the plant to the light available.",
      },
      { type: "heading", content: "Good low-light choices", level: 3 },
      {
        type: "list",
        items: [
          "Snake Plant: resilient and drought tolerant.",
          "ZZ Plant: glossy foliage with low water needs.",
          "Peace Lily: forgiving and visually striking.",
        ],
      },
      { type: "separator" },
      {
        type: "paragraph",
        content:
          "Rotate the pot every week, keep watering light, and clean the leaves occasionally so the plant can use the available light efficiently.",
      },
    ],
  },
  {
    id: 3,
    slug: "choose-the-right-pot",
    title: "How to Choose the Right Pot for Your Plant",
    description:
      "Pot size, drainage, and material all affect how well your plant grows.",
    readTime: "6 min read",
    category: "Styling",
    accent: "from-amber-600 to-orange-400",
    summary:
      "This guide focuses on the practical side of pots, not just the visual side.",
    content: [
      {
        type: "paragraph",
        content:
          "A pot is part of the growing environment. The wrong pot traps water, limits root movement, and can slowly weaken an otherwise healthy plant.",
      },
      { type: "heading", content: "What to look for", level: 3 },
      {
        type: "list",
        items: [
          "Drainage holes are mandatory for most indoor plants.",
          "Terracotta dries faster and suits drought-friendly plants.",
          "Choose only a slightly larger pot when repotting.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "diy-plant-care-schedule",
    title: "DIY Plant Care Schedule",
    description:
      "Build a simple routine that keeps your plants healthy without becoming a full-time job.",
    readTime: "5 min read",
    category: "Routine",
    accent: "from-emerald-600 to-teal-400",
    summary:
      "Consistency matters more than complexity. A small weekly routine prevents most plant problems.",
    content: [
      {
        type: "paragraph",
        content:
          "Plant care becomes much easier when you repeat a few simple checks on schedule.",
      },
      { type: "heading", content: "Weekly and monthly habits", level: 3 },
      {
        type: "list",
        items: [
          "Weekly: inspect moisture, rotate the pot, and remove damaged leaves.",
          "Monthly: dust the leaves and check whether the plant is root bound.",
          "Seasonally: reduce watering when growth slows down.",
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "sustainable-gardening-with-plantworld",
    title: "Sustainable Gardening with PlantWorld",
    description:
      "Small choices in plant care can reduce waste and make gardening more sustainable.",
    readTime: "4 min read",
    category: "Sustainability",
    accent: "from-lime-500 to-emerald-500",
    summary: "A greener garden starts with better habits, not bigger budgets.",
    content: [
      {
        type: "paragraph",
        content:
          "Reuse pots, choose durable materials, and water only when the soil says the plant needs it. Sustainable care is usually simpler, not harder.",
      },
      {
        type: "list",
        items: [
          "Reuse nursery pots for propagation.",
          "Pick natural soil amendments.",
          "Avoid overfertilizing and overwatering.",
        ],
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
