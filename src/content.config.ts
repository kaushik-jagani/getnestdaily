import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    id: z.string().optional(), // Will use slug as primary ID, but keeping for legacy
    title: z.string(),
    category: z.string(),
    date: z.string(),
    author: z.string(),
    image: z.string(),
    featured: z.boolean().optional().default(false),
    reading_time: z.string().optional(),
    tags: z.array(z.string()).optional(),
    meta_description: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })
});

export const collections = {
  'posts': postsCollection,
};
