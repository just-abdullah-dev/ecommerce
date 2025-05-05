import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function SupportPage() {
  const faqItems = [
    {
      question: "How do I create a new invoice?",
      answer:
        'To create a new invoice, go to the Invoices section from the dashboard, click on "New Invoice", fill in the customer details and line items, then click "Save" or "Send" to finalize the invoice.',
    },
    {
      question: "Can I track expenses for multiple companies?",
      answer:
        "Yes, Nigotis allows you to manage multiple companies. You can switch between companies from the settings menu and track expenses, income, and other financial data separately for each company.",
    },
    {
      question: "How do I generate financial reports?",
      answer:
        'Navigate to the Reports section in the dashboard. Here you can select from various report types such as Profit & Loss, Balance Sheet, or Cash Flow. Choose your desired date range and click "Generate Report" to view and download your financial statements.',
    },
    {
      question: "How can I add a new employee to the system?",
      answer:
        'To add a new employee, go to the Employees section and click on "Add Employee"Fill in the required information such as name, contact details, position, and salary information. You can also set up payroll details and access permissions for the new employee in this section.',
    },
    {
      question: "How do I record a new expense?",
      answer:
        'To record a new expense, navigate to the Expenses section and click "Add Expense"Enter the expense details including date, amount, category, and attach any relevant receipts or documents. You can also assign the expense to a specific project or department if needed.',
    },
    {
      question: "Can I customize invoice templates?",
      answer:
        "Yes, Nigotis offers customizable invoice templates. Go to Settings > Invoice Templates to create or edit templates. You can add your company logo, change colors, and modify the layout to match your brand. These templates can then be selected when creating new invoices.",
    },
    {
      question: "How do I set up recurring invoices for regular clients?",
      answer:
        'To set up recurring invoices, go to the Invoices section and select "Create Recurring Invoice"Choose the client, set the frequency (e.g., monthly, quarterly), start date, and end date if applicable. Fill in the invoice details as you would for a regular invoice. Nigotis will automatically generate and send these invoices based on your specified schedule.',
    },
    {
      question: "How can I track the depreciation of company assets?",
      answer:
        "To track asset depreciation, go to the Assets section and add your company assets with their initial value and purchase date. Nigotis allows you to set up depreciation methods (straight-line, reducing balance, etc.) for each asset. The system will automatically calculate and record depreciation over time, which will be reflected in your financial reports.",
    },
    {
      question: "How do I process payroll for my employees?",
      answer:
        "To process payroll, navigate to the Payroll section. Nigotis will use the employee information and salary details you've set up to calculate wages, taxes, and deductions. Review the calculated payroll, make any necessary adjustments, and then approve it. You can then generate pay slips and process payments directly through the system.",
    },
    {
      question:
        "Can Nigotis integrate with my bank accounts for real-time transaction updates?",
      answer:
        "Yes, Nigotis offers bank feed integration. Go to Settings > Bank Connections and follow the prompts to securely connect your bank accounts. Once connected, Nigotis will automatically import and categorize your transactions, saving you time on manual data entry and ensuring your financial records are always up-to-date.",
    },
  ];

  return (
    <MainDashboardContentSkeleton title="Support">
      <div className="container mx-auto ">
        <p className="text-xl px-4 text-neutral-darkGray mb-8">
          Welcome to the Nigotis Support Center. How can we help you today?
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={`item-${index + 1}`}
                    value={`item-${index + 1}`}
                  >
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                We&apos;ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-10" />

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>support@nigotis.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <span>Live chat available 9 AM - 5 PM EST</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Explore our user guides and tutorials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/docs/getting-started">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Getting Started Guide
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/docs/features">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Feature Documentation
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/docs/api">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  API Reference
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Check the current status of Nigotis services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Invoicing System</span>
                  <span className="text-green-500 font-semibold">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expense Tracking</span>
                  <span className="text-green-500 font-semibold">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reporting Engine</span>
                  <span className="text-yellow-500 font-semibold">
                    Minor Outage
                  </span>
                </div>
                <Button variant="outline" className="w-full">
                  View Detailed Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Nigotis is a project of{" "}
            <a href="https://www.raqqamiyya.com/" className="underline">
              Raqqamiyya
            </a>
          </p>
          <p>© {new Date().getFullYear()} Nigotis. All rights reserved.</p>
        </footer>
      </div>
    </MainDashboardContentSkeleton>
  );
}
