import Image from "next/image";
import { GalleryImage } from "./types";
import styles from "./Card.module.scss";

/**
 * Built-in figures used until the studio has real imagery. The swap is content
 * only: the moment `gallery` has one entry, these disappear. No code change,
 * no deploy — which is what makes "redacted screenshots later" a content task.
 */
// Hand-drawn in Excalidraw by scripts/export-architecture.cjs (bun run diagrams).
const FALLBACK = [
  {
    id: "permission-model",
    size: [780, 250],
    alt: "User has a role, a role grants permissions, a permission applies to a resource.",
    caption:
      "Role and permission model: access is resolved through permissions, never granted directly to a user.",
  },
  {
    id: "device-sync",
    size: [780, 210],
    alt: "Devices publish telemetry through the broker to the service; commands flow back the same way.",
    caption:
      "Device control path: telemetry flows up through the broker, commands travel back asynchronously.",
  },
];

interface Props {
  gallery?: GalleryImage[];
  /** Cap the number of figures. The card shows one; the modal shows all. */
  limit?: number;
}

const CardGallery = ({ gallery, limit }: Props) => {
  const authored = (gallery ?? []).filter((item) => item && item.src);

  if (authored.length > 0) {
    const items = limit ? authored.slice(0, limit) : authored;
    return (
      <div className={styles["card__gallery"]}>
        {items.map((item) => (
          <figure key={item.src} className={styles["card__figure"]}>
            <div className={styles["card__figure__frame"]}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 45rem) 100vw, 560px"
              />
            </div>
            {item.caption ? (
              <figcaption className={styles["card__figure__caption"]}>
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    );
  }

  const diagrams = limit ? FALLBACK.slice(0, limit) : FALLBACK;
  return (
    <div className={styles["card__gallery"]}>
      {diagrams.map(({ id, size: [width, height], alt, caption }) => (
        <figure key={id} className={styles["card__figure"]}>
          <picture className={styles["card__drawing"]}>
            <source media="(max-width: 45rem)" srcSet={`/diagrams/${id}-mobile.svg`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/diagrams/${id}.svg`} width={width} height={height} alt={alt} loading="lazy" />
          </picture>
          <figcaption className={styles["card__figure__caption"]}>{caption}</figcaption>
        </figure>
      ))}
    </div>
  );
};

export default CardGallery;
