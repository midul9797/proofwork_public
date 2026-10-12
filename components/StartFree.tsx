import { LOGIN_URL } from "@/lib/site";
import { ArrowRight, Mail } from "./Icons";

export function StartFree({ id }: { id?: string }) {
  return (
    <div className="start" id={id}>
      <a className="btn btn--lg" href={LOGIN_URL}>
        Start free <ArrowRight />
      </a>
      <p className="start__note">
        <Mail /> Sign in with your work email: a magic link, no password, no card. Free in early access.
      </p>
    </div>
  );
}
