"use client"
import {
  FileIcon,
  Forward,
  MoreHorizontal,
  NotebookPen,
  Trash2,
} from "lucide-react"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuAction, useSidebar } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
      <div className="mb-6 flex md:flex-row flex-col gap-4 md:items-center justify-between">
        <Input
          className="md:max-w-[380px] h-[45px]"
          placeholder="Search docs"
        />
        <Button className=" h-[45px]">+ Create Doc</Button>
      </div>
      <div className="mb-6 md:mb-10">
        <p className="mb-2 font-medium text-sm">Recently opened</p>
        <div className="grid md:grid-cols-4 gap-4 md:gap-7">
          {data.slice(0, 3).map((doc, index) => {
            return (
              <div
                key={index}
                className="w-full rounded-md border border-sidebar-border p-4 cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <NotebookPen size={18} className="text-lime-600" />

                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-accent px-1 rounded-sm cursor-pointer">
                      <MoreHorizontal size={16} />
                      <span className="sr-only">More</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <Link href={`/document/id`} className="!cursor-pointer">
                        <DropdownMenuItem>
                          <FileIcon className="text-muted-foreground" />
                          <span>View Doc</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Doc</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="!text-red-500">
                        <Trash2 className="text-red-500" />
                        <span>Delete Doc</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-6">
                  <p className="truncate font-medium">{doc.title}</p>
                  <p className="truncate text-sm">{doc.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="">
        <p className="mb-2 font-medium text-sm">All documents</p>
        <div className="grid md:grid-cols-4 gap-4 md:gap-7">
          {[...data, ...data, ...data].map((doc, index) => {
            return (
              <div
                key={index}
                className="w-full rounded-md border border-sidebar-border p-4 cursor-pointer hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <NotebookPen size={18} className="text-lime-600" />

                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-accent px-1 rounded-sm cursor-pointer">
                      <MoreHorizontal size={16} />
                      <span className="sr-only">More</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <Link href={`/document/id`} className="cursor-pointer">
                        <DropdownMenuItem>
                          <FileIcon className="text-muted-foreground" />
                          <span>View Doc</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Doc</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="!text-red-500">
                        <Trash2 className="text-red-500" />
                        <span>Delete Doc</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-6">
                  <p className="truncate font-medium">{doc.title}</p>
                  <p className="truncate text-sm">{doc.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
