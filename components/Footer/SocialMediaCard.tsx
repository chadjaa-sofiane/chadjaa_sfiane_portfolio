import styles from "./Footer.module.scss"

interface Props {
    // eslint-disable-next-line no-undef
    children: React.ReactNode;
    color?: string
}

const SocialMediaCard = ({ children, color = "white" }: Props) => {
    const classes = [
        styles[`icon--${color}`],
        styles["footer__socialMedia__card"]
    ]
    return (
        <div className={classes.join(" ")}>
            {children}
        </div>
    )
}

export default SocialMediaCard