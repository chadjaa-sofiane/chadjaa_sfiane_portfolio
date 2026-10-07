import { ProjectMetric } from "@components/Card/types";
import Sparkline from "./Sparkline";
import styles from "./DataViz.module.scss";

interface Props {
  metrics?: ProjectMetric[];
}

const StatTiles = ({ metrics }: Props) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <ul className={styles["tiles"]}>
      {metrics.map((metric) => (
        <li
          key={metric.label}
          className={styles["tile"]}
          title={metric.caption || undefined}
        >
          <span className={styles["tile__value"]}>
            {metric.value}
            {metric.unit ? (
              <span className={styles["tile__unit"]}>{metric.unit}</span>
            ) : null}
          </span>
          <Sparkline values={metric.trend} />
          <span className={styles["tile__label"]}>{metric.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default StatTiles;
