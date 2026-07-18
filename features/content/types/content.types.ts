/**
 * Content Types
 * TypeScript type definitions for static content features (blog, FAQ, contact).
 */

/** Blog post from the database */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Contact form submission */
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** FAQ item (static, not from DB) */
export interface FAQItem {
  question: string;
  answer: string;
}
