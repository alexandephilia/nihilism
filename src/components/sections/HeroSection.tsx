import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/statusbadge";
import { SiCardano } from "react-icons/si";
import { motion } from "framer-motion"; // Add this import at the top
import { Linkedin, Mail, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react"; // Add this import

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface HeroSectionProps {
  name: string;
  title: React.ReactNode;
  subtitle: string;
  profileImage: string;
  socialLinks?: SocialLink[];
}

export const HeroSection = ({
  name,
  title,
  subtitle,
  profileImage,
  socialLinks = [
    {
      href: "https://linkedin.com/in/your-profile",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn"
    },
    {
      href: "mailto:0xnihilist@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      label: "Email"
    },
    {
      href: "resume.pdf",
      icon: <User className="h-5 w-5" />,
      label: "Resume"
    }
  ]
}: HeroSectionProps) => {
  const [isBlurred, setIsBlurred] = useState(false);

  return (
    <section className="container min-h-[70vh] pt-24 md:pt-32 pb-12 relative flex flex-col items-center justify-between">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] blur-[0.5px]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent opacity-90" />
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent opacity-90" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent opacity-90" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="flex items-center gap-2 mb-2 opacity-0 animate-[fadeInBlur_0.8s_ease_forwards] [animation-delay:300ms]">
          <StatusBadge 
            status="Working on"
            icon={<SiCardano className="h-4 w-4" />}
            text="Existence"
          />
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-800 dark:from-red-400 dark:to-purple-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <motion.div
            className="relative w-28 h-28 overflow-hidden rounded-full"
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              filter: "blur(16px)" 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: isBlurred ? "blur(2px)" : "blur(0px)" 
            }}
            transition={{ 
              duration: 1.2,
              ease: [0.6, -0.05, 0.01, 0.99],
              filter: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            whileHover={{ 
              filter: "blur(2px)",
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              setIsBlurred(true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              setIsBlurred(false);
            }}
            onPointerLeave={() => setIsBlurred(false)}
          >
            <img 
              src={profileImage}
              alt="Profile memoji"
              className="w-full h-full object-cover rounded-full"
              draggable="false"
            />
          </motion.div>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2">
            {name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-1">
            {title}
          </p>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-5 animate-fade-in-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
          {socialLinks.map((link, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-11 w-11 hover:blur-[2px] transition-all duration-300 bg-background/20"
                    onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
                  >
                    {link.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-sm">{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
     {/* Scroll indicator - now positioned below buttons */}
     <div className="mt-16 animate-bounce opacity-50 pointer-events-none">
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-foreground/20 rounded-full mt-2"></div>
          </div>
        </div>
    </section>
  );
}; 