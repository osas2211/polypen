"use client"
import { Filter, Plus, Search } from "lucide-react"
import React, { useState } from "react"
import { Separator } from "@radix-ui/react-separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DocumentGrid from "@/components/document-grid"
import AddDocumentDialog from "@/components/add-document-dialog"
import ConnectWalletButton from "@/components/connect-wallet"

const DashboardPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleDocumentCreated = (document: any) => {
    console.log("New document created:", document)
    // Here you would typically add the document to your state/database
  }
  return (
    <div>
      <div className="!max-w-[1440px] !mx-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 justify-between w-full">
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
            <ConnectWalletButton />
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
            <Button
              className="bg-slate-900 hover:bg-slate-800"
              onClick={() => setIsAddDialogOpen(true)}
            >
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
      <AddDocumentDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        onDocumentCreated={handleDocumentCreated}
      />
    </div>
  )
}

export default DashboardPage
