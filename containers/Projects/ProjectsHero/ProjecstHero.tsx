import {
  Section,
  SectionContent,
} from "@components/Section";
import { useEffect } from "react";

import ProjectsHeroIllustration from "./ProjectsHeroIllustration"

const ProjectsHero = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  return (
    <Section variant="dark">
      <SectionContent
        title="My Projects"
        description="here when you can find my projects, my experiemets, and anything new I&apos;ve learned."
      />
      <ProjectsHeroIllustration />
    </Section>
  );
};

export default ProjectsHero;
