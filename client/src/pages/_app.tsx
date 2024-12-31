import type {AppProps} from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-calendar/dist/Calendar.css';
import {MainProvider} from "@/context";
import "@/styles/globals.css";
import "../styles/report.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainProvider>
      <Component {...pageProps} />
    </MainProvider>
  );
}
