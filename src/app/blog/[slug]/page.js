import { notFound } from "next/navigation";
import { getBatches, getPost, getPosts, getSkills } from "@/lib/api";
import { ctaOf, relatedTo } from "@/lib/site-data";
import BlogArticleClient from "./BlogArticleClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | School of GenZ`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const [posts, batches, skills] = await Promise.all([getPosts(), getBatches(), getSkills()]);
  return <BlogArticleClient post={post} related={relatedTo(post, posts)} cta={ctaOf(post, batches, skills)} />;
}
