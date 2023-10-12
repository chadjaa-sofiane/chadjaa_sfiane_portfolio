import { useEffect, useState } from "react"
import EmailIcon from "@svg/email.svg"
import CopyIcon from "@svg/copy.svg"


import style from "./GetEmail.module.scss"
const EMAIL = "chadjaasofiane@gmail.com"

const GetEmail = () => {
    const [copied, setCopied] = useState(false)
    const getEmail = () => {
        navigator.clipboard.writeText(EMAIL)
        setCopied(true)
    }
    // no infinite loop will be happening here.
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (copied) {
            timer = setTimeout(() => setCopied(false), 3000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [copied]);

    return (
        <div className={style["email_icon_wrapper"]} onClick={getEmail} title="copied">
            {copied ? <CopyIcon /> : <EmailIcon className={style["email_icon_svg"]} />}
        </div >
    )
}
export default GetEmail


