import fs from 'fs';
import path from 'path';
import { DUMMY_PACKAGES, DUMMY_GALLERY, DUMMY_TESTIMONIALS } from '@/constants';

const packagesPath = path.join(process.cwd(), 'data', 'packages.json');
const galleryPath = path.join(process.cwd(), 'data', 'gallery.json');
const testimonialsPath = path.join(process.cwd(), 'data', 'testimonials.json');

// Helper to safely read or initialize JSON files
const getFileData = (filePath, defaultData) => {
  try {
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return defaultData;
  }
};

export const getPackagesData = () => getFileData(packagesPath, DUMMY_PACKAGES);
export const getGalleryData = () => getFileData(galleryPath, DUMMY_GALLERY);
export const getTestimonialsData = () => getFileData(testimonialsPath, DUMMY_TESTIMONIALS);
