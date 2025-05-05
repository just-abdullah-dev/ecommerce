"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  MoreVertical,
  SendHorizonal,
  Sparkles,
} from "lucide-react";
import InputComp from "@/components/Utils/Input";
import { AnalyticsModal } from "./AnalyticsModal";
import { PrevChats } from "./PrevChats";
import MainDashboardContentSkeleton from "@/components/Utils/MainDashboardContentSkeleton";

export default function NigotisAI() {
  const [inputValue, setInputValue] = useState("");
  const [showPreviousChats, setShowPreviousChats] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const suggestions = [
    {
      id: 1,
      text: "ANALYZE MY BUSINESS",
    },
    {
      id: 2,
      text: "HOW TO GET MORE SALES FROM CURRENT INVENTORY",
    },
    {
      id: 3,
      text: "HOW TO MANAGE MY EXPENSES",
    },
    {
      id: 4,
      text: "PROVIDE ME A MARKETING STRATEGY",
    },
    {
      id: 5,
      text: "WHICH PRODUCT HAS RECORD SALES LAST MONTH",
    },
    {
      id: 6,
      text: "WHICH OF THE PRODUCTS IN MY INVENTORY NEED ATTENTION",
    },
  ];

  const quickQuestions = [
    "How can I track employee performance?",
    "What's my current cash flow status?",
    "Generate monthly financial report",
    "Analyze my customer payment trends",
  ];

  const handleSuggestionClick = (text) => {
    setInputValue(text);
  };

  const handleTabChange = (value) => {
    if (value === "previous") {
      setShowPreviousChats(true);
    } else if (value === "analytics") {
      setShowAnalytics(true);
    }
  };

  return (
    <MainDashboardContentSkeleton title="Nigotis AI">
      <div className="flex items-center gap-2 absolute top-4 right-4">
        <Button>
          <PlusCircle className="h-5 w-5" />
          <span className="s-only">New Chat</span>
        </Button>
        <Button variant="ghost">
          <MoreVertical className="h-10 w-10" />
          <span className="sr-only">More options</span>
        </Button>
      </div>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="container">
            <Tabs
              defaultValue="chat"
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                <TabsTrigger
                  className=" border-b-2 hover:border-primary-teal rounded-none bg-transparent  border-transparent "
                  value="chat"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger
                  className=" border-b-2 hover:border-primary-teal rounded-none bg-transparent "
                  value="previous"
                >
                  Previous Chats
                </TabsTrigger>
                <TabsTrigger
                  className=" border-b-2 hover:border-primary-teal rounded-none bg-transparent "
                  value="analytics"
                >
                  Request Analytics report
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        <main className="flex-1 container py-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">
              Let Nigotis AI help your business grow
            </h2>
            <p className="text-muted-foreground text-sm">
              Ask Nigotis AI anything about your business. It would provide you
              your business analysis and the marketing strategy to grow your
              business beyond the boundaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                className="h-auto py-3 px-5 text-left"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                {suggestion.text}
              </Button>
            ))}
          </div>

          <div className="max-w-5x mx-auto space-y-4">
            <div className="relative">
              <InputComp
                placeholder="ASK ANYTHING"
                className="w-full py-6 rounded-full pr-8 pl-20 border-2 border-primary-teal outline-none relative"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <SendHorizonal className=" absolute top-[14px] text-primary-teal right-8" />
              <Sparkles className=" absolute top-[14px] text-primary-teal left-8" />
            </div>

            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSuggestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </main>

        <PrevChats
          open={showPreviousChats}
          onOpenChange={setShowPreviousChats}
        />

        <AnalyticsModal open={showAnalytics} onOpenChange={setShowAnalytics} />
      </div>
    </MainDashboardContentSkeleton>
  );
}
