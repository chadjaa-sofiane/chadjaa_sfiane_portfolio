import { useEffect, useState } from "react";
import EmailIcon from "@svg/email.svg";
import CopyIcon from "@svg/copy.svg";
import style from "./Contact.module.scss";

import dynamic from "next/dynamic";

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
const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // const getEmail = () => {
  //   navigator.clipboard.writeText(EMAIL);
  //   setCopied(true);
  // };
  // // no infinite loop will be happening here.
  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //
  //   if (copied) {
  //     timer = setTimeout(() => setCopied(false), 3000);
  //   }
  //
  //   return () => {
  //     if (timer) {
  //       clearTimeout(timer);
  //     }
  //   };
  // }, [copied]);

  return (
    <>
      <Modal isOpen={open} setOpen={(open) => setOpen(open)}>
        <div> hello world</div>
      </Modal>
      <div
        className={style["email_icon_wrapper"]}
        onClick={() => setOpen(true)}
        title="copied"
      >
        {copied ? (
          <CopyIcon />
        ) : (
          <EmailIcon className={style["email_icon_svg"]} />
        )}
      </div>
    </>
  );
};
export default Contact;
