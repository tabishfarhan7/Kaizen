import React from 'react';

// Define the props for the component
interface HeroCollageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  images: string[];
}

// Keyframes for the floating animation
const animationStyle = `
  @keyframes float-up {
    0% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    50% { transform: translateY(-15px); box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3); }
    100% { transform: translateY(0px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
  }
  .animate-float-up {
    animation: float-up 6s ease-in-out infinite;
  }
`;

const HeroCollage = React.forwardRef<HTMLDivElement, HeroCollageProps>(
  ({ className = '', title, subtitle, stats, images, ...props }, ref) => {
    // We need exactly 7 images for this layout
    const displayImages = images.slice(0, 7);

    return (
      <>
        <style>{animationStyle}</style>
        <section
          ref={ref}
          className={`relative w-full bg-zinc-50 bg-grid-pattern font-sans py-20 sm:py-32 overflow-hidden border-t border-zinc-200 ${className}`}
          {...props}
        >
          {/* Glow effects */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

          {/* Main Content */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950">
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-zinc-600 font-light">
              {subtitle}
            </p>
          </div>

          {/* Image Collage - Updated Layout */}
          <div className="relative z-0 mt-20 h-[600px] flex items-center justify-center">
            <div className="relative h-full w-full max-w-6xl">
              {/* Central Image */}
              {displayImages[0] && (
                <img
                  src={displayImages[0]}
                  alt="Main feature"
                  className="absolute left-1/2 top-1/2 h-auto w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl z-20 animate-float-up bg-white border border-zinc-200"
                  style={{ animationDelay: '0s' }}
                />
              )}
              {/* Top-Left */}
              {displayImages[1] && (
                <img
                  src={displayImages[1]}
                  alt="Feature 2"
                  className="absolute left-[15%] top-[10%] h-auto w-64 rounded-xl shadow-lg z-10 animate-float-up bg-white border border-zinc-200"
                  style={{ animationDelay: '-1.2s' }}
                />
              )}
              {/* Top-Right */}
              {displayImages[2] && (
                <img
                  src={displayImages[2]}
                  alt="Feature 3"
                  className="absolute right-[15%] top-[5%] h-auto w-60 rounded-xl shadow-lg z-10 animate-float-up bg-white border border-zinc-200"
                  style={{ animationDelay: '-2.5s' }}
                />
              )}
              {/* Bottom-Right */}
              {displayImages[3] && (
                <img
                  src={displayImages[3]}
                  alt="Feature 4"
                  className="absolute right-[10%] bottom-[5%] h-auto w-72 rounded-xl shadow-lg z-30 animate-float-up bg-white border border-zinc-200"
                  style={{ animationDelay: '-3.5s' }}
                />
              )}
               {/* Far-Right */}
              {displayImages[4] && (
                <img
                  src={displayImages[4]}
                  alt="Feature 5"
                  className="absolute right-[2%] top-1/2 -translate-y-[60%] h-auto w-48 rounded-xl shadow-lg z-10 animate-float-up bg-white border border-zinc-200"
                   style={{ animationDelay: '-4.8s' }}
                />
              )}
              {/* Bottom-Left */}
              {displayImages[5] && (
                <img
                  src={displayImages[5]}
                  alt="Feature 6"
                  className="absolute left-[10%] bottom-[0%] h-auto w-64 rounded-xl shadow-lg z-30 animate-float-up bg-white border border-zinc-200"
                   style={{ animationDelay: '-5.2s' }}
                />
              )}
              {/* Far-Left */}
              {displayImages[6] && (
                <img
                  src={displayImages[6]}
                  alt="Feature 7"
                  className="absolute left-[2%] top-[30%] h-auto w-52 rounded-xl shadow-lg z-10 animate-float-up bg-white border border-zinc-200"
                   style={{ animationDelay: '-6s' }}
                />
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="container relative z-10 mx-auto mt-24 px-4">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-zinc-950">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

HeroCollage.displayName = 'HeroCollage';

export function Features() {
  const stats = [
    { value: '250ms', label: 'Audio Latency' },
    { value: '10k+', label: 'Interviews Evaluated' },
    { value: '99%', label: 'Transcription Accuracy' },
    { value: '24/7', label: 'Availability' },
  ];

  // We reuse the newly generated colorful mockup images to populate the 7 collage slots
  const images = [
    '/mock-dashboard.png', 
    '/colorful-1.png',      
    '/colorful-2.png',      
    '/mock-dashboard.png', 
    '/colorful-1.png',      
    '/colorful-2.png',      
    '/mock-dashboard.png', 
  ];

  return (
    <HeroCollage 
      title={<>Built for <span className="text-indigo-600">Ambitious Engineers</span></>}
      subtitle="Empower your career with interview preparation that adapts to your needs, utilizing real-time AI feedback and technical grading."
      stats={stats}
      images={images}
    />
  );
}
