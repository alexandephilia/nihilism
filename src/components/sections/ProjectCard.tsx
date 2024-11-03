import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Project {
  title: string;
  description: string;
  content: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage: string;
  minHeight?: string;
}

interface ProjectCardProps {
  index: number;
  project: Project;
}

export const ProjectCard = ({ index, project }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Adjust scroll animation values for better viewport visibility
  const blurValue = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      requestAnimationFrame(() => {
        setPosition({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 800 + (index * 150));

    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1200 + (index * 150));

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [index]);

  // Animation variants for the project card
  // hidden: Initial state - card is invisible, shifted down, and blurred
  // visible: Final state - card fades in, moves up, and becomes clear
  // Used with Framer Motion's variants prop for smooth transitions
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20, // Start 20px below final position
      filter: "blur(10px)", // Initial blur effect
    },
    visible: {
      opacity: 1,
      y: 0, // Move to final position
      filter: "blur(0px)", // Remove blur
      transition: {
        duration: 0.5, // Animation takes 0.5 seconds
      },
    },
  } as const; // Type assertion for better type safety

  return (
    <motion.div
      ref={cardRef}
      style={{ 
        filter: blurValue,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden group transition-all duration-500 ease-out dark:bg-transparent bg-black/[0.02]"
        style={{
          minHeight: project.minHeight || '300px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-500"
          style={{ 
            backgroundImage: `url(${project.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: imageLoaded ? (isHovered ? 0.8 : 0.6) : 0,
            filter: isHovered ? 'brightness(0.9)' : 'brightness(0.85) blur(1px)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          }}
        />

        <img src={project.backgroundImage} alt="" className="hidden" onLoad={() => setImageLoaded(true)} />

        {/* Dark overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t dark:from-black/80 dark:to-black/40 from-black/85 to-black/50 transition-all duration-500 ${isHovered ? 'opacity-20' : 'opacity-25'}`} />

        {/* Updated Content section with blur effects */}
        <div className="relative z-20 h-full flex flex-col flex-1 p-5">
          <div 
            className={`space-y-1 transition-all duration-700`}
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: `translateY(${contentVisible ? 0 : -20}px)`,
              filter: `blur(${contentVisible ? 0 : 4}px)`
            }}
          >
            <h3 className="text-lg font-semibold text-black dark:text-foreground">{project.title}</h3>
            <p className="text-sm text-black/80 dark:text-foreground/90">{project.description}</p>
          </div>
          
          <div 
            className={`mt-3 flex-1 flex flex-col justify-between transition-all duration-700`}
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: `translateY(${contentVisible ? 0 : 20}px)`,
              filter: `blur(${contentVisible ? 0 : 4}px)`
            }}
          >
            <p className="text-sm text-black dark:text-foreground/80 line-clamp-3">
              {project.content}
            </p>
            <Button 
              data-magnetic="true"
              className="mt-4 w-fit text-sm py-1 h-8 transition-all duration-300 hover:blur-[2px]"
              variant="secondary"
              {...(project.buttonLink && { as: 'a', href: project.buttonLink })}
            >
              {project.buttonText || 'Learn More'}
            </Button>
          </div>
        </div>

        {/* Hover effect */}
        {isHovered && (
          <div 
            className="absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};