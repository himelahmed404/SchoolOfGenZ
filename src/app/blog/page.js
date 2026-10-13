import { getPosts } from "@/lib/api";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "ব্লগ ও নোট | School of GenZ",
  description:
    "সাজেশন, বিটিইবি আপডেট, ক্যারিয়ার গাইড আর ইংরেজি শেখার টিপস — নিয়মিত নতুন লেখা, তোমার ভাষায়।",
};

export default async function BlogPage() {
  return <BlogClient posts={await getPosts()} />;
}
