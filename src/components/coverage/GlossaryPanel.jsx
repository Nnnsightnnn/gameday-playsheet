// built by nnnsightnnn — signal from noise
// Coverage Lab — the glossary panel. Searchable term chips; tap a term for the
// definition, tap a "see also" to hop. One tap away in every lab mode.

import { useMemo, useState } from 'react';
import { GLOSSARY, GLOSSARY_BY_TERM } from '../../lib/coverage/glossary';

export default function GlossaryPanel({ onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return GLOSSARY;
    return GLOSSARY.filter(
      (e) =>
        e.term.toLowerCase().includes(needle) ||
        (e.aka || '').toLowerCase().includes(needle) ||
        e.def.toLowerCase().includes(needle),
    );
  }, [q]);

  const entry = sel ? GLOSSARY_BY_TERM[sel] : null;

  return (
    <div className="vpanel cvgloss">
      <div className="cvgloss__top">
        <div className="cvpanel__head">Glossary · {GLOSSARY.length} terms</div>
        <input
          type="search"
          className="cvgloss__search"
          placeholder="Search terms… (MOD, rat, trap)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" className="plbtn" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      <div className="cvgloss__chips">
        {hits.map((e) => (
          <button
            key={e.term}
            type="button"
            className={'plbtn cvgloss__chip' + (sel === e.term ? ' is-on' : '')}
            onClick={() => setSel(sel === e.term ? null : e.term)}
          >
            {e.term}
          </button>
        ))}
        {hits.length === 0 && <div className="cvgloss__none">Nothing matches “{q}”.</div>}
      </div>

      {entry && (
        <div className="cvcallout cvgloss__def">
          <span className="cvcallout__k">
            {entry.term}
            {entry.aka ? ` — ${entry.aka}` : ''}
          </span>
          {entry.def}
          {entry.see && entry.see.length > 0 && (
            <div className="cvgloss__see">
              See also:
              {entry.see.map((s) => (
                <button key={s} type="button" className="cvgloss__link" onClick={() => setSel(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
