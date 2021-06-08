import { useTranslation } from "next-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  const year = new Date().getFullYear();
  return (
    <footer className="text-white-50 text-center mb-4 mt-auto container">
      <div className="row">
        <p className="me-auto col-md-auto">
          &copy; {year} {process.env.NEXT_PUBLIC_APP_COPYRIGHT}
        </p>
        <p className="ms-auto col-md-auto">
          <a
            href={process.env.NEXT_PUBLIC_APP_IMPRINT}
            target="_blank"
            rel="noreferrer"
          >
            {t("imprint")}
          </a>{" "}
          &bull;{" "}
          <a
            href={process.env.NEXT_PUBLIC_APP_PRIVACY}
            target="_blank"
            rel="noreferrer"
          >
            {t("privacy")}
          </a>
        </p>
      </div>
    </footer>
  );
}
