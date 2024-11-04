import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface ExperienceItem {
  date: string;
  title: string;
  company: string;
  description: string;
}

const experienceData: ExperienceItem[] = [
  {
    date: "2017 - 2021",
    title: "Quality Control in Software",
    company: "Full Time",
    description: "Specialized in implementing robust testing frameworks and quality assurance processes. Developed automated testing solutions and maintained high code quality standards."
  },
  {
    date: "2021 - Now",
    title: "Front End Developer",
    company: "Full Time", 
    description: "Built responsive web development using HTML, CSS, JavaScript. Bootstrap, React, Next.js and TypeScript. Implemented modern UI/UX designs and optimized performance."
  }
];

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
    layoutEffect: false
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const blurFilter = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Controls the delay between each child
        delayChildren: 0.3,   // Initial delay before starting the sequence
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 40, 
      opacity: 0, 
      filter: "blur(4px)",
      scale: 0.98
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        mass: 0.5
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      className="relative py-16"
      style={{
        opacity,
        filter: blurFilter,
        willChange: "transform"
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent opacity-90" />
      <h2 className="text-3xl font-bold text-center mb-12">Experience Timeline</h2>
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border hidden md:block" />
        
        <motion.div 
          className="space-y-8 md:space-y-12"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {experienceData.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              } items-center`}
            >
              <div className="w-full md:w-1/2 p-4">
                <Card className="hover:blur-[1px] transition-all duration-500">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};