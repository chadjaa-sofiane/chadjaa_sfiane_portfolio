import styles from "./InputField.module.scss";

interface props
  // eslint-disable-next-line no-undef
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  type?: "text" | "email" | "textarea";
  name: string;
  error?: string;
}

const InputField = ({
  label,
  name,
  type = "text",
  error = "",
  ...rest
}: props) => {
  return (
    <div className={styles["input__field"]}>
      <label htmlFor="name">{label}</label>

      {type === "textarea" ? (
        <textarea {...rest} name={name} />
      ) : (
        <input {...rest} type={type} name={name} />
      )}
      <p className={styles["input__field__error"]}>{error}</p>
    </div>
  );
};

export default InputField;
