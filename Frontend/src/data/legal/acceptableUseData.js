export const acceptableUseData = {
  title: "Acceptable Use Policy",
  subtitle: "Standards of conduct, prohibited activities, and safety guidelines for the Syncrona platform",
  effectiveDate: "October 3, 2026",
  version: "1.0-OFFICIAL",
  requiresLegalReview: false,
  sections: [
    {
      id: "purpose",
      title: "1. Purpose & Core Standards",
      content: `This Acceptable Use Policy ("AUP") defines the standards of conduct required when accessing or communicating through **Syncrona**, operated by **VARUN KUMAR REDDY K**.

Our goal is to foster a secure, reliable, and respectful environment for real-time messaging. By using Syncrona, you agree to comply with this policy under the laws of **India**.`,
    },
    {
      id: "harassment",
      title: "2. Harassment, Threats & Intimidation",
      content: `Syncrona strictly prohibits using the platform to harm, harass, or abuse others.

### Prohibited Conduct:
* Sending abusive, hateful, threatening, or harassing text messages.
* Stalking, targeted intimidation, or cyberbullying of any individual.
* Expressing hate speech targeting race, ethnicity, religion, disability, gender, or sexual orientation.
* Encouraging or inciting self-harm or violence against others.`,
    },
    {
      id: "spam-phishing",
      title: "3. Spam, Scams & Deceptive Behavior",
      content: `You may not use Syncrona for deceptive practices or unsolicited mass communications.

### Prohibited Actions:
* Transmit unsolicited commercial spam or automated promotional links.
* Deploy phishing attempts designed to trick users into revealing passwords or credentials.
* Distribute financial scams, fraudulent schemes, or deceptive links.
* Utilize automated bots or scripts to broadcast messages across chat channels.`,
    },
    {
      id: "impersonation",
      title: "4. Impersonation & Unauthorized Access",
      content: `Authenticity and trust are paramount in messaging.

### Restrictions:
* You may not impersonate any person, brand, legal entity, administrator, or another Syncrona user.
* You may not attempt to access another user's account, JWT session token, or account credentials.
* You may not misrepresent your identity or affiliation.`,
    },
    {
      id: "malicious-files",
      title: "5. Malicious Uploads & Exploits",
      content: `Syncrona allows image attachments in chat. Abuse of media upload features is forbidden.

### Restrictions:
* Uploading image files containing embedded malware, keyloggers, steganographic payloads, or executable scripts.
* Exploiting Base64 payload parser vulnerabilities or uploading corrupted files designed to crash client applications or servers.
* Attempting to bypass the 10MB payload limit or rate-limiting thresholds.`,
    },
    {
      id: "unlawful-content",
      title: "6. Unlawful & Infringing Content",
      content: `You may not share or transmit content that violates Indian or international law.

### Prohibited Content:
* Material depicting child exploitation or non-consensual intimate media.
* Copyrighted images, graphics, or intellectual property shared without authorization.
* Content promoting terrorism, illegal narcotics trade, or unlawful weapons sales.`,
    },
    {
      id: "security-abuse",
      title: "7. Service Disruption & Security Abuse",
      content: `Any attempt to compromise Syncrona's server infrastructure is strictly prohibited.

### Forbidden Acts:
* Performing Denial of Service (DoS/DDoS) attacks against Syncrona endpoints or WebSocket servers.
* Reverse engineering, decompiling, or probing API routes for unpatched vulnerabilities without explicit permission.
* Circumventing rate-limiting rules (\`signupLimiter\`, \`loginLimiter\`, \`profileLimiter\`).`,
    },
    {
      id: "reporting-enforcement",
      title: "8. Reporting Violations & Enforcement",
      content: `### Reporting Violations
If you encounter content or conduct that violates this policy, you may report it to Syncrona support at \`kondreddyvarunkumarreddy@gmail.com\` or via our **Contact & Support** page.

### Review & Enforcement Process
Reports are reviewed by platform operators. Syncrona does **NOT** utilize automated AI message scanning; reports are reviewed manually.

### Enforcement Actions:
Depending on the severity of the violation, Syncrona may take the following actions:
1. Issue a formal warning to the account holder.
2. Remove reported content or custom avatar images.
3. Temporarily suspend account access.
4. Permanently delete the user account and purge all associated database records.
5. Notify Indian or local law enforcement authorities where illegal acts or severe threats are identified.`,
    },
  ],
};
