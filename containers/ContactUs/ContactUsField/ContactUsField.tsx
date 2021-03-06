import { Section } from "@components/Section";
import ContactUsForm from "./ContactUsForm";
import ContactUsIllustration from "./ContactUsIllustration";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@services/firebase";
import ContactFieldProvider, { useContactFieldContext } from "./ContactField.context";
import { startAnimation } from "./ContactField.animation";
import styles from "./ContactUsField.module.scss";
import { useAlert } from "@components/core/Alert";

const messagesCollectionRef = collection(db, "messages");

const ContactUsField = () => {
  const refs = useContactFieldContext();
  const { alert } = useAlert();

  const submitAction = async (userData: unknown) => {
    await addDoc(messagesCollectionRef, userData);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    startAnimation(refs!);
    alert({ message: "Message sent", type: "success" });
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

const widthProvider = () => {
  return <ContactFieldProvider>
    <ContactUsField />
  </ContactFieldProvider>
}

export default widthProvider;
