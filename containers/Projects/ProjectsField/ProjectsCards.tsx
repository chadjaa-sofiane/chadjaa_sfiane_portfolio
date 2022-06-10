import { Card } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { cardProps } from "@components/Card"
import { Title3 } from "@components/core/Typography";


const ProjectsCards = ({ projects }: { projects: cardProps[] }) => {
  return (
    <div className={styles["projects__cards__field"]}>
      {
        projects?.map((project: cardProps) => (<Card key={project.id} {...project} />))
      }
      {projects.length === 0 && <EmptyProjectsCards />}
    </div>
  );
};

const EmptyProjectsCards = () => {
  return (
    <div className={styles["projects__cards__empty"]}>
      <Title3> No projects available yet </Title3>
    </div>
  );
}

export default ProjectsCards;