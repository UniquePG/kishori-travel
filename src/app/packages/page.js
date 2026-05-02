import PackagesClientPage from "./PackagesClientPage";
import { getPackagesData } from "@/lib/data";

export const metadata = {
  title: "All Packages | Kishori Travels",
  description: "Browse our complete collection of handpicked travel experiences across India.",
};

export default function PackagesPage() {
  const packages = getPackagesData();
  
  return <PackagesClientPage packages={packages} />;
}
