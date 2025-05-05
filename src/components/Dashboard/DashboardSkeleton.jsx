"use client";

import * as React from "react";
import {
  UsersRound,
  Banknote,
  Receipt,
  ReceiptText,
  Wallet,
  BadgeDollarSign,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  Menu,
  Building2,
  ChevronDown,
  Sparkles,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  House,
  Users,
  Grip,
  Search,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutBtn from "@/components/Utils/LogoutBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/contexts/user";
import InputComp from "../Utils/Input";
import useIsMobile from "@/hooks/useIsMobile";

const generalLinks = [
  {
    title: "Home",
    icon: House,
    variant: "ghost",
    href: "",
    role: "",
  },
  {
    title: "Products",
    icon: Grid2x2,
    variant: "ghost",
    href: "products",
    role: "sales",
  },
  {
    title: "Clients",
    icon: UsersRound,
    variant: "ghost",
    href: "clients",
    role: "sales",
  },
  {
    title: "Invoices",
    icon: ReceiptText,
    variant: "ghost",
    href: "invoices",
    role: "sales",
  },
  {
    title: "Employees",
    icon: UsersRound,
    variant: "ghost",
    href: "employees",
    role: "hr",
  },
  {
    title: "Income",
    icon: Banknote,
    variant: "ghost",
    href: "incomes",
    role: "finance",
  },
  {
    title: "Expenses",
    icon: Receipt,
    variant: "ghost",
    href: "expenses",
    role: "finance",
  },
  {
    title: "Assets",
    icon: Wallet,
    variant: "ghost",
    href: "assets",
    role: "finance",
  },
  {
    title: "Sub Accounts",
    icon: UsersRound,
    variant: "ghost",
    href: "sub-accounts",
    role: "admin",
  },
  {
    title: "Payrolls",
    icon: BadgeDollarSign,
    variant: "ghost",
    href: "payrolls",
    role: "hr",
  },
  {
    title: "Reports",
    icon: BarChart3,
    variant: "ghost",
    href: "reports",
    role: "finance",
  },
  {
    title: "Nigotis AI",
    icon: Sparkles,
    variant: "ghost",
    href: "nigotis-ai",
    role: "admin",
  },
];

const supportLinks = [
  {
    title: "Notifications",
    icon: Bell,
    variant: "ghost",
    href: "/notifications",
    role: "admin",
  },
  {
    title: "Support",
    icon: HelpCircle,
    variant: "ghost",
    href: "/support",
    role: "",
  },
  {
    title: "Settings",
    icon: Settings,
    variant: "ghost",
    href: "/settings",
    role: "admin",
  },
];

const dashboardLinks = [
  {
    title: "Create New Invoice",
    link: "invoices/new",
    desc: "Generate and send professional invoices quickly",
  },
  {
    title: "Add Business Expense",
    link: "expenses/new",
    desc: "Record and categorize various business expenses efficiently",
  },
  {
    title: "Register Company Asset",
    link: "assets/new",
    desc: "Log and track new company assets and equipment",
  },
  {
    title: "Record Additional Income",
    link: "incomes/new",
    desc: "Document miscellaneous income and revenue streams",
  },
  {
    title: "View Profit & Loss",
    link: "reports/profit-and-loss",
    desc: "Analyze comprehensive profit and loss statement for insights",
  },
  {
    title: "Check Balance Sheet",
    link: "reports/balance-sheet",
    desc: "Review detailed balance sheet for financial position",
  },
  {
    title: "Check Open Invoices Sheet",
    link: "reports/open-invoices",
    desc: "See over due or all open invoices.",
  },
  {
    title: "Explore Nigotis AI",
    link: "nigotis-ai",
    desc: "Leverage AI-powered analytics for strategic business decisions",
  },
  {
    title: "Add New Client",
    link: "clients/new",
    desc: "Register and manage new client information seamlessly",
  },
  {
    title: "Onboard New Employee",
    link: "employees/new",
    desc: "Streamline the process of adding new team members",
  },
  {
    title: "Setup Employee Payroll",
    link: "employees",
    desc: "Configure and customize employee payroll systems",
  },
  {
    title: "Process Payroll Payments",
    link: "payrolls/new",
    desc: "Execute and manage employee payment transactions securely",
  },
];

const searchLinks = [
  {
    title: "Create New Invoice",
    link: "invoices/new",
    desc: "Generate and send professional invoices quickly",
    seeAll: "invoices",
    edit: "invoices",
    tags: ["invoice", "billing", "create", "new"],
  },
  {
    title: "Add Business Expense",
    link: "expenses/new",
    desc: "Record and categorize various business expenses efficiently",
    seeAll: "expenses",
    edit: "expenses",
    tags: ["expense", "finance", "business", "record"],
  },
  {
    title: "Register Company Asset",
    link: "assets/new",
    desc: "Log and track new company assets and equipment",
    seeAll: "assets",
    edit: "assets",
    tags: ["asset", "equipment", "company", "register"],
  },
  {
    title: "Record Additional Income",
    link: "incomes/new",
    desc: "Document miscellaneous income and revenue streams",
    seeAll: "incomes",
    edit: "incomes",
    tags: ["income", "revenue", "finance", "record"],
  },
  {
    title: "View Profit & Loss",
    link: "reports/profit-and-loss",
    desc: "Analyze comprehensive profit and loss statement for insights",
    tags: ["report", "profit", "loss", "finance"],
  },
  {
    title: "Check Balance Sheet",
    link: "reports/balance-sheet",
    desc: "Review detailed balance sheet for financial position",
    tags: ["report", "balance", "sheet", "finance"],
  },
  {
    title: "Check Open Invoices Sheet",
    link: "reports/open-invoices",
    desc: "See overdue or all open invoices.",
    tags: ["report", "invoice", "open", "finance"],
  },
  {
    title: "Explore Nigotis AI",
    link: "nigotis-ai",
    desc: "Leverage AI-powered analytics for strategic business decisions",
    tags: ["AI", "analytics", "business", "strategy"],
  },
  {
    title: "Add New Client",
    link: "clients/new",
    desc: "Register and manage new client information seamlessly",
    seeAll: "clients",
    edit: "clients",
    tags: ["client", "customer", "manage", "add"],
  },
  {
    title: "Onboard New Employee",
    link: "employees/new",
    desc: "Streamline the process of adding new team members",
    seeAll: "employees",
    edit: "employees",
    tags: ["employee", "team", "onboard", "add"],
  },
  {
    title: "Setup Employee Payroll",
    link: "employees",
    desc: "Configure and customize employee payroll systems",
    tags: ["payroll", "salary", "employee", "setup"],
  },
  {
    title: "Process Payroll Payments",
    link: "payrolls/new",
    desc: "Execute and manage employee payment transactions securely",
    seeAll: "payrolls",
    edit: "payrolls",
    tags: ["payroll", "payment", "employee", "process"],
  },
  {
    title: "Settings",
    link: "settings",
    desc: "Manage account and system settings",
    seeAll: null,
    edit: null,
    tags: ["settings", "account", "system", "manage"],
  },
  {
    title: "Profile",
    link: "profile",
    desc: "View and edit personal profile",
    seeAll: null,
    edit: "profile",
    tags: ["profile", "personal", "view", "edit"],
  },
  {
    title: "Notifications",
    link: "notifications",
    desc: "Check recent alerts and updates",
    seeAll: null,
    edit: null,
    tags: ["notifications", "alerts", "updates", "view"],
  },
  {
    title: "Home",
    link: "dashboard/home",
    desc: "Go to dashboard homepage",
    seeAll: null,
    edit: null,
    tags: ["home", "dashboard", "main", "start"],
  },
  {
    title: "Reports (Main)",
    link: "reports",
    desc: "Access all major report types",
    seeAll: null,
    edit: null,
    tags: ["report", "main", "summary", "overview"],
  },
  {
    title: "Reports - AR Aging Summary",
    link: "reports/ar-aging-summary",
    desc: "Detailed account receivables aging summary",
    seeAll: null,
    edit: null,
    tags: ["report", "aging", "summary", "AR"],
  },
];

function Sidebar({ className, user }) {
  let pathname = usePathname();
  pathname = pathname.split("/")[2];

  return (
    <div className=" bg-gray-300/60 h-full  ">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex-shrink-0 mx-auto mt-2">
          <Image
            src="/portal/logo-trans.png"
            alt="Nigotis"
            width={120}
            height={40}
            priority
          />
        </Link>
      </div>

      <div className={cn("pb-32", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">General</h2>
            <div className="space-y-3 ">
              {generalLinks.map((link) => {
                const isAllowed = link.role === "";
                if (
                  link.role === user?.role ||
                  isAllowed ||
                  user?.role === "admin"
                ) {
                  return (
                    <Button
                      key={link.title}
                      variant={link.variant}
                      active={`${
                        pathname ? pathname === link.href : link.href === ""
                      }`}
                      className="w-full justify-start shadow-md"
                      asChild
                    >
                      <a href={`/dashboard/${link.href}`}>
                        <link.icon className="mr-2 h-4 w-4" />
                        <span className="inline-flex">{link.title}</span>
                      </a>
                    </Button>
                  );
                }
              })}
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">Support</h2>
            <div className="space-y-3">
              {supportLinks.map((link) => {
                const isAllowed = link.role === "";
                if (
                  link.role === user?.role ||
                  isAllowed ||
                  user?.role === "admin"
                ) {
                  return (
                    <Button
                      variant={link.variant}
                      active={`${"/" + pathname === link.href}`}
                      key={link.title}
                      className="w-full justify-start shadow-md"
                      asChild
                    >
                      <a href={`/dashboard${link.href}`}>
                        <link.icon className="mr-2 h-4 w-4" />
                        <span className="inline-flex">{link.title}</span>
                        
                      </a>
                    </Button>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>

      <div className=" py-2 px-4 overflow-hidden fixed bottom-1 right-1 md:left-1 w-60 rounded-lg  bg-gradient flex items-center justify-between gap-2">
        {user?.personalInfo?.avatar ? (
          <Image
            width={60}
            height={60}
            src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${user?.personalInfo?.avatar}`}
            className=" aspect-square rounded-full w-12"
          />
        ) : (
          <User2 size={34} className=" " />
        )}
        <div className=" h-full w-32 ">
          <h1 className=" font-medium text-sm ">
            {[user?.personalInfo?.title, user?.personalInfo?.firstName].join(
              " "
            )}
          </h1>
          <p className=" text-[11px]">{user?.email}</p>
        </div>
        <DropdownMenu className="w-12 p-0 m-0 ">
          <DropdownMenuTrigger className=" ">
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <LogoutBtn>
              <DropdownMenuItem className=" text-red-500 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </LogoutBtn>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DashboardSkeleton({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isOptionsGridOpen, setIsOptionsGridOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const isMoblie = useIsMobile();

  const filteredLinks = React.useMemo(() => {
    if (!searchQuery.trim()) return [];

    return searchLinks
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
      .slice(0, isMoblie ? 2 : 6);
  }, [searchQuery]);

  const user = useUser();
  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <div
        className={`${
          !isMenuOpen ? "md:block md:w-64" : "md:hidden"
        } hidden fixed h-screen top-0 left-0 z-50 `}
      >
        {user && (
          <Sidebar
            user={user}
            className={" overflow-auto custom-scrollbar h-full"}
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden fixed z-[100] bg-white top-6 left-2"
          >
            <Menu /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <Sidebar
            user={user}
            className={" overflow-auto custom-scrollbar h-full"}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      {user && (
        <div
          className={`${
            isMenuOpen ? "md:ml-0" : "md:ml-64"
          } flex-1 bg-gray-200/30 overflow-auto relative`}
        >
          <div
            className="fixed opacity-50 -z-20 w-full h-full"
            style={{
              backgroundImage: "url('/assets/bg2.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "150px 300px", // Adjust this size to control the zoom level
              backgroundPosition: "top left", // Optional: ensures alignment
            }}
          ></div>
          {/* header  */}
          <div className="h-20" />
          <div
            className={`flex items-center gap-2 py-2 z-[50] px-2 md:px-6 justify-between fixed ${
              isMenuOpen ? "w-full" : "w-full md:w-[calc(100%-256px)]"
            } top-0 bg-white`}
          >
            <div className="flex items-center gap-2">
              <div
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`${
                  isMenuOpen ? "flex-row-reverse" : "flex-row"
                } opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto mr-10 md:m-0 flex items-center cursor-pointer `}
              >
                {!isMenuOpen ? <ChevronLeft /> : <ChevronRight />}{" "}
                <AlignJustify />
              </div>
              <Link href="/" className=" ">
                {"company?.logo" && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${"company?.logo"}`}
                    alt="company-logo"
                    width={70}
                    height={70}
                    priority
                    className="aspect-auto"
                  />
                )}
              </Link>
              <h1 className="font-medium text-lg md:text-2xl">
                {"company?.displayName"}
              </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6   ">
              <Link className="hidden md:block" href={"/dashboard/support"}>
                <HelpCircle className="  m-1" />
              </Link>
              <div
                onMouseEnter={() => setIsOptionsGridOpen(true)}
                onMouseLeave={() => setIsOptionsGridOpen(false)}
                className="relative group"
              >
                <Grip className=" cursor-pointer m-1" />
                <div
                  className={`${
                    isOptionsGridOpen
                      ? "opacity-100 pointer-events-auto "
                      : "opacity-0 pointer-events-none"
                  }  duration-300 transition-opacity w-[90vw] md:w-[1000px] h-[130vw] overflow-y-scroll md:h-fit  absolute top-7 z-[100] -right-8 md:right-0`}
                >
                  <Card className=" ">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-2">
                        {dashboardLinks.map((link, index) => (
                          <Link
                            key={index}
                            href={`/dashboard/${link.link}`}
                            className=" hover:bg-gray-300/40 duration-200 transition-all py-2 px-4 rounded-lg"
                          >
                            <h1 className="font-semibold text-left hover:underline">
                              {link.title}
                            </h1>
                            <p className="text-sm text-gray-500  mt-1 text-left">
                              {link.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div
                onMouseEnter={() => {
                  setIsSearchOpen(true);
                  setSearchQuery("");
                }}
                onMouseLeave={() => setIsSearchOpen(false)}
                className="relative group"
              >
                <Search className=" cursor-pointer m-1" />
                <div
                  className={`${
                    isSearchOpen
                      ? "opacity-100 pointer-events-auto "
                      : "opacity-0 pointer-events-none"
                  }  duration-300 transition-opacity w-[90vw] md:w-[700px] h-fit  absolute top-7 z-[100] right-0`}
                >
                  <Card className=" ">
                    <CardContent className="p-6">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <InputComp
                          type="text"
                          placeholder="Search dashboard links..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="py-4" />
                      {searchQuery.trim() !== "" && (
                        <div className="grid gap-4 md:grid-cols-2">
                          {filteredLinks.map((item, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                                <CardDescription>{item.desc}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="secondary" asChild>
                                    <a href={`/dashboard/${item.link}`}>New</a>
                                  </Button>
                                  {item?.seeAll && (
                                    <Button variant="secondary" asChild>
                                      <a href={`/dashboard/${item?.seeAll}`}>
                                        See All
                                      </a>
                                    </Button>
                                  )}
                                  {item?.edit && (
                                    <Button variant="secondary" asChild>
                                      <a href={`/dashboard/${item?.edit}`}>
                                        Edit
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      {searchQuery.trim() !== "" &&
                        filteredLinks.length === 0 && (
                          <p className="text-center text-gray-500">
                            No results found.
                          </p>
                        )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              {user?.role === "admin" && (
                <Link className="hidden md:block" href={"/dashboard/settings"}>
                  <Settings className=" m-1" />
                </Link>
              )}
            </div>
          </div>
          <main className="p-2 md:p-6 text-sm md:text-base">{children}</main>
        </div>
      )}
    </div>
  );
}
