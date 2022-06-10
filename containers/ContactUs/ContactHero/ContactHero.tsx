import { Button } from "@components/core/Button"
import { Section, SectionContent } from "@components/Section"
import ContactHeroIllustration from "./ContactHeroIllustration"
import CopyIcon from "@svg/copy.svg";
import { useAlert } from "@components/core/Alert";

const ContactHero = () => {
    return (
        <Section>
            <SectionContent
                title="My Projects"
                description="contact me, I&apos;m always open to new opportunities."
                button={<CoppyButton />}
            />
            <ContactHeroIllustration />
        </Section>
    )
}

const CoppyButton = () => {
    const { alert } = useAlert();
    const copyEmailaddress = () => {
        navigator.clipboard.writeText("softfolio@chadjaasoftfolio.com");
        alert({ message: "Copied email: softfolio@chadjaasoftfolio.com", type: "success" });
    }
    return <Button variant="outlined" color='secondary' onClick={copyEmailaddress}>
        <CopyIcon />
        <span style={{ marginLeft: 10 }}>
            copy email
        </span>
    </Button>
}

export default ContactHero