import { useId } from "react";
import styles from "./InputField.module.scss";

interface props
  // eslint-disable-next-line no-undef
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "textarea";
  name: string;
  error?: string;
}

const InputField = ({
  name,
  type = "text",
  error = "",
  label = "",
  placeholder = "",
  style,
  ...rest
}: props) => {
  const id = useId();
  return (
    <div style={style} className={styles["input__field"]}>
      <label htmlFor={id} className={styles["input__field__container"]}>
        {type === "textarea" ? (
          <textarea {...rest} id={id} name={name} placeholder={placeholder} />
        ) : (
          <input
            {...rest}
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
          />
        )}
        <label className={styles["input__field__label"]}>{label}</label>
        <div className={styles["input__field__underline"]}></div>
      </label>
      <p className={styles["input__field__error"]}>{error}</p>
    </div>
  );
};

export default InputField;
