import MessageSvg from "@svg/message.svg";
import { useContactFieldRef } from "./ContactField.context";
import styles from "./ContactUsField.module.scss";

const ContactUsIllustration = () => {
  const ref = useContactFieldRef("MessageSvgRef");
  return (
    <div ref={ref} className={styles["contact__meesage__svg__field"]}>
      <MessageSvg />
    </div>
  );
};

export default ContactUsIllustration;
