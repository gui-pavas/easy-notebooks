"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpenText, ChevronRight, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

type NotebookNavItem = {
  id: string;
  name: string;
};

type AppSidebarProps = {
  notebooks: NotebookNavItem[];
};

export default function AppSidebar({ notebooks }: AppSidebarProps) {
  const pathname = usePathname();
  const isNotebookRoute = notebooks.some((notebook) => pathname === `/${notebook.id}`);
  const [isNotebooksOpen, setIsNotebooksOpen] = React.useState(isNotebookRoute);

  React.useEffect(() => {
    if (isNotebookRoute) {
      setIsNotebooksOpen(true);
    }
  }, [isNotebookRoute]);

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-sidebar-border border-b">
        <p className="px-2 py-1 text-sm font-semibold">Easy Notebooks</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <House />
                    <span>All Notebooks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible
                asChild
                open={isNotebooksOpen}
                onOpenChange={setIsNotebooksOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <BookOpenText />
                      <span>Notebooks</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {notebooks.length === 0 ? (
                        <SidebarMenuSubItem>
                          <span className="text-muted-foreground px-2 py-1 text-xs">No notebooks yet</span>
                        </SidebarMenuSubItem>
                      ) : (
                        notebooks.map((notebook) => (
                          <SidebarMenuSubItem key={notebook.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === `/${notebook.id}`}
                            >
                              <Link href={`/${notebook.id}`}>
                                <span>{notebook.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
