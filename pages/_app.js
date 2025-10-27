import "../styles/globals.css";
import YandexMetrika from "../components/YandexMetrika";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function App({ Component, pageProps }) {
  return (
    <>
      <YandexMetrika />
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
}

