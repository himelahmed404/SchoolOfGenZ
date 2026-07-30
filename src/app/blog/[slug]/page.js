import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/blog";
import BlogArticleClient from "./BlogArticleClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | School of GenZ`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <BlogArticleClient post={post} />;
}
