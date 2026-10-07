import CardContextProvider from "./Card.context";
import ProjectDetailsModal from "./ProjectDetailsModal";
import CardImage from "./CardImage"
import CardContent from "./CardContent"
import CardFeaturedContent from "./CardFeaturedContent"
import { GalleryImage, ProjectArchitecture, ProjectMetric } from "./types";
import styles from "./Card.module.scss";

export interface cardProps {
  id: string
  title: string;
  body: string;
  imageSrc?: string;
  showImage?: boolean;
  isPrivate?: boolean;
  cardClassName?: string;
  link?: string;
  githubUrl?: string;
  kaggleUrl?:string;
  type?: string;
  description?: string;
  featured?: boolean;
  priority?: number;
  techStack?: string[];
  metrics?: ProjectMetric[];
  architecture?: ProjectArchitecture;
  gallery?: GalleryImage[];
  /** Client or product mark shown on the featured card. */
  logoSrc?: string;
  logoAlt?: string;
}

const Card = (props: cardProps) => {
  const isFeatured = !!props.featured;
  // Without a screenshot the sketched frame shows a placeholder for the
  // project type, so only an explicit opt-out (or privacy) drops the visual.
  const shouldShowImage = props.showImage !== false && !props.isPrivate;
  // The footprint modifier lives in this module, declared after --no-image and
  // --private, so the cascade is decided by source order in one file. Passing it
  // in through cardClassName would put two equal-specificity rules in separate
  // CSS module chunks and leave the winner up to chunk order.
  const wrapperClassName = [
    styles["card__wrapper"],
    props.isPrivate ? styles["card__wrapper--private"] : "",
    !shouldShowImage && !isFeatured ? styles["card__wrapper--no-image"] : "",
    isFeatured ? styles["card__wrapper--featured"] : "",
    props.cardClassName || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <CardContextProvider {...props}>
      <ProjectDetailsModal />
      <div className={wrapperClassName}>
        <span className={styles["card__outline"]} aria-hidden="true" />
        {isFeatured ? (
          <CardFeaturedContent />
        ) : (
          <>
            {shouldShowImage && <CardImage />}
            <CardContent />
          </>
        )}
      </div>
    </CardContextProvider>
  );
};

export default Card;
