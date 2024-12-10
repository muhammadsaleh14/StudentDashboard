"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Base Route */}
        <NavigationMenuItem>
          <Link href="/" className={navigationMenuTriggerStyle()}>
            Home
          </Link>
        </NavigationMenuItem>

        {/* Students Route */}
        <NavigationMenuItem>
          <Link href="/students" className={navigationMenuTriggerStyle()}>
            Students
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
