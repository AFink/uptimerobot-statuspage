import { useTranslation } from "next-i18next";

import { Row, Col } from "react-bootstrap";

export default function Overalluptime({ uptime }) {
  const { t } = useTranslation("overalluptime");
  return (
    <Row>
      <Col className="mb-3 mb-md-0" md>
        <h1>
          {uptime ? (
            <> {uptime["1"]}% </>
          ) : (
            <div className="ssc-head-line"></div>
          )}
        </h1>
        <p>{t("1")}</p>
      </Col>
      <Col className="mb-3 mb-md-0" md>
        <h1>
          {uptime ? (
            <> {uptime["7"]}% </>
          ) : (
            <div className="ssc-head-line"></div>
          )}
        </h1>
        <p>{t("7")}</p>
      </Col>
      <Col className="mb-3 mb-md-0" md>
        <h1>
          {uptime ? (
            <> {uptime["30"]}% </>
          ) : (
            <div className="ssc-head-line"></div>
          )}
        </h1>
        <p>{t("30")}</p>
      </Col>
      <Col md>
        <h1>
          {uptime ? (
            <> {uptime["90"]}% </>
          ) : (
            <div className="ssc-head-line"></div>
          )}
        </h1>
        <p>{t("90")}</p>
      </Col>
    </Row>
  );
}
