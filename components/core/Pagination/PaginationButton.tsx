import PrevIcon from "@svg/prev.svg";
import NextIcon from "@svg/next.svg";
import styles from "./pagination.module.scss";
import { usePaginationContext } from "./PaginationContext";

type Rendertype = number | "next" | "prev";

interface props {
  render: Rendertype;
}

const PaginationButton = ({ render }: props) => {
  const { activeNumber, setActiveNumber } = usePaginationContext();
  const classes = [
    styles["pagination__button"],
    activeNumber === render ? styles["pagination__button--active"] : "",
  ];

  const onClickAvtion = (value: Rendertype) => {
    if (typeof value !== "number") return;
    setActiveNumber(value);
  };

  const children =
    render === "prev" ? (
      <PrevIcon />
    ) : render === "next" ? (
      <NextIcon />
    ) : (
      render
    );
  return (
    <div onClick={() => onClickAvtion(render)} className={classes.join(" ")}>
      {children}
    </div>
  );
};

export default PaginationButton;
