import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";

export default function Navbar() {
  const router = useRouter();
  const { t } = useTranslation("common");
  return (
    <BSNavbar variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand href="/">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={t(router.locale)} id="basic-nav-dropdown">
              {router.locales.map((locale) => {
                return (
                  <Link href="" locale={locale} passHref>
                    <NavDropdown.Item>{t(locale)}</NavDropdown.Item>
                  </Link>
                );
              })}
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
