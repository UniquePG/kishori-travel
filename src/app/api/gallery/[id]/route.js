import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'gallery.json');

const getGalleryData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading gallery data:', error);
    return [];
  }
};

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedData = await request.json();
    const data = getGalleryData();
    
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    data[index] = { ...data[index], ...updatedData };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json(data[index]);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    let data = getGalleryData();
    
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    data = data.filter(item => item.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
