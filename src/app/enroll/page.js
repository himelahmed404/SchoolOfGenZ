import { getBatch, getSite, getSkill } from "@/lib/api";
import EnrollClient from "./EnrollClient";

export const metadata = {
  title: "ভর্তি ফর্ম | School of GenZ",
  description: "কয়েকটা ধাপে ভর্তি সম্পন্ন করো — bKash/Nagad পেমেন্ট, TrxID নিশ্চিতকরণ।",
};

export default async function EnrollPage({ searchParams }) {
  const { type, slug } = await searchParams;
  const kind = type === "skill" ? "skill" : type === "batch" ? "batch" : null;
  const [found, site] = await Promise.all([
    kind && typeof slug === "string" ? (kind === "skill" ? getSkill(slug) : getBatch(slug)) : null,
    getSite(),
  ]);
  // The form needs a few facts about what is being bought, not its whole sales page.
  const item = found && {
    kind,
    title: found.title,
    dept: found.dept || "",
    program: found.program,
    batch: found.batchCode,
    priceNum: found.priceNum,
    oldNum: found.oldNum,
  };
  return <EnrollClient item={item} site={site} />;
}
