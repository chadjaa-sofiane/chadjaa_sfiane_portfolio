import { AnimationText } from "@components/AnimationText";
import { Button } from "@components/core/Button";
import { InputField } from "@components/core/InputField";
import CopyIcon from "@svg/copy.svg";
import EmailIcon from "@svg/email.svg";
import GmailIcon from "@svg/gmail.svg";
import SkypeIcon from "@svg/skype.svg";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import style from "./Contact.module.scss";

const Modal = dynamic(
  async () => {
    const { Modal } = await import("@components/core/Modal");
    return Modal;
  },
  {
    ssr: false,
  },
);

const EMAIL = "chadjaasofiane@gmail.com";
const SKYPE = "https://join.skype.com/invite/dwx8Inm5F40q";
const DELAY = 1000;

const Contact = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal isOpen={open} setOpen={(open) => setOpen(open)}>
        <div className={style["contact__wrapper"]}>
          <div className={style["contact__header"]}>
            <AnimationText tag="Title2"> contact me</AnimationText>
          </div>
          <div className={style["contact__content"]}>
            <div className={style["contact__inputs"]}>
              <InputField
                name="name"
                label="full name"
                placeholder="enter your full name"
              />
              <InputField
                name="email"
                label="email"
                placeholder="enter your full email"
                style={{ flex: 1 }}
              />
            </div>
            <InputField
              name="message"
              type="textarea"
              label="message"
              placeholder="please enter your message"
            />
            <div className={style["contact__submit"]}>
              <Button> send </Button>
            </div>
          </div>
          <div className={style["contact__footer"]}>
            <div className={style["contact__footer__or"]}>
              <span>or</span>
            </div>
            <div className={style["contact__footer__socials"]}>
              <ContactField link={EMAIL} icon={<GmailIcon />} />
              <ContactField link={SKYPE} icon={<SkypeIcon />} type="navigate" />
            </div>
          </div>
        </div>
      </Modal>
      <div
        className={style["email_icon_wrapper"]}
        onClick={() => setOpen(true)}
        title="copied"
      >
        <EmailIcon className={style["email_icon_svg"]} />
      </div>
    </>
  );
};

const DoneIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width="20"
      height="20"
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M18.293 5.293L9 14.586l-4.293-4.292-1.414 1.414L9 17.414l10.707-10.707z" />
    </svg>
  );
};

interface ContactFieldProps {
  link: string;
  icon: React.ReactNode;
  type?: "copy" | "navigate";
}

const ContactField = ({ link, icon, type = "copy" }: ContactFieldProps) => {
  const [copied, setCopied] = useState(false);
  const getEmail = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  // no infinite loop will be happening here.
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (copied) {
      timer = setTimeout(() => setCopied(false), DELAY);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copied]);

  return (
    <div className={style["contact__contactField"]}>
      <a href={link} target="_blank" rel="noreferrer">
        {icon}
      </a>
      {type === "copy" ? (
        <div
          className={style["contact__contactField__link"]}
          onClick={getEmail}
        >
          {copied ? <DoneIcon /> : <CopyIcon />}
        </div>
      ) : null}
    </div>
  );
};

export default Contact;
