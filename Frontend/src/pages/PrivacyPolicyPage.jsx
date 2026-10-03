import { Shield } from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { privacyPolicyData } from "../data/legal/privacyPolicyData";

const PrivacyPolicyPage = () => {
  return <LegalPageLayout icon={Shield} data={privacyPolicyData} />;
};

export default PrivacyPolicyPage;
