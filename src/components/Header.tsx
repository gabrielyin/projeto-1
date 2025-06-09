'use client'

import { Button } from "@/components/ui/button";
import { FileText, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Cadastro } from "./cadastro";
import { Login } from "./login";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

export function Header() {
  const navItems = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Preços", href: "#pricing" },
    { name: "Sobre", href: "#about" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Precify</span>
        </div>
        
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Authenticated>
              <Link href={"/dashboard"}>
                <Button variant="default">Dashboard</Button>
              </Link>
            </Authenticated>
            <Unauthenticated>
              <Login>
                <Button variant="ghost">Sign In</Button>
              </Login>
              <Cadastro>
                <Button>Começar</Button>
              </Cadastro>
            </Unauthenticated>
          </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Unauthenticated>
                  <Button variant="ghost">Sign In</Button>
                  <Button>Começar</Button>
                </Unauthenticated>
                <Authenticated>
                  <Link href={"/dashboard"}>
                    <Button variant="default">Dashboard</Button>
                  </Link>
                </Authenticated>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}