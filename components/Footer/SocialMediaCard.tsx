import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import styles from "./Footer.module.scss"

interface Props {
    children: React.ReactNode;
    color?: string;
    url?: string;
}

const SocialMediaCard = ({ children, color = "white", url = "" }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (current) {
            gsap.from(current, {
                duration: 1,
                scale: 0.95,
                ease: "power3.out",
                yoyo: true,
                repeat: -1,
            });
        }
    }, []);
    const classes = [
        styles[`icon--${color}`],
        styles["footer__socialMedia__card"]
    ]
    return (
        <div ref={ref} className={classes.join(" ")}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        </div>
    )
}

export default SocialMediaCard