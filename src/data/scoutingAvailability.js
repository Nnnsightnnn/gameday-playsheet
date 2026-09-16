// built by nnnsightnnn — signal from noise
// Players the roster snapshot still lists but who will not be on the field:
// IR, suspensions, holdouts. The scouting build drops them before projecting
// starters, for the Falcons and for opponents alike. madden.tools keeps IR
// players on the team list, and online H2H uses the live roster, so without
// this the fact sheet would start a torn ACL.
//
// Keep entries dated; clear them when the player returns.
export const UNAVAILABLE = {
  ATL: [
    { name: 'Jalon Walker', why: 'IR (ACL)', since: '2026-08-30' },
    { name: 'James Pearce Jr', why: 'Suspended 8 games', since: '2026-08-30' },
  ],
};
