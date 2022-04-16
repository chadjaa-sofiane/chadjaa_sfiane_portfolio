import { AnimationText } from "@components/AnimationText";
import SocialMediaCard from "./SocialMediaCard";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import styles from "./Footer.module.scss";


function SocialMediaContainer() {
    return (
        <div className={styles["footer__socialMedia__container"]}>
            <AnimationText>contact me</AnimationText>
            <div>
                <TwitterIconWrapper />
                <LinkedInIconWrapper />
            </div>
            <div>
                <GitHubIconWrapper />
            </div>
        </div>
    )
}

const TwitterIconWrapper = () => (<SocialMediaCard url="https://twitter.com/ChadjaaSofiane" color="twitter"> <TwitterIcon /> </SocialMediaCard>)
const LinkedInIconWrapper = () => (<SocialMediaCard url="https://www.linkedin.com/in/chadjaa-sofiane-749045217/" color="linkedIn"> <LinkedInIcon /> </SocialMediaCard>)
const GitHubIconWrapper = () => (<SocialMediaCard url="https://www.github.com/chadjaa-sofiane" color="github"> <GithubIcon /> </SocialMediaCard>)

export default SocialMediaContainer