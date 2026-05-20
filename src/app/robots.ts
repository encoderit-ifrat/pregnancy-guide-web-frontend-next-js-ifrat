import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://familj.se";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/graviditet",
          "/infor-forlossning",
          "/mat-och-kostrad",
          "/efter-forlossning",
          "/barnnamn",
          "/barnnamn/swajp",
          "/forum",
          "/forum/amne/",
        ],
        disallow: [
          "/gravid/vecka/",
          "/veckans-fraga",
          "/checklistor/",
          "/min-profil/",
          "/barnnamn/swajp/matchade",
          "/barnnamn/swajp/delad/",
          "/forum/mina-amnen",
          "/logga-in",
          "/skapa-konto",
          "/glomt-losenord",
          "/change-password",
          "/auth/",
          "/resend-verify-email",
          "/api/",
          "/sok",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
