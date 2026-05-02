import Home from "@/pages/Home";
import { getPackagesData, getGalleryData, getTestimonialsData } from "@/lib/data";

export default function Page() {
  const packages = getPackagesData();
  const gallery = getGalleryData();
  const testimonials = getTestimonialsData();

  return <Home packages={packages} gallery={gallery} testimonials={testimonials} />;
}
