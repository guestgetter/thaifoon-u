"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, BookOpen, FileText, Award, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BookOpen },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "SOPs", href: "/sops", icon: FileText },
  { name: "Quizzes", href: "/quizzes", icon: Award },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === "ADMIN"
  const isManager = session?.user?.role === "MANAGER" || isAdmin

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/dashboard" className="-m-1.5 p-1.5">
            <span className="sr-only">Thaifoon University</span>
            <Image
              className="h-10 w-auto"
              src="/logo.png"
              alt="Thaifoon University"
              width={120}
              height={40}
            />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-black transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
          {isManager && (
            <Link
              href="/admin"
              className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 hover:text-black transition-colors"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {session?.user && (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center gap-x-2"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="-m-1.5 p-1.5">
                <span className="sr-only">Thaifoon University</span>
                <Image
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Thaifoon University"
                  width={96}
                  height={32}
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                  {isManager && (
                    <Link
                      href="/admin"
                      className="-mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Admin
                    </Link>
                  )}
                </div>
                {session?.user && (
                  <div className="py-6">
                    <div className="flex items-center gap-x-3 px-3 py-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-base font-semibold text-gray-900">
                        {session.user.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => signOut()}
                      className="-mx-3 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}