// built by nnnsightnnn — signal from noise
// Coverage Lab — the assignment sheet.
// Rows whose rule differs from the comparison call are flagged, because that
// difference is the entire reason to run two coverages side by side.

import { TYPE_COLOR } from '../../lib/coverage/labConfig';

export default function AssignmentSheet({ title, defense, compareTo }) {
  return (
    <div className="cvsheet">
      {title && <div className="cvsheet__title">{title}</div>}
      <table className="cvsheet__table">
        <thead>
          <tr>
            <th style={{ width: 74 }}>Pos</th>
            <th style={{ width: 66 }}>Type</th>
            <th>Rule</th>
          </tr>
        </thead>
        <tbody>
          {defense.map((d) => {
            const other = compareTo ? compareTo.find((x) => x.p === d.p) : null;
            const differs = other ? other.rule !== d.rule : false;
            const col = TYPE_COLOR[d.type] || TYPE_COLOR.under;
            return (
              <tr key={d.p} className={differs ? 'is-diff' : undefined}>
                <td className="cvsheet__pos" style={{ color: col }}>
                  {d.p}
                </td>
                <td>
                  <span className="cvtag" style={{ color: col, borderColor: col }}>
                    {d.type}
                  </span>
                </td>
                <td>{d.rule}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
