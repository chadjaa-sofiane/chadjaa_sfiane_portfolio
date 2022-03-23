import PaginationButton from "./PaginationButton";
import styles from "./Pagination.module.scss";
import PaginationProvider from "./Pagination.context";

interface props {
  count: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (active: number) => void;
}

// eslint-disable-next-line no-empty-pattern
const Pagination = ({ count }: props) => {
  return (
    <PaginationProvider>
      <div className={styles["pagination__field"]}>
        <PaginationButton render="prev" />
        {Array.from(Array(count).keys()).map((n, i) => (
          <PaginationButton key={i} render={n + 1} />
        ))}
        <PaginationButton render="next" />
      </div>
    </PaginationProvider>
  );
};

export default Pagination;
