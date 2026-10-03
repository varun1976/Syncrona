import { Cookie } from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { cookiePolicyData } from "../data/legal/cookiePolicyData";

const CookiePolicyPage = () => {
  return <LegalPageLayout icon={Cookie} data={cookiePolicyData} />;
};

export default CookiePolicyPage;
