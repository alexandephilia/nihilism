import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/statusbadge";
import { SiCardano } from "react-icons/si";
import { Linkedin, Mail, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        
        <div className="rounded-full bg-muted/50 p-2.5 hover:blur-sm hover:scale-105 transition-all duration-300 group">
          <img 
            src={profileImage}
            alt="Profile memoji"
            className="h-28 w-28 rounded-full opacity-0 animate-[fadeInBlur_0.8s_ease_forwards] profile-image"
          />
        </div>
        
        <div className="space-y-4">
        <h1 className="text-[2rem] md:text-[3.3rem] font-bold group hover:blur-[2px] transition-all duration-300 -mb-3">
            {typeof name === 'string' ? name.split("").map((letter, index) => (
              <span 
                key={index}
                className="font-mono inline-block hover:animate-wave transition-all duration-300 group-hover:animate-wave touch-none"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: "forwards"
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            )) : name}
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[650px] animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            {title}<br />
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