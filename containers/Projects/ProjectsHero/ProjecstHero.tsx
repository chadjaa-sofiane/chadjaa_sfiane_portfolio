import {
  Section,
  SectionContent,
} from "@components/Section";

import ProjectsHeroIllustration from "./ProjectsHeroIllustration"

const ProjectsHero = () => {
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
