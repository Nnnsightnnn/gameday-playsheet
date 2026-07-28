// built by nnnsightnnn — signal from noise
// Coverage Lab — the right rail: what the call is, how CFB 27 exposes it,
// and what you are choosing to give up by calling it.

export default function CoverageBriefing({ cov, ctx }) {
  const strengthWord = ctx.strong === ctx.fieldSide ? 'field' : 'boundary';
  const hashNote =
    ctx.fieldSide === null
      ? 'Ball in the middle — no field/boundary distinction on this snap.'
      : `Strength is set to the ${strengthWord}. ${
          ctx.strong === ctx.fieldSide
            ? 'Field-strong is the normal picture — your split-field call points its match rules at the grass.'
            : 'Boundary-strong flips the math: the passing strength has less room, so the single receiver owns the wide side.'
        }`;

  return (
    <div className="planner__side">
      <div className="vpanel">
        <div className="cvpanel__head">Identity</div>
        <dl className="cvkv">
          <dt>Family</dt>
          <dd>{cov.fam}</dd>
          <dt>Shell</dt>
          <dd>{cov.shell}</dd>
          <dt>In one line</dt>
          <dd>{cov.one}</dd>
          <dt>Run fit</dt>
          <dd>{cov.runfit}</dd>
          <dt>This snap</dt>
          <dd>{hashNote}</dd>
        </dl>
      </div>

      <div className="vpanel">
        <div className="cvpanel__head">CFB 27 layer</div>
        <div className="cvpanel__menu">
          In-game: <b>{cov.cfb.menu}</b>
        </div>
        <table className="cvsheet__table">
          <thead>
            <tr>
              <th style={{ width: 82 }}>Vs.</th>
              <th>Available checks</th>
            </tr>
          </thead>
          <tbody>
            {cov.cfb.checks.map(([k, v]) => (
              <tr key={k + v}>
                <td className="cvsheet__pos">{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="cvlist">
          {cov.cfb.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="vpanel">
        <div className="cvpanel__head">What you are giving up</div>
        <ul className="cvlist">
          {cov.stress.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="cvcallout">
          <span className="cvcallout__k">When you call it</span>
          {cov.call}
        </div>
      </div>
    </div>
  );
}
