import { forwardRef, useId } from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps
  // eslint-disable-next-line no-undef
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "textarea";
  name: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      name,
      type = "text",
      error = "",
      label = "",
      placeholder = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const id = useId();
    return (
      <div style={style} className={styles["input__field"]}>
        <label htmlFor={id} className={styles["input__field__container"]}>
          {type === "textarea" ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              {...rest}
              id={id}
              name={name}
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
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
  },
);

InputField.displayName = "InputField";

export default InputField;
