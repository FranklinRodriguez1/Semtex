import { redirect } from "next/navigation";

export default function Home() {
  redirect("/view/loginy");

import { Home } from '@/components/home/Home';
export default function RootPage() {
  return <Home />;
}
