import { AnchorButton } from "@components/core/Button";
import { Title3, Paragraph, Title4 } from "@components/core/Typography";
import ArchitectureMap from "@components/DataViz/ArchitectureMap";
import StatTiles from "@components/DataViz/StatTiles";
import CardGallery from "./CardGallery";
import { useCardContext } from "./Card.context";
import GithubIcon from "@svg/github.svg";
import KaggleIcon from "@svg/kaggle.svg";
import styles from "./Card.module.scss";
import dynamic from "next/dynamic";

const Modal = dynamic(
  async () => {
    const { Modal } = await import("@components/core/Modal");
    return Modal;
  },
  {
    ssr: false,
  },
);

const ProjectDetailsModal = () => {
  const {
    isOpen,
    handleOpen,
    title,
    link,
    githubUrl,
    kaggleUrl,
    description,
    isPrivate,
    featured,
    id,
    metrics,
    architecture,
    gallery,
    techStack,
  } = useCardContext();
  const content = description;
  return (
    <Modal isOpen={isOpen} setOpen={handleOpen}>
      <div className={styles["card__modal__header"]}>
        <Title3> {title} </Title3>
      </div>
      <div className={styles["card__modal__container"]}>
        <Paragraph>{content || "no description"}</Paragraph>

        {/* The card is the trailer; the modal is where the substance lives, so
            the full set is shown here rather than the card's single figure. */}
        {featured ? (
          <>
            <StatTiles metrics={metrics} />
            {architecture ? (
              <ArchitectureMap architecture={architecture} instanceId={`modal-${id}`} />
            ) : null}
            <CardGallery gallery={gallery} />
            {!!techStack?.length && (
              <ul className={styles["card__stack"]} aria-label="Built with">
                {techStack.map((tech) => (
                  <li key={tech} className={styles["card__stack__item"]}>{tech}</li>
                ))}
              </ul>
            )}
          </>
        ) : null}

        {(githubUrl || kaggleUrl) && <Title4> Source code : </Title4>}
        <div>
          {githubUrl && <GitHubIconButton url={githubUrl} />}
          {kaggleUrl && <KaggleIconButton url={kaggleUrl} />}
        </div>
        <div className={styles["card__modal__buttonsField"]}>
          {isPrivate && (
            <AnchorButton
              role="button"
              href="mailto:chadjaasofiane@gmail.com"
            >
              Let&apos;s talk
            </AnchorButton>
          )}
          {!isPrivate && link && (
            <AnchorButton
              role="button"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </AnchorButton>
          )}
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
const KaggleIconButton = ({ url }: { url: string }) => {
  return (
    <div className={styles["card__modal__githubIcon"]}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <KaggleIcon />
      </a>
    </div>
  );
};

export default ProjectDetailsModal;
