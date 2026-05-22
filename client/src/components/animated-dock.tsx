"use client"

import * as React from "react"
import { useRef } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export interface AnimatedDockProps {
  className?: string;
  items: DockItemData[];
}
 
export interface DockItemData {
  link?: string;
  Icon: React.ReactNode;
  target?: string;
  onClick?: () => void;
  title?: string;
}

export const AnimatedDock = ({ className = '', items }: AnimatedDockProps) => {
  const mouseX = useMotionValue(Infinity);
 
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`mx-auto flex h-16 items-end gap-3 rounded-2xl bg-white/40 border border-white/60 shadow-lg px-3 pb-2 backdrop-blur-2xl ${className}`}
    >
      {items.map((item, index) => (
        <DockItem key={index} mouseX={mouseX} title={item.title}>
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="grow flex items-center justify-center w-full h-full text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {item.Icon}
            </button>
          ) : (
            <a
              href={item.link}
              target={item.target}
              className="grow flex items-center justify-center w-full h-full text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              {item.Icon}
            </a>
          )}
        </DockItem>
      ))}
    </motion.div>
  );
};
 
interface DockItemProps {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
  title?: string;
}
 
export const DockItem = ({ mouseX, children, title }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [45, 80, 45]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const iconScale = useTransform(width, [45, 80], [1, 1.5]);
  const iconSpring = useSpring(iconScale, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square rounded-full bg-white/50 border border-white/80 flex items-center justify-center cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.05)] relative group z-10 hover:bg-white/80 transition-colors"
    >
      <motion.div
        style={{ scale: iconSpring }}
        className="flex items-center justify-center w-full h-full grow"
      >
        {children}
      </motion.div>
      {/* Tooltip hover effect similar to macOS dock */}
      {title && (
         <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-medium px-3 py-1.5 rounded-lg border border-white/60 pointer-events-none whitespace-nowrap shadow-sm">
            {title}
         </div>
      )}
    </motion.div>
  );
};
