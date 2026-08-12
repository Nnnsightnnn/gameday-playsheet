// built by nnnsightnnn — signal from noise
// Trends Board — the latest meta, curated, with an optional live YouTube lens.
//
// The backbone is public/data/trends.json — a researched, dated digest
// refreshed via the trends-refresh skill. If a YouTube Data API key is saved
// (Tweaks → stored in sheetSettings.trends.ytKey), a live search panel
// activates on top of the curated set.

import { useEffect, useMemo, useState } from 'react';

const CATEGORY_META = {
  offense: { label: 'Offense', cls: 'trend-chip--off' },
  defense: { label: 'Defense', cls: 'trend-chip--def' },
  mechanic: { label: 'Mechanic', cls: 'trend-chip--mech' },
  patch: { label: 'Patch', cls: 'trend-chip--patch' },
  exploit: { label: 'Exploit watch', cls: 'trend-chip--exploit' },
  team: { label: 'Your team', cls: 'trend-chip--team' },
};

export default function TrendsBoard({ game, trendsCfg, setTrendsCfg }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(game === 'cfb' ? 'cfb' : 'madden');
  const [catFilter, setCatFilter] = useState('all');

  // Live YouTube panel state
  const ytKey = trendsCfg?.ytKey || '';
  const [keyDraft, setKeyDraft] = useState('');
  const [query, setQuery] = useState('');
  const [ytResults, setYtResults] = useState(null);
  const [ytBusy, setYtBusy] = useState(false);
  const [ytError, setYtError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/trends.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        console.error('Failed to load trends.json', err);
        if (!cancelled) setError('Could not load the trends digest.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const gameData = data?.games?.[tab];
  const trends = useMemo(() => {
    const list = gameData?.trends || [];
    return catFilter === 'all'
      ? list
      : list.filter((t) => t.category === catFilter);
  }, [gameData, catFilter]);

  const cats = useMemo(() => {
    const present = new Set((gameData?.trends || []).map((t) => t.category));
    return Object.keys(CATEGORY_META).filter((c) => present.has(c));
  }, [gameData]);

  const searchYouTube = async () => {
    if (!ytKey || !query.trim()) return;
    setYtBusy(true);
    setYtError(null);
    try {
      const url =
        'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&order=relevance' +
        `&q=${encodeURIComponent(query.trim())}` +
        `&key=${encodeURIComponent(ytKey)}`;
      const r = await fetch(url);
      const json = await r.json();
      if (!r.ok || json.error) {
        throw new Error(json.error?.message || `HTTP ${r.status}`);
      }
      setYtResults(json.items || []);
    } catch (err) {
      setYtError(err.message || 'Search failed');
      setYtResults(null);
    } finally {
      setYtBusy(false);
    }
  };

  if (error) return <div className="trends-empty">{error}</div>;
  if (!data) return <div className="trends-empty">Loading the digest…</div>;

  return (
    <div className="trends">
      <div className="trends-hd">
        <div className="trends-tabs">
          <button
            className={'trend-tab' + (tab === 'madden' ? ' trend-tab--on' : '')}
            onClick={() => setTab('madden')}
          >
            {data.games.madden?.label || 'Madden'}
          </button>
          <button
            className={'trend-tab' + (tab === 'cfb' ? ' trend-tab--on' : '')}
            onClick={() => setTab('cfb')}
          >
            {data.games.cfb?.label || 'CFB'}
          </button>
        </div>
        <span className="trends-updated">Digest updated {data.updatedAt}</span>
      </div>

      {gameData?.patchNote && (
        <div className="trends-patchnote">{gameData.patchNote}</div>
      )}

      <div className="trends-filters">
        <button
          className={'trend-chip' + (catFilter === 'all' ? ' trend-chip--on' : '')}
          onClick={() => setCatFilter('all')}
        >
          All
        </button>
        {cats.map((c) => (
          <button
            key={c}
            className={
              'trend-chip ' +
              CATEGORY_META[c].cls +
              (catFilter === c ? ' trend-chip--on' : '')
            }
            onClick={() => setCatFilter(catFilter === c ? 'all' : c)}
          >
            {CATEGORY_META[c].label}
          </button>
        ))}
      </div>

      <div className="trends-grid">
        {trends.map((t) => (
          <article key={t.id} className="trend-card">
            <div className="trend-card__top">
              <span className={'trend-chip trend-chip--static ' + (CATEGORY_META[t.category]?.cls || '')}>
                {CATEGORY_META[t.category]?.label || t.category}
              </span>
              {t.team && <span className="trend-chip trend-chip--static trend-chip--team">★ your team</span>}
            </div>
            <h3 className="trend-card__title">{t.title}</h3>
            <p className="trend-card__body">{t.summary}</p>
            {t.action && <p className="trend-card__action">→ {t.action}</p>}
            {t.links?.length > 0 && (
              <div className="trend-card__links">
                {t.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
        {trends.length === 0 && (
          <div className="trends-empty">Nothing in this category yet.</div>
        )}
      </div>

      {gameData?.videos?.length > 0 && (
        <section className="trends-section">
          <h3 className="trends-section__hd">Watch list</h3>
          <ul className="trends-list">
            {gameData.videos.map((v) => (
              <li key={v.url}>
                <a href={v.url} target="_blank" rel="noreferrer">
                  {v.title}
                </a>
                {v.channel && <span className="trends-list__meta"> — {v.channel}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="trends-cols">
        {gameData?.creators?.length > 0 && (
          <section className="trends-section">
            <h3 className="trends-section__hd">Creators worth following</h3>
            <ul className="trends-list">
              {gameData.creators.map((c) => (
                <li key={c.name}>
                  <a href={c.url} target="_blank" rel="noreferrer">
                    {c.name}
                  </a>
                  <span className="trends-list__meta"> — {c.focus}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {gameData?.watch?.length > 0 && (
          <section className="trends-section">
            <h3 className="trends-section__hd">Sources to monitor</h3>
            <ul className="trends-list">
              {gameData.watch.map((w) => (
                <li key={w.name}>
                  <a href={w.url} target="_blank" rel="noreferrer">
                    {w.name}
                  </a>
                  <span className="trends-list__meta"> — {w.what}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <section className="trends-section trends-yt">
        <h3 className="trends-section__hd">Live YouTube search</h3>
        {!ytKey ? (
          <div className="trends-yt__setup">
            <p className="trends-yt__blurb">
              Optional: add a YouTube Data API v3 key to search live from here.
              The key is stored only in this browser. Note it will be visible
              to anyone using this device — restrict it to the YouTube Data API
              in Google Cloud Console.
            </p>
            <div className="trends-yt__row">
              <input
                className="trends-input"
                type="password"
                placeholder="Paste API key"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
              />
              <button
                className="trends-btn"
                disabled={!keyDraft.trim()}
                onClick={() => {
                  setTrendsCfg({ ...(trendsCfg || {}), ytKey: keyDraft.trim() });
                  setKeyDraft('');
                }}
              >
                Save key
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="trends-yt__row">
              <input
                className="trends-input"
                placeholder={
                  tab === 'cfb'
                    ? 'e.g. CFB 27 3-3 Cub defense'
                    : 'e.g. Madden 27 Falcons pistol bunch'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchYouTube()}
              />
              <button className="trends-btn" onClick={searchYouTube} disabled={ytBusy}>
                {ytBusy ? 'Searching…' : 'Search'}
              </button>
              <button
                className="trends-btn trends-btn--ghost"
                onClick={() => setTrendsCfg({ ...(trendsCfg || {}), ytKey: '' })}
              >
                Remove key
              </button>
            </div>
            {ytError && <div className="trends-yt__err">YouTube: {ytError}</div>}
            {ytResults && (
              <div className="trends-yt__grid">
                {ytResults.map((it) => (
                  <a
                    key={it.id?.videoId}
                    className="trends-yt__card"
                    href={`https://www.youtube.com/watch?v=${it.id?.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {it.snippet?.thumbnails?.medium?.url && (
                      <img
                        src={it.snippet.thumbnails.medium.url}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    <span className="trends-yt__title">{it.snippet?.title}</span>
                    <span className="trends-list__meta">
                      {it.snippet?.channelTitle}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
