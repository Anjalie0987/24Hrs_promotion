import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { ProblemSolution } from "@/components/problem-solution";
import { BuiltFor } from "@/components/built-for";
import { Benefits } from "@/components/benefits";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <ProblemSolution />
      <BuiltFor />
      <Benefits />
      <Footer />
    </div>
  );
}
