import { DEMO_URL } from "@/lib/site";
import { ArrowRight, Mail } from "./Icons";

export function StartFree({ id }: { id?: string }) {
  return (
    <div className="start" id={id}>
      <a className="btn btn--lg" href={DEMO_URL}>
        Request a demo <ArrowRight />
      </a>
      <p className="start__note">
        <Mail /> Access is arranged directly. Tell us which role you&rsquo;re hiring for.
      </p>
    </div>
  );
}
