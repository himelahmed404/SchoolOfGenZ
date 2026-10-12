import { notFound } from "next/navigation";
import { getBatch, getSite } from "@/lib/api";
import BatchDetailClient from "./BatchDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const batch = await getBatch(slug);
  if (!batch) return {};
  return {
    title: `${batch.title} | School of GenZ`,
    description: batch.tagline || batch.counts,
  };
}

export default async function BatchDetailPage({ params }) {
  const { slug } = await params;
  const batch = await getBatch(slug);
  if (!batch) notFound();
  return <BatchDetailClient batch={batch} site={await getSite()} />;
}
