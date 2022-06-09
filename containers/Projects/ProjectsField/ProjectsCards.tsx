import { Card } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { cardProps } from "@components/Card"


const ProjectsCards = ({ projects }: { projects: cardProps[] }) => {
  return (
    <div className={styles["projects__cards__field"]}>
      {
        projects?.map((project: cardProps) => (<Card key={project.id} {...project} />))
      }
    </div>
  );
};

export default ProjectsCards;