import Link from "next/link";
import { useTranslation } from "next-i18next";

import Dailyuptime from "./dailyuptime";

export default function Monitor({ monitor = {} }) {
  const { t } = useTranslation("common");
  const { name, status, dailyRatios, uptime = [], slug = "" } = monitor;
  return (
    <Link href={`/${encodeURIComponent(slug)}`}>
      <a className={"card monitor"}>
        <div className="row-between">
          <h4 className="min-40 mb-0">
            <span className="name">
              {name ? name : <div className="ssc-head-line"></div>}
            </span>
            <br></br>
          </h4>{" "}
          <h4
            className={
              (status
                ? status == 2
                  ? "online"
                  : status == 9
                  ? "offline"
                  : "paused"
                : "min-20") + " mb-0"
            }
          >
            {status ? (
              status == 2 ? (
                t("online")
              ) : status == 9 ? (
                t("offline")
              ) : (
                t("paused")
              )
            ) : (
              <div className="ssc-head-line"></div>
            )}
          </h4>
        </div>
        <div className="row-between">
          <h4 className="min-20">
            {name ? (
              <span
                className={
                  uptime["30"].toFixed(2) == 100
                    ? "online"
                    : uptime["30"].toFixed(2) > 80
                    ? "partly"
                    : "offline"
                }
              >
                {uptime["30"].toFixed(2)}%
              </span>
            ) : (
              <div className="ssc-head-line"></div>
            )}
            <br></br>
          </h4>
        </div>
        <Dailyuptime
          daily={dailyRatios ? dailyRatios : new Array(30).fill(undefined)}
        ></Dailyuptime>
      </a>
    </Link>
  );
}
