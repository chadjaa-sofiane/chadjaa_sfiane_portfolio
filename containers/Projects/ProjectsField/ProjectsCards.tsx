import { Card } from "@components/Card";
import { Pagination } from "@components/core/Pagination";
import styles from "./ProjectsField.module.scss";

const ProjectsCards = () => {
  return (
    <div className={styles["projects__cards__field"]}>
      <Card
        title="sss"
        body=" this is the project description where I describe what the shit I have
          built here"
      />
      <Card
        title="sss"
        body=" this is the project description where I describe what the shit I have
          built here"
      />
      <Card
        title="sss"
        body=" this is the project description where I describe what the shit I have
          built here"
      />
      <Pagination count={3} />
    </div>
  );
};

export default ProjectsCards;
