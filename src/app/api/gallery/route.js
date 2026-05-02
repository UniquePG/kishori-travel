import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DUMMY_GALLERY } from '@/constants';

const dataFilePath = path.join(process.cwd(), 'data', 'gallery.json');

// Helper to get gallery data
const getGalleryData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Ensure the directory exists
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(DUMMY_GALLERY, null, 2));
      return DUMMY_GALLERY;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return DUMMY_GALLERY;
  }
};

export async function GET() {
  const data = getGalleryData();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const newItem = await request.json();
    const data = getGalleryData();
    
    const itemToAdd = {
      id: Date.now().toString(),
      ...newItem
    };

    data.push(itemToAdd);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(itemToAdd, { status: 201 });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
  }
}
