import styles from "./Footer.module.scss"

interface Props {
    children: React.ReactNode;
    color?: string;
    url?: string;
}

const SocialMediaCard = ({ children, color = "white", url = "" }: Props) => {
    const classes = [
        styles[`icon--${color}`],
        styles["footer__socialMedia__card"]
    ]
    return (
        <div className={classes.join(" ")}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        </div>
    )
}

export default SocialMediaCard