"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoadingDots = () => {
  const [dotCount, setDotCount] = useState(4);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        repeat: Infinity,
        duration: 1.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center justify-center bg-white max-h-[250px]">
      <motion.div
        className="flex space-x-4 text-7xl font-bold "
        variants={containerVariants}
        animate="animate"
      >
        {[...Array(dotCount)].map((_, index) => (
          <motion.span
            key={index}
            className=" bg-gradient-to-r from-primary-navy via-primary-teal to-primary-teal bg-clip-text text-transparent"
            variants={dotVariants}
          >
            •
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingDots;
