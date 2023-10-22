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
        description="Discover my personal projects and experiments, where innovation knows no boundaries."
      />
      <ProjectsHeroIllustration />
    </Section>
  );
};

export default ProjectsHero;
