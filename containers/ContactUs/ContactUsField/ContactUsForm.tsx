import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@components/core/Button";
import { InputField } from "@components/core/InputField";
import { Title3 } from "@components/core/Typography";
import styles from "./ContactUsField.module.scss";

interface props {
  // eslint-disable-next-line no-unused-vars
  submitAction?: (userData?: any) => void;
}

const ContactUsForm = ({ submitAction = () => {} }: props) => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    validationSchema: yup.object({
      firstName: yup
        .string()
        .min(3, "please enter 3 letters or more")
        .required("First name is required"),
      lastName: yup
        .string()
        .min(3, "please enter 3 letters or more")
        .required("Last name is required"),
      email: yup
        .string()
        .email("Email is not valid")
        .required("Email is required"),
      message: yup.string().required("Message is required"),
    }),
    onSubmit: (values) => {
      submitAction(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles["contact__form"]}>
      <Title3> Contact Us </Title3>
      <div className={styles["contact__name__field"]}>
        <InputField
          label="First Name"
          name="firstName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          error={formik.touched.firstName ? formik.errors.firstName : ""}
        />
        <InputField
          label="Last Name"
          name="lastName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          error={formik.touched.lastName ? formik.errors.lastName : ""}
        />
      </div>
      <InputField
        label="email"
        name="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        error={formik.touched.email ? formik.errors.email : ""}
      />
      <InputField
        label="Message"
        name="message"
        type="textarea"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.message}
        error={formik.touched.message ? formik.errors.message : ""}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ContactUsForm;
