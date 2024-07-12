import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "./_components/menu-icon";
import { NavLink } from "./_components/nav-link";
import Link from "next/link";

export default function Nav() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#", label: "Resources" },
    { href: "#", label: "Users" },
  ];

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <h1 className="text-lg font-semibold">Usergate</h1>
            <span className="sr-only">Usergate</span>
          </Link>
          <div className="grid gap-2 py-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <h1 className="text-lg font-semibold">Usergate</h1>
        <span className="sr-only">Usergate</span>
      </Link>
      <nav className="ml-auto hidden lg:flex gap-6">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
        <NavLink href="/auth/login">Login</NavLink>
      </nav>
    </header>
  );
}
