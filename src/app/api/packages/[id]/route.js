import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "packages.json");

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    let packages = JSON.parse(data);
    
    const index = packages.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    packages[index] = { ...packages[index], ...body };
    await fs.writeFile(dataFilePath, JSON.stringify(packages, null, 2));
    
    return NextResponse.json(packages[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  
  try {
    const data = await fs.readFile(dataFilePath, "utf-8");
    let packages = JSON.parse(data);
    
    const initialLength = packages.length;
    packages = packages.filter(p => p.id !== id);
    
    if (packages.length === initialLength) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(packages, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
