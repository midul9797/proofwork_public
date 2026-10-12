import { timelineTicks } from "@/lib/content";
import { Check, FileIcon, Flag } from "./Icons";
import { TiltOnScroll } from "./TiltOnScroll";

const changes = [
  { item: "Saved filters", status: "Released", note: "All plans." },
  { item: "Bulk invite", status: "Behind a flag", note: "Off for every workspace. In testing." },
  { item: "Dark mode", status: "Released", note: "Follows the system setting." },
  { item: "Faster search", status: "Released", note: "Large workspaces only." },
];

const legend = [
  { kind: "ai", label: "AI message" },
  { kind: "flag", label: "Trap fired" },
  { kind: "pass", label: "Test run" },
  { kind: "paste", label: "Paste" },
  { kind: "away", label: "Left the window" },
];

export function ReplayPanel() {
  return (
    <figure className="replay">
      <TiltOnScroll>
        <div className="rp" aria-hidden="true">
          <div className="rp-bar">
            <span className="rp-bar__crumb">
              <strong>Replay</strong>
              <span className="rp-sep">/</span>
              Candidate A
              <span className="rp-sep">/</span>
              <span className="rp-dim">Release notes (example task)</span>
            </span>
            <span className="rp-verified">
              <Check /> Replay matches the submitted files
            </span>
          </div>

          <div className="rp-body">
            <div className="rp-tree">
              <div className="rp-tree__h">Files</div>
              <div className="rp-tree__row is-on">
                <FileIcon /> materials/changelog.md <span className="rp-ro">read-only</span>
              </div>
              <div className="rp-tree__row">
                <FileIcon /> materials/style-guide.md <span className="rp-ro">read-only</span>
              </div>
              <div className="rp-tree__row">
                <FileIcon /> release-notes.md
              </div>
            </div>

            <div className="rp-doc">
              <p className="rp-doc__h1">Changelog, this month</p>
              <p className="rp-doc__p">Everything merged this month and whether customers can use it yet.</p>
              <table className="rp-doc__table">
                <thead>
                  <tr>
                    <th>Change</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((r) => (
                    <tr key={r.item} className={r.item === "Bulk invite" ? "is-hl" : undefined}>
                      <td>{r.item}</td>
                      <td>{r.status}</td>
                      <td>{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rp-chat">
              <div className="rp-chat__tabs">
                <span className="is-on">AI chat (2)</span>
                <span>Traps (1)</span>
              </div>
              <div className="msg msg--me">Draft this month&rsquo;s customer release notes from the changelog.</div>
              <div className="msg msg--ai">
                <p>
                  New this month:{" "}
                  <span className="msg__flag-inline">bulk invite is now live for every workspace.</span> Saved filters
                  and dark mode are available too.
                </p>
                <div className="msg__chips">
                  <span className="chip chip--flag">
                    <Flag /> Planted error
                  </span>
                  <span className="chip chip--caught">
                    <Check /> Caught
                  </span>
                </div>
              </div>
              <div className="msg msg--me">Bulk invite is still behind a flag in the changelog. Leaving it out.</div>
            </div>
          </div>

          <div className="rp-time">
            <div className="rp-time__row">
              <span className="rp-play">Play</span>
              <span className="rp-speed">
                <span>1x</span>
                <span className="is-on">4x</span>
                <span>16x</span>
              </span>
              <span className="rp-clock">
                09:12 <span className="rp-dim">/ 41:05</span>
              </span>
            </div>
            <span className="rp-track">
              <span className="rp-track__fill" />
              {timelineTicks.map((t) => (
                <span key={t.label} className={`tick tick--${t.kind}`} style={{ left: `${t.at}%` }} />
              ))}
              <span className="rp-head" />
            </span>
            <div className="rp-legend">
              {legend.map((l) => (
                <span key={l.label} className={`rp-legend__i rp-legend__i--${l.kind}`}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </TiltOnScroll>
      <figcaption className="replay__cap">
        Example session with invented data: a product manager task, paused at a planted error.
      </figcaption>
    </figure>
  );
}
