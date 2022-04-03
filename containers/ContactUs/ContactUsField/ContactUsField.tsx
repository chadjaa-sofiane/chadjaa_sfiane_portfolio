import { Section } from "@components/Section";
import styles from "./ContactUsField.module.scss";
import ContactUsForm from "./ContactUsForm";
import ContactUsIllustration from "./ContactUsIllustration";

styles;

const ContactUsField = () => {
  const submitAction = (userData: any) => {
    console.log(userData);
  };
  return (
    <Section>
      <div className={styles["contact__container"]}>
        <ContactUsIllustration />
        <ContactUsForm submitAction={submitAction} />
      </div>
    </Section>
  );
};

export default ContactUsField;
