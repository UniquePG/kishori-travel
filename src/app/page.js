import Home from "@/pages/Home";

const BASE_URL =
  process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const getPackages = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/packages?activeOnly=1`, { next: { revalidate: 60 } });
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.log("Error fetching packages", error);
    return [];
  }
};

const getGalleryData = async ()=>{
  try {
    const res = await fetch(`${BASE_URL}/api/gallery`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.log("Error fetching gallery", error);
    return [];
  }
}

const getTestimonialsData = async ()=> {
  try {
    const res = await fetch(`${BASE_URL}/api/testimonials`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.log("Error fetching testimonials", error);
    return [];
  }
}

const getFaqsData = async ()=> {
  try {
    const res = await fetch(`${BASE_URL}/api/faqs`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching FAQs", error);
    return [];
  }
}

export default async function Page() {
  const packages = await getPackages();
  const gallery = await getGalleryData();
  const testimonials = await getTestimonialsData();
  const faqs = await getFaqsData();

  return <Home packages={packages} gallery={gallery} testimonials={testimonials} faqs={faqs} />;
}
