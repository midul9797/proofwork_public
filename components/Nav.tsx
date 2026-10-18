import { DEMO_URL, LOGIN_URL } from "@/lib/site";
import { Logo } from "./Icons";

export function Nav() {
  return (
    <header className="nav">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="nav__in">
        <a className="brand" href="/" aria-label="Proofwork home">
          <Logo />
          <span>Proofwork</span>
        </a>
        <nav aria-label="Primary" className="nav__links">
          <a href="#sample-evaluation">The assessment</a>
          <a href="#tasks">Roles</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav__actions">
          <a className="nav__signin" href={LOGIN_URL}>
            Sign in
          </a>
          <a className="btn btn--sm" href={DEMO_URL}>
            Request a demo
          </a>
        </div>
      </div>
    </header>
  );
}
