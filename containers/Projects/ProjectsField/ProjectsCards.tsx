import { Card } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { cardProps } from "@components/Card"
import { Title3 } from "@components/core/Typography";

const ProjectsCards = ({
  projects,
  showImages = true,
  emptyLabel = "No projects available yet",
  pinPrivate = false,
  highlightPrivate = false,
}: {
  projects: cardProps[];
  showImages?: boolean;
  emptyLabel?: string;
  pinPrivate?: boolean;
  highlightPrivate?: boolean;
}) => {
  const orderedProjects = pinPrivate
    ? [...projects].sort(
        (a, b) => (b.isPrivate ? 1 : 0) - (a.isPrivate ? 1 : 0)
      )
    : projects;
  return (
    <div className={styles["projects__cards__field"]}>
      {
        orderedProjects?.map((project: cardProps) => (
          <Card
            key={project.id}
            {...project}
            showImage={showImages}
            cardClassName={
              highlightPrivate && project.isPrivate
                ? styles["projects__card--wide"]
                : undefined
            }
          />
        ))
      }
      {(!projects || projects.length === 0) && <EmptyProjectsCards label={emptyLabel} />}
    </div>
  );
};

const EmptyProjectsCards = ({ label }: { label: string }) => {
  return (
    <div className={styles["projects__cards__empty"]}>
      <Title3> {label} </Title3>
    </div>
  );
}

export default ProjectsCards;
