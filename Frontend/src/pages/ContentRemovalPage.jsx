import { FileText } from "lucide-react";
import LegalPageLayout from "../components/legal/LegalPageLayout";
import { contentRemovalData } from "../data/legal/contentRemovalData";

const ContentRemovalPage = () => {
  return <LegalPageLayout icon={FileText} data={contentRemovalData} />;
};

export default ContentRemovalPage;
