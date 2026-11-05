import { animDelay } from "@/lib/motion";
import { site } from "@/lib/site";

const FIRST_LETTER_DELAY_S = 0.25;
const LETTER_STAGGER_S = 0.045;
const NON_BREAKING_SPACE = " ";

const letterDelay = (index: number) => animDelay(FIRST_LETTER_DELAY_S + index * LETTER_STAGGER_S);

export default function AnimatedName() {
  return (
    <h1 aria-label={site.name} className="font-semibold tracking-[-0.035em] leading-[1.05] text-[clamp(3rem,2rem+3.6vw,5.5rem)] overflow-hidden pb-[0.08em]">
      {Array.from(site.name).map((letter, i) => (
        <span key={i} aria-hidden="true" className="letter" style={letterDelay(i)}>
          {letter === " " ? NON_BREAKING_SPACE : letter}
        </span>
      ))}
    </h1>
  );
}
