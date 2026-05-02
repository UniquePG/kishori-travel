import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DUMMY_PACKAGES } from "@/constants";

const dataFilePath = path.join(process.cwd(), "data", "packages.json");

async function initDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (error) {
    // File doesn't exist, create it with dummy data
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(DUMMY_PACKAGES, null, 2));
  }
}

export async function GET() {
  await initDataFile();
  const data = await fs.readFile(dataFilePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request) {
  await initDataFile();
  const body = await request.json();
  
  const data = await fs.readFile(dataFilePath, "utf-8");
  const packages = JSON.parse(data);
  
  const newPackage = {
    ...body,
    id: Date.now().toString(),
  };
  
  packages.push(newPackage);
  await fs.writeFile(dataFilePath, JSON.stringify(packages, null, 2));
  
  return NextResponse.json(newPackage, { status: 201 });
}
