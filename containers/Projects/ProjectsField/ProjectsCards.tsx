import { Card } from "@components/Card";
import { Pagination } from "@components/core/Pagination";
import styles from "./ProjectsField.module.scss";


const ProjectsCards = ({ projects }: any) => {
  return (
    <div className={styles["projects__cards__field"]}>
      {
        projects.map((project: any) => (<Card key={project.id} {...project} />)
        )}
      <Pagination count={3} />
    </div>
  );
};

export default ProjectsCards;