import { Title2 } from "@components/core/Typography";
import SocialMediaCard from "./SocialMediaCard";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import styles from "./Footer.module.scss";


function SocialMediaContainer() {
    return (
        <div className={styles["footer__socialMedia__container"]}>
            <Title2>contact me</Title2>
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

const TwitterIconWrapper = () => (<SocialMediaCard color="twitter"> <TwitterIcon /> </SocialMediaCard>)
const LinkedInIconWrapper = () => (<SocialMediaCard color="linkedIn"> <LinkedInIcon /> </SocialMediaCard>)
const GitHubIconWrapper = () => (<SocialMediaCard color="github"> <GithubIcon /> </SocialMediaCard>)

export default SocialMediaContainer