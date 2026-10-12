import { notFound } from "next/navigation";
import { getSite, getSkill } from "@/lib/api";
import SkillDetailClient from "./SkillDetailClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const skill = await getSkill(slug);
  if (!skill) return {};
  return {
    title: `${skill.title} | School of GenZ`,
    description: skill.pitch || skill.tagline,
  };
}

export default async function SkillDetailPage({ params }) {
  const { slug } = await params;
  const skill = await getSkill(slug);
  if (!skill) notFound();
  return <SkillDetailClient skill={skill} site={await getSite()} />;
}
