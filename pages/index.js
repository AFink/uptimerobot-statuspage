import useSWR from "swr";
import fetch from "unfetch";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Head from "next/head";
import Layout from "../components/layout";
import Monitor from "../components/monitor";

export default function Homepage() {
  const { t } = useTranslation("common");

  const router = useRouter();
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/homepage", fetcher, {
    refreshInterval: 30 * 1000,
  });

  /*let data = null;*/

  if (error) Sentry.captureException(error);
  let d2 = data;
  if (!data) {
    d2 = new Array(3).fill(undefined);
  }
  return (
    <Layout home>
      <Head></Head>
      <div className="marginremover" style={{ "margin-bottom": "-15px" }}>
        <div className="card header">
          <h2>
            {data ? (
              data.some((c) => c.monitors.some((m) => m.status == 9)) ? (
                data.every((c) => c.monitors.some((m) => m.status == 9)) ? (
                  <>
                    {t("allservices")}{" "}
                    <span className="offline">{t("offline")}</span>.
                  </>
                ) : (
                  <>
                    {t("someservices")}{" "}
                    <span className="offline">{t("offline")}</span>.
                  </>
                )
              ) : (
                <>
                  {t("allservices")}{" "}
                  <span className="online">{t("operational")}</span>.
                </>
              )
            ) : (
              <div className="ssc-head-line"></div>
            )}
          </h2>
        </div>
        {d2.map((c = {}) => {
          let { name, monitors = new Array(4).fill(undefined) } = c;
          return (
            <div className="category">
              <h3 className="heading">
                {name ? (
                  name
                ) : (
                  <div className="ssc-head-line w-md-30 w-50 ms-md-0 mx-auto"></div>
                )}
              </h3>
              <ul className={"monitors"}>
                {monitors.map((monitor = {}, index) => {
                  return (
                    <li>
                      <Monitor monitor={monitor}></Monitor>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
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
