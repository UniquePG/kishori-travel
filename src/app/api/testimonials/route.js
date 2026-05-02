import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DUMMY_TESTIMONIALS } from '@/constants';

const dataFilePath = path.join(process.cwd(), 'data', 'testimonials.json');

const getTestimonialsData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(DUMMY_TESTIMONIALS, null, 2));
      return DUMMY_TESTIMONIALS;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading testimonials data:', error);
    return DUMMY_TESTIMONIALS;
  }
};

export async function GET() {
  const data = getTestimonialsData();
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const newItem = await request.json();
    const data = getTestimonialsData();
    
    const itemToAdd = {
      id: Date.now().toString(),
      ...newItem
    };

    data.push(itemToAdd);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(itemToAdd, { status: 201 });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
  }
}
