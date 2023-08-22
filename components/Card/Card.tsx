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
  link?: string;
  githubUrl?: string;
  kaggleUrl?:string;
  type?: string;
  description?: string;
}

const Card = (props: cardProps) => {
  return (
    <CardContextProvider {...props}>
      <ProjectDetailsModal />
      <div className={styles["card__wrapper"]}>
        <CardImage />
        <CardContent />
      </div>
    </CardContextProvider>
  );
};

export default Card;
