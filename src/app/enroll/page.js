import { Suspense } from "react";
import EnrollClient from "./EnrollClient";

export const metadata = {
  title: "ভর্তি ফর্ম | School of GenZ",
  description: "কয়েকটা ধাপে ভর্তি সম্পন্ন করো — bKash/Nagad পেমেন্ট, TrxID নিশ্চিতকরণ।",
};

export default function EnrollPage() {
  return (
    <Suspense fallback={null}>
      <EnrollClient />
    </Suspense>
  );
}
