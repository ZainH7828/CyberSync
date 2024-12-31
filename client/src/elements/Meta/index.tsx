import constants from "@/constants";
import Head from "next/head";
import { usePathname } from "next/navigation";

const Meta: React.FC<MetaDataType> = ({ pageName = "", description = "" }) => {
  const pathName = usePathname();

  const metaDetials = {
    title: `${constants.appSettings.appName}${
      pageName ? ` | ${pageName}` : ""
    }`,
    desc: description ? description : constants.appSettings.slogan,
    canonical: `${constants.appSettings.siteURL}${pathName}`,
    icon: `${constants.appSettings.favIcon}`,
  };
  return (
    <Head>
      <title>{metaDetials.title}</title>
      <meta name="description" content={metaDetials.desc} />
      <meta property="og:type" content="website" />
      <meta name="og:title" property="og:title" content={metaDetials.title} />
      <meta
        name="og:description"
        property="og:description"
        content={metaDetials.desc}
      />
      <meta property="og:site_name" content={constants.appSettings.appName} />
      <meta property="og:url" content={metaDetials.canonical} />
      <link rel="icon" type="image/png" href={metaDetials.icon} />
      <link rel="apple-touch-icon" href={metaDetials.icon} />
      <meta name="theme-color" content="#fff" />
    </Head>
  );
};

export default Meta;
