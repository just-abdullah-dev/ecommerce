import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqsData: FaqItem[] = [
  {
    question: "What type of fragrance is this?",
    answer:
      "We offer various types such as Eau de Parfum, Eau de Toilette, Attar (oil-based), and alcohol-free options.",
  },
  {
    question: "How should I store my perfume or attar?",
    answer:
      "Store in a cool, dry place away from direct sunlight to maintain the fragrance quality and longevity.",
  },
  {
    question: "Is this fragrance long-lasting?",
    answer:
      "Yes, our perfumes and attars are designed to last between 6 to 12 hours depending on skin type and weather.",
  },
  {
    question: "Are these perfumes suitable for both men and women?",
    answer:
      "We have a wide range of fragrances including masculine, feminine, and unisex options to suit every preference.",
  },
  {
    question: "What are the shipping options and delivery charges?",
    answer:
      "We offer standard and express shipping across Pakistan. Delivery charges vary by location and order size.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "Returns are accepted within 7 days if the product is unopened and unused. Exchanges are available for damaged or incorrect items.",
  },
];

const FaqContent = () => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Frequently asked questions
      </h3>
      <Accordion type="single" collapsible>
        {faqsData.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx + 1}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqContent;
