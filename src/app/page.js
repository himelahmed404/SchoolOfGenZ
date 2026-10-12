import { getBatches, getSkills } from "@/lib/api";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "School of GenZ — স্কুল অব জেনজি",
  description:
    "ডিপ্লোমা সেমিস্টার হোক বা Spoken English — ক্লাস, নোট আর প্র্যাকটিস, সব এক জায়গায়।",
};

export default async function HomePage() {
  const [batches, skills] = await Promise.all([getBatches(), getSkills()]);
  return <HomeClient batches={batches} skills={skills} />;
}
