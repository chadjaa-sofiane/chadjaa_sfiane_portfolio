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
        description="hi there, here I can show you all my previeus works, and if you didn't like it, just through yourself in the closest hole"
      />
      <ProjectsHeroIllustration />
    </Section>
  );
};

export default ProjectsHero;
