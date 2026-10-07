import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import { useSectionsProgress } from "@components/SectionsProgress";
import HomeSection from "../HomeSection/HomeSection";
import styles from "./AboutMe.module.scss";

const principles = [
  {
    title: "What I do",
    body: "Full-stack development for fintech, real-time products and high-reliability systems: work where mistakes are expensive.",
  },
  {
    title: "How I work",
    body: "Async-first, thorough in discovery, and comfortable flying solo or partnering with design. Most production work is under NDA, including payment platforms, IoT device control, and internal tools at scale.",
  },
  {
    title: "What I'm looking for",
    body: "Freelance and contract projects, especially new builds or scale-ups that need to be done right from day one.",
  },
];

const socials = [
  { href: "https://github.com/chadjaa-sofiane", label: "GitHub", Icon: GithubIcon },
  { href: "https://www.linkedin.com/in/sofiane-chadjaa/", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://twitter.com/ChadjaaSofiane", label: "X", Icon: TwitterIcon },
];

const AboutMe = () => {
  const { ref } = useSectionsProgress();
  const reduceMotion = useReducedMotion();
  const reveal = (i: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <HomeSection
      ref={ref}
      id="about"
      index="03"
      label="About"
      title={<>Calm engineering for <em>high-stakes</em> products.</>}
    >
      <div className={styles.principles}>
        {principles.map((item, i) => (
          <motion.div key={item.title} className={styles.principle} {...reveal(i)}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </motion.div>
        ))}
      </div>

      <motion.div className={styles.cta} {...reveal(1)}>
        <div className={styles.ctaText}>
          <p className={styles.status}><span aria-hidden="true" />Available for freelance &amp; contract work</p>
          <p className={styles.ctaTitle}>Have something that needs to be <em>done right?</em></p>
        </div>
        <div className={styles.ctaActions}>
          <a className={styles.primary} href="mailto:chadjaasofiane@gmail.com">
            chadjaasofiane@gmail.com <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div className={styles.secondary}>
            <a href="/resume.pdf" download="chadjaa_sofiane_resume" className={styles.resume}>
              <Download size={16} aria-hidden="true" /> Resume
            </a>
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.icon}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </HomeSection>
  );
};

export default AboutMe;
