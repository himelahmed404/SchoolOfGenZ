import { getBatches, getFaqs } from "@/lib/api";
import AcademicClient from "./AcademicClient";

export const metadata = {
  title: "ডিপ্লোমা সেমিস্টার ব্যাচ | School of GenZ",
  description:
    "তোমার ডিপার্টমেন্ট আর সেমিস্টার বেছে নাও — পুরো সিলেবাস কভার, বোর্ড প্রশ্নের ধাঁচে প্র্যাকটিস।",
};

export default async function AcademicPage() {
  const [batches, faqs] = await Promise.all([getBatches(), getFaqs("diploma")]);
  return <AcademicClient batches={batches} faqs={faqs} />;
}
