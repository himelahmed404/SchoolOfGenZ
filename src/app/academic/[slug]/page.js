import { notFound } from "next/navigation";
import { getBatchBySlug } from "@/lib/data/batches";
import BatchDetailClient from "./BatchDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const batch = getBatchBySlug(slug);
  if (!batch) return {};
  return {
    title: `${batch.title} | School of GenZ`,
    description: batch.tagline || batch.counts,
  };
}

export default async function BatchDetailPage({ params }) {
  const { slug } = await params;
  const batch = getBatchBySlug(slug);
  if (!batch) notFound();
  return <BatchDetailClient batch={batch} />;
}
