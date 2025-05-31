import { Html, Head, Main, NextScript } from "next/document";
export const metadata = {
  title: "My Awesome Next.js App", // Default title
  description: "This is a great app built with Next.js",
};
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Default title for the entire application */}
        {/* This will be overridden if a specific page sets its own title */}
        <title>Edu Spark</title>

        {/* You can add other global head tags here */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Add other meta tags like description, keywords if they are generic */}
        <meta name="description" content="Welcome to my awesome Next.js app!" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
