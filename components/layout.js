import Head from "next/head";

import Navbar from "./navbar";
import Footer from "./footer";

const siteTitle = process.env.NEXT_PUBLIC_APP_NAME;

export default function Layout({ children, home }) {
  return (
    <div className="container">
      <Head>
        <title>{siteTitle}</title>

        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>
        <Navbar></Navbar>
        <div className="mb-4">{children}</div>
        <Footer></Footer>
      </main>
    </div>
  );
}
