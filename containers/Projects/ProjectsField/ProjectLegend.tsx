import React from "react";
import ProjectIcon from "@components/Card/ProjectIcon";
import { Paragraph } from "@components/core/Typography";
import styles from "./ProjectsField.module.scss";

const ProjectLegend = () => {
    const types = ["Website", "Experiment", "Machine Learning", "Other"];

    return (
        <div className={styles["projects__legend"]}>
            {types.map((type) => (
                <div key={type} className={styles["projects__legend__item"]}>
                    <ProjectIcon type={type} />
                    <Paragraph> {type} </Paragraph>
                </div>
            ))}
        </div>
    );
};

export default ProjectLegend;
