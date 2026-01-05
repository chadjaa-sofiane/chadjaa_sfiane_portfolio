import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@components/Section";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import styles from "./AboutMe.module.scss";

import { useSectionsProgress } from "@components/SectionsProgress";

const downloadCv = () => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = "/resume.pdf";
  a.download = "chadjaa_sofiane_resume";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const AboutMe = () => {
  const { ref } = useSectionsProgress();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <Section ref={ref} variant="dark">
      <div className={styles["aboutMe"]} id="about">
        <div className={styles["aboutMe__background"]} />

        <motion.div
          ref={containerRef}
          className={styles["aboutMe__wrapper"]}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className={styles["aboutMe__card"]}>
            <motion.div
              className={styles["aboutMe__content"]}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className={styles["aboutMe__title"]}>
                About Chadjaa Sofiane
              </h2>
              <p className={styles["aboutMe__description"]}>
                An overview of my work and
                interests, with links to projects, code, and professional
                profiles.
              </p>
            </motion.div>

            <motion.div
              className={styles["aboutMe__actions"]}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <button
                className={styles["aboutMe__button"]}
                onClick={downloadCv}
              >
                <span>Download Resume</span>
                <DownloadIcon />
              </button>

              <div className={styles["aboutMe__links"]}>
                <Twitter />
                <LinkedIn />
                <GitHub />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

const Twitter = () => {
  return (
    <a
      href="https://twitter.com/ChadjaaSofiane"
      target="_blank"
      rel="noopener noreferrer"
      className={styles["icon"]}
      aria-label="Twitter Profile"
    >
      <TwitterIcon />
    </a>
  );
};

const LinkedIn = () => {
  return (
    <a
      href="https://www.linkedin.com/in/sofiane-chadjaa/"
      target="_blank"
      rel="noopener noreferrer"
      className={styles["icon"]}
      aria-label="LinkedIn Profile"
    >
      <LinkedInIcon />
    </a>
  );
};

const GitHub = () => {
  return (
    <a
      href="https://github.com/chadjaa-sofiane"
      target="_blank"
      rel="noopener noreferrer"
      className={styles["icon"]}
      aria-label="GitHub Profile"
    >
      <GithubIcon />
    </a>
  );
};

const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AboutMe;
