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
      title: "Vercel Deployments",
      description: "Deployments on Vercel",
      content: "A collection of projects deployed on Vercel.",
      buttonText: "View Projects",
      buttonLink: "https://vercel.com/garryalexander",
      backgroundImage: "https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F5Q6iTwx2CBd0pFrD9vzZWK%2Fe537e396e236e5daa54a31ff7056a77d%2Fpapercuts-dark.png&w=1920&q=75"
    },
    {
      title: "Radix UI",
      description: "Radix UI Components",
      content: "A collection of components, color schemes and themes built with Radix UI.",
      buttonText: "View Components",
      buttonLink: "https://www.radix-ui.com/primitives",
      backgroundImage: "https://i.ytimg.com/vi/1JnwJBtg4VA/maxresdefault.jpg"
    },
    {
      title: "Open AI Playground",
      description: "Open AI API",
      content: "A collection of projects using the Open AI API.",
      buttonText: "View Projects",
      buttonLink: "https://github.com/garryalexander/openai-api",
      backgroundImage: "https://imgsrv2.voi.id/EEVXh73-DLqvWq2Co3ElTqup4eEeZl_YEDKP1ZsMyhI/auto/1280/853/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy8zODU4MDkvMjAyNDA1MzEwODU3LW1haW4uY3JvcHBlZF8xNzE3MTIwNjc5LmpwZWc.jpg"
    },
    {
      title: "Shadcn UI",
      description: "Shadcn UI Components",
      content: "A collection of components built with Shadcn UI.",
      buttonText: "View Components",
      buttonLink: "https://ui.shadcn.com/",
      backgroundImage: "https://mwskwong.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fq95r71b1uue1%2F4GK6beoMEqbAKNCuSn3Ekp%2F9ce62f182cb9502c3ea28b12066c898c%2Fshadcn_ui_OG_Image.png&w=3840&q=75"
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