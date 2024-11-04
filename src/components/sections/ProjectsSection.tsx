import { ProjectCard } from "./ProjectCard";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface Project {
  title: string;
  description: string;
  content: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage: string;
}

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const blurFilter = useTransform(
    smoothProgress,
    [0, 0.2, 0.8, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      filter: "blur(10px)",
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
      },
    },
  };

  const projects: Project[] = [
    {
      title: "UI Component Kit",
      description: "Modern React component collection",
      content: "A comprehensive library of customizable React components built with TypeScript and styled using Tailwind CSS.",
      buttonText: "View Library",
      buttonLink: "https://ui-components.example.com",
      backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Crypto Dashboard",
      description: "Live cryptocurrency market analysis",
      content: "A real-time cryptocurrency dashboard offering live price tracking, portfolio management, and detailed charting tools.",
      buttonText: "View Demo",
      buttonLink: "https://crypto-dash.example.com",
      backgroundImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Social Recipe App",
      description: "Community-focused cooking and recipes",
      content: "A social platform for cooking enthusiasts to share and discover recipes, discuss cooking techniques, and showcase culinary creations.",
      buttonText: "Start Cooking",
      buttonLink: "https://recipe-social.example.com",
      backgroundImage: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Virtual Event",
      description: "Interactive platform for online events",
      content: "A virtual event platform enabling live streaming, interactive breakout rooms, and networking functionalities.",
      buttonText: "Join Event",
      buttonLink: "https://virtual-events.example.com",
      backgroundImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      className="container py-16"
      style={{
        filter: blurFilter
      }}
    >
      {/* Section header */}
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">Some of my recent work</p>
      </div>

      {/* Projects grid */}
      <motion.div 
        className="grid md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} index={index} project={project} />
        ))}
      </motion.div>
    </motion.section>
  );
};