import MessageSvg from "@svg/message.svg";
import styles from "./ContactUsField.module.scss";

const ContactUsIllustration = () => {
  return (
    <div className={styles["contact__meesage__svg__field"]}>
      <MessageSvg />
    </div>
  );
};

export default ContactUsIllustration;
