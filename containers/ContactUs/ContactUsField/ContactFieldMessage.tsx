import { Button } from "@components/core/Button";
import { Paragraph, Title3 } from "@components/core/Typography";
import { reverseAnimation } from "./ContactField.animation";
import { useContactFieldRef } from "./ContactField.context";
import styles from "./ContactUsField.module.scss";


const ContactFieldMessage = () => {
    const ref = useContactFieldRef("MessageRef");

    const back = () => {
        reverseAnimation()
    }
    return (
        <div ref={ref} className={styles["contact__message"]}>
            <Title3> Thank you for you message </Title3>
            <Paragraph>
                your message has been sent successfully. we will get back to you as soon as possible
            </Paragraph>
            <div className={styles["contact__message__button__field"]}>
                <Button onClick={back} color="secondary"> Back </Button>
            </div>
        </div>
    )
}

export default ContactFieldMessage