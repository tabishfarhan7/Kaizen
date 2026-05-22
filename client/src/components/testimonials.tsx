import React from "react";
import { motion } from "framer-motion";

const testimonials1 = [
  {
    text: "Kaizen helped me ace my system design interview at Google. The real-time pacing feedback was an absolute game changer.",
    image: "https://i.pravatar.cc/150?u=1",
    name: "Alex Chen",
    role: "Sr. Software Engineer",
  },
  {
    text: "The AI interviewer's technical depth is mind-blowing. It caught flaws in my distributed systems architecture immediately.",
    image: "https://i.pravatar.cc/150?u=2",
    name: "Sarah Jenkins",
    role: "Backend Developer",
  },
  {
    text: "I was struggling with filler words. Kaizen's live telemetry helped me speak clearly and confidently.",
    image: "https://i.pravatar.cc/150?u=3",
    name: "Michael Ross",
    role: "Full Stack Engineer",
  },
];

const testimonials2 = [
  {
    text: "Felt exactly like a real interview loop. The feedback scorecard was incredibly detailed and mapped directly to senior expectations.",
    image: "https://i.pravatar.cc/150?u=4",
    name: "Priya Patel",
    role: "Tech Lead",
  },
  {
    text: "The best tool for interview prep I've ever used. The AI adjusts to your experience level dynamically.",
    image: "https://i.pravatar.cc/150?u=5",
    name: "David Kim",
    role: "Engineering Manager",
  },
  {
    text: "I landed my dream job at Stripe thanks to the grueling mock sessions. It prepares you for the toughest questions.",
    image: "https://i.pravatar.cc/150?u=6",
    name: "Elena Rodriguez",
    role: "Frontend Engineer",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials1;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all max-w-xs w-full" key={i}>
                <div className="text-zinc-600 font-light text-sm leading-relaxed">"{text}"</div>
                <div className="flex items-center gap-4 mt-6">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full border border-zinc-200"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-zinc-900 tracking-tight text-sm">{name}</div>
                    <div className="text-xs text-zinc-500 font-medium">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200 overflow-hidden relative">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 bg-grid-pattern opacity-50" />
       
       <div className="container relative z-10 mx-auto px-4 text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">Wall of Love</h2>
          <h3 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">Hear from our engineers</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 font-light">
             Join thousands of ambitious developers who have leveled up their interview skills with Kaizen.
          </p>
       </div>

       {/* Scrolling Columns masked with CSS gradient for fade in/out */}
       <div className="relative z-10 max-w-5xl mx-auto h-[500px] flex justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <TestimonialsColumn testimonials={testimonials1} duration={25} className="hidden md:block" />
          <TestimonialsColumn testimonials={testimonials2} duration={35} className="" />
          <TestimonialsColumn testimonials={testimonials1} duration={30} className="hidden lg:block" />
       </div>
    </section>
  )
}
