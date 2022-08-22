import { AnchorButton } from "@components/core/Button";
import { Modal } from "@components/core/Modal";
import { Title3, Paragraph, Title4 } from "@components/core/Typography";
import { useCardContext } from "./Card.context";
import GithubIcon from "@svg/github.svg";
import styles from "./Card.module.scss";

const ProjectDetailsModal = () => {
  const { isOpen, handleOpen, title, link, githubUrl, description } =
    useCardContext();
  return (
    <Modal isOpen={isOpen} setOpen={handleOpen}>
      <div className={styles["card__modal__header"]}>
        <Title3> {title} </Title3>
      </div>
      <div className={styles["card__modal__container"]}>
        <Paragraph>{description || "no description"}</Paragraph>
        {githubUrl && <Title4> Source code : </Title4>}
        <div>{githubUrl && <GitHubIconButton url={githubUrl} />}</div>
        <div className={styles["card__modal__buttonsField"]}>
          <AnchorButton
            role="button"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project
          </AnchorButton>
        </div>
      </div>
    </Modal>
  );
};

const GitHubIconButton = ({ url }: { url: string }) => {
  return (
    <div className={styles["card__modal__githubIcon"]}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <GithubIcon />
      </a>
    </div>
  );
};

export default ProjectDetailsModal;
