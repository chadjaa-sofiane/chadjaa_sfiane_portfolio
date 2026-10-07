import Image from "next/image";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";

/**
 * Hand-drawn window (scripts/export-card-sketches.cjs) with the project's
 * screenshot showing through its screen. Without a screenshot, a sketched
 * placeholder for the project type fills the screen instead.
 */

// Where the frame's screen sits inside its 420x260 drawing. Keep in sync with
// SCREEN in scripts/export-card-sketches.cjs.
const FRAME = { w: 420, h: 260 };
const SCREEN = { x: 10, y: 40, w: 400, h: 212 };
const pct = (value: number, total: number) => `${(value / total) * 100}%`;
const screenStyle = {
    left: pct(SCREEN.x, FRAME.w),
    top: pct(SCREEN.y, FRAME.h),
    width: pct(SCREEN.w, FRAME.w),
    height: pct(SCREEN.h, FRAME.h),
};

export const sketchKind = (type?: string) => {
    switch (type?.toLowerCase()) {
        case "website":
            return "website";
        case "ml":
        case "machine learning":
            return "ml";
        default:
            return "other";
    }
};

const CardImage = () => {
    const { imageSrc, title, type } = useCardContext();
    // No isPrivate branch: Card.tsx excludes private projects from
    // shouldShowImage, so this component never mounts for one.
    const kind = sketchKind(type);
    return (
        <div className={styles["card__sketch"]}>
            <div className={styles["card__sketch__screen"]} style={screenStyle}>
                {imageSrc ? (
                    <Image
                        className={styles["card__image"]}
                        src={imageSrc}
                        alt={`Screenshot of ${title}`}
                        fill
                        sizes="(max-width: 45rem) 100vw, 420px"
                    />
                ) : null}
            </div>
            {!imageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles["card__sketch__layer"]} src={`/sketches/placeholder-${kind}.svg`}
                    alt="" width={FRAME.w} height={FRAME.h} loading="lazy" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles["card__sketch__layer"]} src={`/sketches/frame-${kind}.svg`}
                alt="" width={FRAME.w} height={FRAME.h} loading="lazy" />
        </div>
    )
}

export default CardImage
