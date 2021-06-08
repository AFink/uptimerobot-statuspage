import { useTranslation } from "next-i18next";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import styles from "./uptimepill.module.css";

export default function Uptimepill({ day = {} }) {
  const { t } = useTranslation("common");
  let { uptime = {}, date } = day;

  const { up = 0, down = 0, paused = 0 } = uptime;
  return (
    <div className={styles.uptimepill}>
      {date ? (
        <Tippy
          /* hideOnClick="false"
    trigger='click' */
          content={
            <div className={styles.tooltip}>
              <span className={styles.tooltipdate}>{date}</span>
              {paused.toFixed(2) > 0 && (
                <span className="paused">
                  <br></br>
                  {t("paused")}: {paused.toFixed(2)}%
                </span>
              )}
              {down.toFixed(2) > 0 && (
                <span className="down">
                  <br></br>
                  {t("down")}: {down.toFixed(2)}%
                </span>
              )}
              {up.toFixed(2) > 0 && (
                <span className="up">
                  <br></br>
                  {t("up")}: {up.toFixed(2)}%
                </span>
              )}
            </div>
          }
          theme="andi"
        >
          <div
            className={
              (up.toFixed(2) == 100
                ? styles.up
                : up.toFixed(2) > 80
                ? styles.partly
                : styles.down) +
              " " +
              styles.inner
            }
            style={{ height: "100%" }}
          ></div>
        </Tippy>
      ) : (
        <div className=""></div>
      )}
    </div>
  );
}
