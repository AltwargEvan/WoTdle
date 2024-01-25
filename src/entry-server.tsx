import { createHandler } from "@solidjs/start/entry";
import { StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {/* OpenGraph */}
          <title>WoTdle</title>
          <meta
            property="description"
            content="World of Tanks Vehicle Guessing Game"
          />
          <meta property="twitter:card" content="summary_large_image"></meta>
          <meta property="twitter:title" content="WoTdle"></meta>
          <meta
            property="twitter:description"
            content="World of Tanks Vehicle Guessing Game"
          />
          <meta
            property="og:image"
            content="https://raw.githubusercontent.com/AltwargEvan/WoTdle/main/public/ogimage.png"
          ></meta>
          <meta property="og:title" content="WoTdle"></meta>
          <meta
            property="og:description"
            content="World of Tanks Vehicle Guessing Game"
          />
          <meta property="og:url" content="https://wotdle.vercel.app/"></meta>
          {/* Icons  */}
          <link rel="icon" href="wot.svg" />
          <link rel="mask-icon" href="wot.svg" color="#000000" />
          <link rel="apple-touch-icon" href="wot.svg" />
          {/* Google Font - Roboto */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap"
            rel="stylesheet"
          />
          {/* Google Site Verification  */}
          <meta
            name="google-site-verification"
            content="ZGk5lCiaTi5G8fxOo-5JkbS8auBi7j9uUFY48Bfc0aE"
          />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
          {/* Cloudflare Analytics */}
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "4ce4075a47984993a65d7757d63843ba"}'
          ></script>
        </body>
      </html>
    )}
  />
));
