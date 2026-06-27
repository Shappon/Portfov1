"use client";

import { useRouter } from "next/navigation";
import { SectionPageLayout } from "@/components/SectionPageLayout";
import { MePanel } from "@/components/panels/MePanel";

export default function MePage() {
  const router = useRouter();

  return (
    <SectionPageLayout title="Moi">
      <MePanel onViewProjects={() => router.push("/projects")} />
    </SectionPageLayout>
  );
}
