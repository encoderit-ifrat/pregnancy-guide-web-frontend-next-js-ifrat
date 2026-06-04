"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsModal() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-circle-border hover:underline bg-transparent border-none p-0 inline font-inherit cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-normal"
        >
          {t("signUp.termsLink")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col bg-white p-6 rounded-lg text-left shadow-xl">
        <div className="flex-none border-b pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-primary-color">
            {t("signUp.termsLink")}
          </DialogTitle>
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-text-dark space-y-6 font-outfit leading-relaxed pr-2 overflow-x-hidden">
          <div>
            <h3 className="text-lg font-bold text-primary-color mb-2">Del 1. Användarvillkor</h3>
            <p className="text-xs text-gray-500 mb-4"><strong>Senast uppdaterad:</strong> 2026-05-24</p>
            <p className="mb-4">Välkommen till Familj.se. Dessa användarvillkor beskriver reglerna för att använda vår webbplats och app. Genom att skapa ett konto godkänner du villkoren. Läs dem gärna noga.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">1. Om tjänsten</h4>
            <p className="mb-2">Familj.se är en tjänst som hjälper dig att följa din graviditet vecka för vecka, tillsammans med din partner och familj. Tjänsten innehåller artiklar, checklistor, en återkommande fråga varje vecka, ett verktyg för att hitta barnnamn och ett forum för samtal med andra.</p>
            <p>Tjänsten tillhandahålls av Creative Media House Sweden AB, 559442-3674,<br />Jägerhorns väg 9, 141 75 Kungens Kurva</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">2. Information, inte medicinsk rådgivning</h4>
            <p>Innehållet på Familj.se är allmän information och stöd. Det ersätter inte professionell medicinsk rådgivning, diagnos eller behandling. Vänd dig alltid till barnmorska, läkare eller annan vårdpersonal vid frågor om din hälsa eller din graviditet. Om du upplever akuta besvär, kontakta vården eller ring 112.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">3. Ditt konto</h4>
            <p className="mb-2">För att använda tjänsten skapar du ett konto. Du ansvarar för att de uppgifter du lämnar är korrekta och för att hålla dina inloggningsuppgifter skyddade. Du får inte dela ditt konto med andra eller låta någon annan använda det.</p>
            <p>Du måste vara minst arton år för att skapa ett konto.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">4. Inbjudningar till partner och familj</h4>
            <p>Som gravid kan du bjuda in din partner och andra närstående att följa din graviditet. När du bjuder in någon delar du visst innehåll med dem. Du ansvarar för att de personer du bjuder in vill ta emot inbjudan och för att deras uppgifter får delas med oss för detta syfte.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">5. Forum och innehåll från användare</h4>
            <p className="mb-2">I forumet kan du skriva inlägg och svara på andras. När du publicerar innehåll ansvarar du själv för det du skriver. Du går med på att inte publicera innehåll som:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>är olagligt, hotfullt, kränkande eller trakasserande</li>
              <li>gör intrång i någon annans rättigheter, till exempel upphovsrätt</li>
              <li>innehåller reklam, spam eller vilseledande information</li>
              <li>delar någon annans personuppgifter utan samtycke</li>
              <li>ger medicinska råd som kan vara skadliga</li>
            </ul>
            <p>Vi modererar forumet och kan ta bort innehåll som bryter mot villkoren eller som vi bedömer som olämpligt. Vi kan också stänga av konton som upprepat bryter mot reglerna. Du kan när som helst radera dina egna inlägg.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">6. Vårt innehåll</h4>
            <p>Artiklar, texter, bilder och annat material som vi tillhandahåller tillhör Creative Media House eller våra samarbetspartner. Du får använda innehållet för ditt eget personliga bruk, men inte kopiera, sprida eller publicera det på annat håll utan vårt tillstånd.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">7. Tillgänglighet och ändringar</h4>
            <p>Vi strävar efter att tjänsten ska fungera utan avbrott, men vi kan inte garantera att den alltid är tillgänglig. Vi kan uppdatera, ändra eller ta bort funktioner över tid. Tjänsten är gratis, och vi förbehåller oss rätten att i framtiden införa betalda funktioner. Om vi gör det meddelar vi dig i förväg.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">8. Ansvarsbegränsning</h4>
            <p>Tjänsten tillhandahålls i befintligt skick. Vi ansvarar inte för skador som uppstår av att du förlitat dig på information i tjänsten, i den utsträckning lagen tillåter. Detta påverkar inte dina rättigheter enligt tvingande konsumentlagstiftning.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">9. Avsluta ditt konto</h4>
            <p>Du kan när som helst radera ditt konto direkt i tjänsten. När du raderar kontot tas dina personuppgifter bort enligt vår integritetspolicy. Vi kan också avsluta ditt konto om du bryter mot dessa villkor.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">10. Ändringar av villkoren</h4>
            <p>Vi kan komma att uppdatera dessa villkor. Vid väsentliga ändringar meddelar vi dig, till exempel via mejl eller i tjänsten. Genom att fortsätta använda Familj.se efter en ändring godkänner du de uppdaterade villkoren.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">11. Tillämplig lag och tvist</h4>
            <p>Svensk lag gäller för dessa villkor. Tvister ska i första hand lösas genom kontakt med oss. Om vi inte kommer överens kan tvisten prövas av svensk domstol eller av Allmänna reklamationsnämnden.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">12. Kontakt</h4>
            <p>Har du frågor om villkoren? Mejla oss på <strong>hej@familj.se</strong>.</p>
          </div>

          <hr className="my-6 border-gray-200" />

          <div>
            <h3 className="text-lg font-bold text-primary-color mb-2">Del 2. Integritetspolicy</h3>
            <p className="text-xs text-gray-500 mb-4"><strong>Senast uppdaterad:</strong> [datum]</p>
            <p className="mb-4">Din integritet är viktig för oss. Den här policyn förklarar vilka personuppgifter vi samlar in, varför, och vilka rättigheter du har. Familj.se behandlar uppgifter om graviditet, vilket är en känslig typ av uppgift, och vi hanterar den med särskild omsorg.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">1. Personuppgiftsansvarig</h4>
            <p className="mb-2">Creative Media House är personuppgiftsansvarig för behandlingen av dina personuppgifter i Familj.se.</p>
            <p>Tjänsten tillhandahålls av Creative Media House Sweden AB, 559442-3674,<br />Jägerhorns väg 9, 141 75 Kungens Kurva</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">2. Vilka uppgifter vi samlar in</h4>
            <p className="mb-2">Vi samlar in följande uppgifter:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Kontouppgifter: namn och e-postadress.</li>
              <li>Graviditetsuppgifter: beräknat födelsedatum eller graviditetsvecka, som du själv anger för att tjänsten ska kunna visa rätt innehåll.</li>
              <li>Innehåll du skapar: inlägg och svar i forumet, svar på veckans fråga, sparade barnnamn och ifyllda checklistor.</li>
              <li>Relationer: vem du bjudit in, eller vem som bjudit in dig, för att kunna dela graviditeten.</li>
              <li>Teknisk information: viss information om hur du använder tjänsten, för att den ska fungera och bli bättre.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">3. Särskilt om graviditetsuppgifter</h4>
            <p>Uppgifter om graviditet räknas som en särskild kategori av personuppgifter enligt dataskyddsförordningen, eftersom de rör hälsa. Vi behandlar dessa uppgifter endast med ditt uttryckliga samtycke, som du lämnar när du anger dem i tjänsten. Du kan när som helst ta tillbaka ditt samtycke genom att ta bort uppgifterna eller radera ditt konto.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">4. Varför vi behandlar uppgifterna</h4>
            <p className="mb-2">Vi använder uppgifterna för att:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>ge dig tillgång till ditt konto och tjänstens funktioner</li>
              <li>visa innehåll som passar var i graviditeten du befinner dig</li>
              <li>låta dig dela graviditeten med partner och familj</li>
              <li>möjliggöra samtal i forumet</li>
              <li>skicka systemmeddelanden, som bekräftelser och återställning av lösenord</li>
              <li>förbättra och utveckla tjänsten</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">5. Laglig grund</h4>
            <p>Vi behandlar dina uppgifter på följande grunder: för att uppfylla avtalet med dig när du använder tjänsten, med ditt samtycke när det gäller graviditetsuppgifter, och utifrån vårt berättigade intresse av att driva och förbättra tjänsten.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">6. Hur länge vi sparar uppgifterna</h4>
            <p>Vi sparar dina uppgifter så länge du har ett aktivt konto. När du raderar ditt konto tar vi bort dina personuppgifter, om vi inte enligt lag måste spara vissa uppgifter längre. Innehåll du delat i forumet kan finnas kvar i avidentifierad form.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">7. Vilka som får tillgång till uppgifterna</h4>
            <p className="mb-2">Dina uppgifter delas med dem du själv bjudit in, i den omfattning du valt. Vi säljer aldrig dina uppgifter. Vi anlitar vissa leverantörer som behandlar uppgifter för vår råknning, så kallade personuppgiftsbiträden:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>En leverantör för utskick av systemmeddelanden via e-post. Denna leverantör är baserad utanför EU, och överföringen skyddas av Europeiska kommissionens standardavtalsklausuler.</li>
            </ul>
            <p>Vår egen lagring av uppgifter sker inom EU.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">8. Dina rättigheter</h4>
            <p className="mb-2">Du har enligt dataskyddsförordningen rätt att:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>få veta vilka uppgifter vi har om dig</li>
              <li>rätta felaktiga uppgifter</li>
              <li>radera dina uppgifter</li>
              <li>begränsa eller invända mot viss behandling</li>
              <li>få ut dina uppgifter i ett portabelt format</li>
              <li>ta tillbaka ditt samtycke</li>
              <li>klaga till Integritetsskyddsmyndigheten om du anser att vi behandlar dina uppgifter fel</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">9. Säkerhet</h4>
            <p>Vi vidtar tekniska och organisatoriska åtgärder för att skydda dina uppgifter mot obehörig åtkomst, förlust och missbruk. Eftersom vi hanterar känsliga uppgifter lägger vi särskild vikt vid säkerheten.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">10. Cookies</h4>
            <p>Vi använder cookies och liknande tekniker för att tjänsten ska fungera och för att förstå hur den används.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">11. Ändringar av policyn</h4>
            <p>Vi kan uppdatera den här policyn. Vid väsentliga ändringar meddelar vi dig. Den senaste versionen finns alltid tillgånglig i tjänsten.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">12. Kontakt</h4>
            <p>Har du frågor om hur vi hanterar dina uppgifter? Mejla oss på <strong>hej@familj.se</strong>.</p>
          </div>

          <hr className="my-6 border-gray-200" />

          <div>
            <h3 className="text-lg font-bold text-primary-color mb-2">Att gå igenom innan publicering</h3>
            <p className="mb-4">En sammanställning av allt som behöver fyllas i eller bekräftas, så att inget missas innan en jurist tittar på dokumenten.</p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">A. Fyll i</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fullständigt juridiskt företagsnamn och organisationsnummer</li>
              <li>Postadress</li>
              <li>Kontaktuppgift för dataskyddsfrågor, samt dataskyddsombud om ni har ett</li>
              <li>Datum för senast uppdaterad</li>
              <li>Konkreta lagringstider för konton och innehåll</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">B. Bekräfta</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Exakt vilka tredjepartsleverantörer som behandlar persondata, utöver Postmark</li>
              <li>Rättslig grund för överföring till Postmark i USA</li>
              <li>Vilka cookies ni använder och om cookie-banner behövs</li>
              <li>Att den lagliga grunden för varje behandling är korrekt</li>
              <li>Att ansvarsbegränsningarna är giltiga enligt svensk konsumenträtt</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-color mb-2">C. Tekniskt, för utvecklaren</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Vid registrering: kryssruta där användaren aktivt godkänner användarvillkor och integritetspolicy, med länkar till båda</li>
              <li>Separat, tydligt samtycke för graviditetsuppgifter eftersom det är känslig data</li>
              <li>Funktion för att radera konto och egna inlägg</li>
              <li>Funktion för att ladda ner egna uppgifter, för dataportabilitet</li>
              <li>Publika sidor för villkor och policy, med egna URL:er, krävs av App Store och Google Play</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
