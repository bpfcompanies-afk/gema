import Hero from "../components/Hero";
import BentoGrid from "../components/BentoGrid";
import CTA from "../components/CTA";

import ValueProp from "../components/ValueProp";

export default function Home() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero */}
      <Hero />
      
      {/* 2. Value Prop (El Puente) */}
      <ValueProp />
      
      {/* 3. Bento Grid (Los Módulos) */}
      <BentoGrid />
      
      {/* 4. CTA */}
      <CTA />
      
      {/* 5. Footer */}
      
    </main>
  );
}