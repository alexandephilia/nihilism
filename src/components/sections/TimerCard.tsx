import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Moon, Loader2, Globe2, Calendar } from "lucide-react";

interface LocationData {
    city: string;
    country: string;
    timezone: string;
    temp?: number;
    loading: boolean;
    error: string | null;
}

// Custom hook for location
const useLocation = () => {
    const [locationData, setLocationData] = useState<LocationData>({
        city: "",
        country: "",
        timezone: "",
        loading: true,
        error: null
    });

    useEffect(() => {
        const getLocation = async () => {
            try {
                // Get location data
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.reason || 'Failed to get location');
                }

                // Get weather data
                const weatherResponse = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current_weather=true`
                );
                const weatherData = await weatherResponse.json();

                setLocationData({
                    city: data.city || "Unknown",
                    country: data.country_code || "",
                    timezone: data.timezone || "",
                    temp: weatherData.current_weather?.temperature,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Location error:', error);
                setLocationData({
                    city: "Unknown",
                    country: "",
                    timezone: "",
                    loading: false,
                    error: error instanceof Error ? error.message : "Location error"
                });
            }
        };

        getLocation();
    }, []);

    return locationData;
};

export const TimerCard = () => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [currentTime, setCurrentTime] = useState(new Date());
    const { city, country, timezone, temp, loading, error } = useLocation();

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

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
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time for display
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedHours = hours.toString().padStart(2, '0');

        return {
            time: `${formattedHours}:${minutes}:${seconds}`,
            period
        };
    };

    // Format date - This already uses real current date
    const formatDate = (date: Date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayName = days[date.getDay()];     // Gets current day
        const monthName = months[date.getMonth()]; // Gets current month
        const dayNum = date.getDate();           // Gets current date

        return `${dayName}, ${monthName} ${dayNum}`;
    };

    // Get week number - This calculates the real current week
    const getWeekNumber = (date: Date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const generateProgressBars = () => {
        const totalBars = 60;
        const currentSecond = currentTime.getSeconds();

        return (
            <div className="flex w-full space-x-0.5">
                {Array.from({ length: totalBars }).map((_, index) => {
                    const isActive = index <= currentSecond;
                    const isCurrentBar = index === currentSecond;
                    const delay = index * 0.03;

                    return (
                        <div
                            key={index}
                            className={`
                                h-1 flex-1 rounded-full transition-colors
                                ${isActive ? 'bg-orange-500' : 'bg-orange-500/20'}
                            `}
                            style={{
                                animation: isActive
                                    ? `wave 1s ease-in-out ${delay}s infinite`
                                    : 'none',
                                transform: isCurrentBar ? 'scaleY(1.5)' : 'scaleY(1)',
                                opacity: isActive ? 1 : 0.2,
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes wave {
                0% {
                    transform: scaleY(1);
                    filter: blur(0px);
                    opacity: 0.7;
                }
                50% {
                    transform: scaleY(1.5);
                    filter: blur(0.5px);
                    opacity: 1;
                }
                100% {
                    transform: scaleY(1);
                    filter: blur(0px);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <motion.div
            ref={cardRef}
            style={{
                filter: blurValue,
                position: 'relative'
            }}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{
                    boxShadow: '0 0 80px 80px rgba(255, 255, 255, 0.05)',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%',
                    pointerEvents: 'none'
                }}
            />

            <Card
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden group transition-all duration-500 ease-out dark:bg-transparent bg-black/[0.1] border border-black/20 ring-1 ring-black/5 dark:border-white/10 hover:border-black/30 hover:ring-black/10 hover:shadow-[0_0_15px_rgb(39,39,42)] dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1"
                style={{
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'transform 0.3s ease-out',
                    padding: '1.5rem',
                }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {loading ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span className="text-sm">Detecting location...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                                    <span className="text-sm font-medium">
                                        {city}, {country}
                                    </span>
                                    {temp !== undefined && (
                                        <span className="text-sm text-muted-foreground">
                                            {temp}°C
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-muted-foreground/60 ml-3">
                                    {timezone}
                                </span>
                            </div>
                        )}
                    </div>
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="mb-6">{generateProgressBars()}</div>

                <div className="flex items-baseline gap-2 mb-6">
                    <div className="flex flex-col items-start">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-mono font-bold">
                                {formatTime(currentTime).time}
                            </span>
                            <span className="text-sm font-mono text-muted-foreground">
                                {formatTime(currentTime).period}
                            </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 -mt-1 ml-1">
                            local time
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">{formatDate(currentTime)}</span>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <span className="font-medium">Week {getWeekNumber(currentTime)}</span>
                    </div>
                </div>

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