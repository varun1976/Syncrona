export const cookiePolicyData = {
  title: "Cookie & Storage Disclosure",
  subtitle: "Complete technical disclosure of browser cookies, local storage, and session caching used in Syncrona",
  effectiveDate: "October 3, 2026",
  version: "1.0-OFFICIAL",
  requiresLegalReview: false,
  sections: [
    {
      id: "overview",
      title: "1. Overview of Storage Technologies",
      content: `This policy outlines how **Syncrona** (operated by **VARUN KUMAR REDDY K**) uses browser cookies, LocalStorage, and client-side session caching.

> [!NOTE]
> **Minimal Storage Principle:** Syncrona operates under a strict minimal data storage philosophy. We use only **strictly necessary technical storage** required to keep your session authenticated, deliver messages, and remember your visual color theme preference.`,
    },
    {
      id: "http-cookies",
      title: "2. Essential HTTP-Only Cookies (jwt)",
      content: `Syncrona uses a single, strictly essential HTTP-Only cookie for user authentication.

### \`jwt\` Cookie Technical Specification
* **Name:** \`jwt\`
* **Purpose:** Stores an encrypted JSON Web Token verifying your active authenticated user session.
* **Security Attributes:** Set with \`httpOnly: true\`, preventing client-side JavaScript scripts from reading or modifying the token (mitigating Cross-Site Scripting / XSS risk). Transmitted securely over HTTPS in production.
* **Duration:** Valid for 7 days from initial login or renewal.
* **Type:** Essential Operational Cookie. Without this cookie, you cannot maintain an authenticated login state.`,
    },
    {
      id: "local-storage",
      title: "3. LocalStorage Preferences (chat-theme)",
      content: `Web LocalStorage is a web browser mechanism that allows persistent key-value data storage on your device.

### \`chat-theme\` Technical Specification
* **Storage Key:** \`chat-theme\`
* **Purpose:** Stores your preferred application color theme identifier (e.g., \`cloud-neumorphism\`, \`midnight-slate\`, \`cyber-neon\`, \`amoled-graphite\`).
* **Persistence:** Remains stored in your browser until manually cleared or until a different theme is selected.
* **Data Transmitted:** This key is strictly read by client-side CSS scripts to apply visual styling tokens and is **never** sent to third-party ad networks or tracking servers.`,
    },
    {
      id: "in-memory-cache",
      title: "4. In-Memory Session Caching",
      content: `During an active browser session, Syncrona maintains transient data in volatile browser RAM using state management (Zustand):

* **Active Chat Messages:** Messages in your current conversation view are temporarily cached in RAM to ensure immediate UI rendering and smooth scrolling.
* **Contact List Status:** User list data and real-time online/offline indicators are held in memory while the app tab is open.
* **Cache Lifetime:** In-memory cached data is completely erased from device memory whenever you refresh the page, close the browser tab, or log out.`,
    },
    {
      id: "tracking-absence",
      title: "5. Absence of Advertising & Tracking Cookies",
      content: `Syncrona maintains a clean digital footprint:

* **NO Advertising Cookies:** We do not use advertising cookies, retargeting pixels, or behavioral profiling trackers.
* **NO Analytics Tracking:** We do not integrate Google Analytics, Facebook Pixel, or third-party web tracking scripts.
* **NO Third-Party Cookie Sharing:** We do not sell, rent, or share storage data with ad exchanges.

> [!TIP]
> **No Intrusive Cookie Banner Required:** Because Syncrona utilizes **only strictly necessary operational storage** (essential JWT cookie and theme preference) and does NOT employ non-essential tracking or marketing cookies, ePrivacy regulations do not require an intrusive tracking banner popup.`,
    },
    {
      id: "managing-storage",
      title: "6. Managing & Clearing Storage",
      content: `You can manage or clear your browser storage at any time using your web browser settings:

* **Clearing Session Cookie:** Clicking **Logout** in Syncrona immediately clears and invalidates the \`jwt\` cookie (\`maxAge: 0\`).
* **Clearing LocalStorage:** You can clear LocalStorage through your browser's developer tools or privacy settings (Application -> Storage -> Local Storage). Clearing LocalStorage will reset Syncrona's theme back to the default \`cloud-neumorphism\` theme.
* **Browser Controls:** Most modern web browsers allow you to block cookies entirely or inspect storage keys under site settings.

For storage policy questions, contact us at \`kondreddyvarunkumarreddy@gmail.com\`.`,
    },
  ],
};
