import Image from "next/image";
import { Paragraph, Title4 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import { useCardContext } from "./Card.context";
import featured from "./CardFeaturedContent.module.scss";

/**
 * The featured project as a wide, quiet card: title, one line of context and
 * the details button, with the client's mark on the right. Figures, diagrams and the stack live in the modal.
 */
const CardFeaturedContent = () => {
  const { title, body, logoSrc, logoAlt, handleOpen } = useCardContext();

  return (
    <div className={featured.feature}>
      <div className={featured.text}>
        <div className={featured.title}>
          <Title4>{title}</Title4>
          <span className={featured.scribble} aria-hidden="true" />
        </div>
        <Paragraph>{body}</Paragraph>
        <Button variant="outlined" onClick={() => handleOpen(true)} className={featured.detailsButton}>
          view details
        </Button>
      </div>
      {logoSrc && (
        <Image className={featured.logo} src={logoSrc} alt={logoAlt ?? ""} width={1024} height={324}
          sizes="(max-width: 50rem) 60vw, 320px" />
      )}
    </div>
  );
};

export default CardFeaturedContent;
