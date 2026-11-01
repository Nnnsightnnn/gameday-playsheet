// Coordinator header — team identity.

function Coordinator({ team, setTeam }) {
  const crestLetter = (team.trim()[0] || 'G').toUpperCase()

  return (
    <header className="coord">
      <div className="coord__brand">
        <div className="crest">{crestLetter}</div>
        <div className="coord__titles">
          <input
            className="coord__team"
            value={team}
            spellCheck="false"
            onChange={(e) => setTeam(e.target.value.slice(0, 18))}
            aria-label="Team name"
          />
          <div className="coord__meta">
            Gameday Call Sheet
          </div>
        </div>
      </div>

    </header>
  )
}

export default Coordinator
