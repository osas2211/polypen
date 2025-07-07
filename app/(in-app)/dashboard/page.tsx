"use client"
import { Filter, Plus, Search } from "lucide-react"
import React from "react"
import { Separator } from "@radix-ui/react-separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarMenuAction, useSidebar } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DocumentGrid from "@/components/document-grid"

const data = [
  {
    id: 1,
    title: "AI article writer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ut,",
  },
  {
    id: 1,
    title: "AI article writer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ut,",
  },
  {
    id: 1,
    title: "AI article writer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ut,",
  },
  {
    id: 1,
    title: "AI article writer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ut,",
  },
  {
    id: 1,
    title: "AI article writer",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ut,",
  },
]

const DashboardPage = () => {
  const { isMobile } = useSidebar()

  return (
    <div>
      <div className="!max-w-[1440px] !mx-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All documents</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                My Documents
              </h1>
              <p className="text-slate-600">
                Create, edit, and organize your content
              </p>
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800">
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                className="pl-10 border-slate-200 focus:border-slate-400 h-[45px]"
              />
            </div>
            <Button variant="outline" size="sm" className="h-[45px]">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div>
            <DocumentGrid />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
