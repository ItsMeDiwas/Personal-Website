import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Pillars from "@/components/Pillars";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="relative w-full bg-[#121212] overflow-hidden flex flex-col">
      {/* 500vh Cinematic Canvas Scrollytelling Section */}
      <ScrollyCanvas>
        <Overlay />
      </ScrollyCanvas>

      {/* Section 2: THE OPERATIONAL EDGE (Core Pillars) */}
      <Pillars />

      {/* 100vh+ Awwwards Glassmorphic Selected Projects Section */}
      <Projects />
    </main>
  );
}

