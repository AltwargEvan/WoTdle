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
