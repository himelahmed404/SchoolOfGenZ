import { getFaqs, getSkills } from "@/lib/api";
import SkillsClient from "./SkillsClient";

export const metadata = {
  title: "স্কিল কোর্স | School of GenZ",
  description:
    "ইংরেজি বলা, উপস্থাপনা আর IELTS — ধাপে ধাপে, বাংলায়। প্রতিটাতে লাইফটাইম অ্যাক্সেস আর সার্টিফিকেট।",
};

export default async function SkillsPage() {
  const [skills, faqs] = await Promise.all([getSkills(), getFaqs("single")]);
  return <SkillsClient skills={skills} faqs={faqs} />;
}
