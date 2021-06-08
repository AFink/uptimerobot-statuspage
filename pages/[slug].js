import * as Sentry from "@sentry/nextjs";
import useSWR from "swr";
import fetch from "unfetch";
import { useRouter } from "next/router";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import { Row, Col } from "react-bootstrap";

import Layout from "../components/layout";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Dailyuptime from "../components/dailyuptime";
import Overalluptime from "../components/overalluptime";
import Responsetime from "../components/responsetime";

export default function Monitor() {
  const router = useRouter();

  const { t } = useTranslation("common");

  const fetcher = (url) => fetch(url).then((r) => r.json());

  let { data, error } = useSWR(`/api/monitors/${router.query.slug}`, fetcher, {
    refreshInterval: 30 * 1000,
  });
  /*let data = null;*/
  if (error) Sentry.captureException(error);

  const monitor = data;
  return (
    <Layout>
      <Head></Head>
      <div className="backlink">
        <Link href="/" passHref>
          <a className="text-white-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-arrow-narrow-left"
              height="0.75rem"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="5" y1="12" x2="9" y2="16" />
              <line x1="5" y1="12" x2="9" y2="8" />
            </svg>
            {t("back")}
          </a>
        </Link>
      </div>
      <div className="marginremover">
        <div className="card header">
          <h2>
            {monitor ? (
              <>
                {monitor.name} {t("currently")}{" "}
                {monitor.status == 9 ? (
                  <span className="offline">{t("offline")}</span>
                ) : monitor.status == 2 ? (
                  <span className="online">{t("operational")}</span>
                ) : (
                  <span className="paused">{t("paused")}</span>
                )}
                .
              </>
            ) : (
              <div className="ssc-head-line"></div>
            )}
          </h2>
        </div>
        <div className="category uptime">
          <h3 className="heading">{t("uptime")}</h3>
          <div className={"card monitor"}>
            <span
              className={
                monitor
                  ? monitor.uptime["30"].toFixed(2) == 100
                    ? "online"
                    : monitor.uptime["30"].toFixed(2) > 80
                    ? "partly"
                    : "offline"
                  : ""
              }
            >
              {monitor ? (
                <> {monitor.uptime["30"].toFixed(2)}%</>
              ) : (
                <div className="ssc-line w-5"></div>
              )}
            </span>
            <Dailyuptime
              daily={monitor ? monitor.dailyRatios : undefined}
            ></Dailyuptime>
          </div>
        </div>
        <div className="category overalluptime">
          <h3 className="heading">{t("overall")}</h3>
          <div className={"card monitor"}>
            <Overalluptime
              uptime={monitor ? monitor.uptime : null}
            ></Overalluptime>
          </div>
        </div>
        <div className="category responsetime">
          <h3 className="heading">{t("responsetime")}</h3>
          <div className={"card monitor"}>
            <Responsetime
              dailyResponsetime={
                monitor ? monitor.dailyResponsetime : undefined
              }
            ></Responsetime>
            <Row classname="mb-2">
              <Col className="mb-3 mb-md-0" md>
                <h2>
                  {monitor ? (
                    <>
                      {monitor.responsetime.avg}
                      {t("ms")}
                    </>
                  ) : (
                    <div className="ssc-head-line"></div>
                  )}
                </h2>
                <p>{t("avg")}</p>
              </Col>
              <Col className="mb-3 mb-md-0" md>
                <h2>
                  {monitor ? (
                    <>
                      {monitor.responsetime.min}
                      {t("ms")}
                    </>
                  ) : (
                    <div className="ssc-head-line"></div>
                  )}
                </h2>
                <p>{t("min")}</p>
              </Col>
              <Col md>
                <h2>
                  {monitor ? (
                    <>
                      {monitor.responsetime.max}
                      {t("ms")}
                    </>
                  ) : (
                    <div className="ssc-head-line"></div>
                  )}
                </h2>
                <p>{t("max")}</p>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "footer",
        "overalluptime",
      ])),
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
