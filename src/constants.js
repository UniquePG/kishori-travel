export const DUMMY_PACKAGES = [
  {
    id: "1",
    title: "Royal Rajasthan Expedition",
    description: "Experience the grandeur of palaces, vibrant bazaars, and golden deserts.",
    price: 28999,
    duration: "7N / 8D",
    location: "Rajasthan",
    imageURL: "https://picsum.photos/seed/rajasthan/800/600",
    category: "Luxury",
    tag: "Best Seller",
    itinerary: [
      { day: 1, title: "Arrival in Jaipur", activity: "Check-in and local sightseeing." },
      { day: 2, title: "Forts of Jaipur", activity: "Amber Fort and Nahargarh." },
    ],
  },
  {
    id: "2",
    title: "Kerala Backwaters & Spice Hills",
    description: "Serene houseboats, misty hill stations, and lush spice plantations.",
    price: 21499,
    duration: "5N / 6D",
    location: "Kerala",
    imageURL: "https://picsum.photos/seed/kerala/800/600",
    category: "Spiritual",
    tag: "Most Popular",
    itinerary: [],
  },
  {
    id: "3",
    title: "Himalayan Escape - Shimla & Manali",
    description: "Snow-capped peaks, lush valleys, and the magic of Himalayan towns.",
    price: 24999,
    duration: "6N / 7D",
    location: "Himachal",
    imageURL: "https://picsum.photos/seed/himalayas/800/600",
    category: "Adventure",
    itinerary: [],
  },
];

export const DUMMY_GALLERY = [
  { id: "g1", title: "Taj Mahal", url: "https://picsum.photos/seed/taj/800/800", type: "photo" },
  { id: "g2", title: "Varanasi Ghats", url: "https://picsum.photos/seed/varanasi/800/800", type: "photo" },
  { id: "g3", title: "Goa Beach", url: "https://picsum.photos/seed/goa/800/800", type: "photo" },
  {
    id: "v1",
    title: "Manali Escape",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video",
    thumbnail: "https://picsum.photos/seed/manali/400/300",
  },
];

export const DUMMY_TESTIMONIALS = [
  {
    id: "t1",
    name: "Priya Nair",
    review:
      "As a solo female traveler, safety was my top concern. Kishori Travel exceeded all expectations. The guides were professional and the hotels were excellent.",
    rating: 5,
    location: "Chennai",
    date: "March 2024",
  },
  {
    id: "t2",
    name: "Rahul Sharma",
    review:
      "The luxury Rajasthan tour was worth every penny. The attention to detail in planning was remarkable.",
    rating: 5,
    location: "Delhi",
    date: "Jan 2024",
  },
];
