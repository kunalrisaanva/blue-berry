import { Suspense } from "react";
import HomePageClient from "./HomePageClient"; // adjust path if needed

export default function Page() {
  return (
    <Suspense fallback={<div>Loading homepage...</div>}>
      <HomePageClient />
    </Suspense>
  );
}
