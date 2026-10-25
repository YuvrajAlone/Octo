import { NextResponse } from "next/server";

const demoProjects = [
  {
    id: "demo-1",
    name: "SaaS Landing Page",
    description: "A modern SaaS landing page with pricing and features.",
    version: 1,
    status: "completed",
    published: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "demo-2",
    name: "Personal Portfolio",
    description: "A minimalist portfolio for developers and designers.",
    version: 1,
    status: "completed",
    published: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-3",
    name: "E-commerce Website",
    description: "An online store with product listings and categories.",
    version: 1,
    status: "completed",
    published: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(demoProjects);
}
