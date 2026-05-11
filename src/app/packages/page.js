import PackagesClientPage from "./PackagesClientPage";
import "../../styles/home-reference.css"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const getPackages = async (searchParams) => {
  try {
    const params = new URLSearchParams(searchParams);
    const res = await fetch(`${BASE_URL}/api/packages?${params.toString()}`, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching packages", error);
    return [];
  }
}

export default async function PackagesPage({ searchParams }) {
  const params = await searchParams;
  const packages = await getPackages(params);
  
  return <PackagesClientPage packages={packages} />;
}
