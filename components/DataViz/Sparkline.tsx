import styles from "./DataViz.module.scss";

const WIDTH = 100;
const HEIGHT = 28;

interface Props {
  values?: number[];
}

/**
 * A minimal trend line. Hand-rolled inline SVG rather than a charting
 * dependency: this is a handful of marks and the repo ships no chart library.
 */
const Sparkline = ({ values }: Props) => {
  if (!values || values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * WIDTH;
    // A flat series has no span to normalise against, so park it on the midline
    // instead of dividing by zero and pinning every point to the floor.
    const y = span === 0 ? HEIGHT / 2 : HEIGHT - ((value - min) / span) * HEIGHT;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <svg
      className={styles["sparkline"]}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        className={styles["sparkline__area"]}
        points={`0,${HEIGHT} ${points.join(" ")} ${WIDTH},${HEIGHT}`}
      />
      <polyline
        className={styles["sparkline__line"]}
        points={points.join(" ")}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export default Sparkline;
