"use client";

import { SectionPageLayout } from "@/components/SectionPageLayout";
import { ProjectsPanel } from "@/components/panels/ProjectsPanel";

export default function ProjectsPage() {
  return (
    <SectionPageLayout title="Explorer mes projets">
      <ProjectsPanel />
    </SectionPageLayout>
  );
}
