import { RefObject } from "react";
import styles from "./SectionsProgress.module.scss";
import { useSectionsProgress } from "./SectionsProgressProvider";

const SectionsProgress = () => {
    const { sections, activeSection, goTo } = useSectionsProgress();

    return (
        <div className={styles["sectionsProgress__wrapper"]}>
            {[...sections.values()].map((section, index) => (
                <span
                    key={index}
                    className={
                        activeSection === section.current ? styles["active"] : styles["passive"]}
                    onClick={() => goTo(section as RefObject<HTMLDivElement>)}
                />
            ))}
        </div>
    );
}

export default SectionsProgress;