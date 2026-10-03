import { AlertOctagon } from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { acceptableUseData } from "../data/legal/acceptableUseData";

const AcceptableUsePage = () => {
  return <LegalPageLayout icon={AlertOctagon} data={acceptableUseData} />;
};

export default AcceptableUsePage;
