import { Scale } from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { termsOfServiceData } from "../data/legal/termsOfServiceData";

const TermsPage = () => {
  return <LegalPageLayout icon={Scale} data={termsOfServiceData} />;
};

export default TermsPage;
