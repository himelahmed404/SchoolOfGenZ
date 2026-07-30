import { notFound } from "next/navigation";
import { getSkillBySlug } from "@/lib/data/skills";
import SkillDetailClient from "./SkillDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  return {
    title: `${skill.title} | School of GenZ`,
    description: skill.pitch,
  };
}

export default async function SkillDetailPage({ params }) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();
  return <SkillDetailClient skill={skill} />;
}
