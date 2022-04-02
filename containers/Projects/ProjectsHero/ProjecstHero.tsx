import {
  Section,
  SectionContent,
  SectionIllustration,
} from "@components/Section";
import ProjectsIllustrationSvg from "@svg/projects_illustration.svg";

const ProjectsHero = () => {
  return (
    <Section variant="dark">
      <SectionContent
        title="My Projects"
        description="hi there, here I can show you all my previeus works, and if you didn't like it, just through yourself in the closest hole"
      />
      <SectionIllustration>
        <ProjectsIllustrationSvg />
      </SectionIllustration>
    </Section>
  );
};

export default ProjectsHero;
