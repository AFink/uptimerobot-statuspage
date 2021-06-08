import { isMobile } from "react-device-detect";

import Uptimepill from "./uptimepill";
import styles from "./dailyuptime.module.css";

export default function Dailyuptime({ daily = new Array(90).fill(undefined) }) {
  if (isMobile) {
    daily = daily.slice(Math.max(daily.length - 30, 0));
  }
  return (
    <div className={styles.dailyuptime}>
      {daily.map((day) => (
        <Uptimepill day={day}></Uptimepill>
      ))}
    </div>
  );
}
