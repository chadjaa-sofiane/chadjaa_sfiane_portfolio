import CardContextProvider from "./Card.context";
import ProjectDetailsModal from "./ProjectDetailsModal";
import CardImage from "./CardImage"
import CardContent from "./CardContent"
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
}

const Card = (props: cardProps) => {
  const shouldShowImage =
    props.showImage !== false && !!props.imageSrc && !props.isPrivate;
  const wrapperClassName = `${styles["card__wrapper"]} ${
    props.isPrivate ? styles["card__wrapper--private"] : ""
  } ${!shouldShowImage ? styles["card__wrapper--no-image"] : ""} ${
    props.cardClassName || ""
  }`;
  return (
    <CardContextProvider {...props}>
      <ProjectDetailsModal />
      <div className={wrapperClassName}>
        {shouldShowImage && <CardImage />}
        <CardContent />
      </div>
    </CardContextProvider>
  );
};

export default Card;
