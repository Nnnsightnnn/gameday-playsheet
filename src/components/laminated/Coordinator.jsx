// Coordinator header — team identity.

const TEAM_BY_GAME = { madden: 'Falcons', cfb: 'Ole Miss' }

function Coordinator({ game }) {
  const team = TEAM_BY_GAME[game] ?? 'Gameday'
  const crestLetter = team[0]

  return (
    <header className="coord">
      <div className="coord__brand">
        <div className="crest">{crestLetter}</div>
        <div className="coord__titles">
          <h1 className="coord__team">{team}</h1>
          <div className="coord__meta">
            Gameday Call Sheet
          </div>
        </div>
      </div>

    </header>
  )
}

export default Coordinator
