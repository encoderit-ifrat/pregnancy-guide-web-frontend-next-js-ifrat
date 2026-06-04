"use client";

import { useEffect } from "react";
import { hasAcceptedAll } from "@/lib/consent";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

const PIXEL_ID = "2694273594279105";

export default function MetaPixelTracker() {
  useEffect(() => {
    if (!hasAcceptedAll()) return;
    if (window.fbq) return;

    /* eslint-disable prefer-spread, prefer-rest-params */
    // Standard Meta Pixel snippet
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable prefer-spread, prefer-rest-params */

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  return null;
}
