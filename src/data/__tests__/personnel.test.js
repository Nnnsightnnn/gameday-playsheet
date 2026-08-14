import { describe, it, expect } from 'vitest';
import {
  CONFIDENCE,
  RATING_GLOSSARY,
  M27_POSITIONS,
  POSITION_MIGRATION,
  KNOW_ANCHORS,
} from '../personnel';
import { PERSONNEL_PLANS, plansForGame, planById } from '../personnelPlans';
import { GRADES } from '../../lib/personnel/roleModel';

const ALL_ROLES = PERSONNEL_PLANS.flatMap((p) =>
  p.roles.map((r) => ({ plan: p, role: r })),
);

const RETIRED_POSITIONS = ['LE', 'RE', 'LOLB', 'MLB', 'ROLB'];

describe('personnel model integrity', () => {
  it('ships at least one plan and resolves it by id and game', () => {
    expect(PERSONNEL_PLANS.length).toBeGreaterThan(0);
    PERSONNEL_PLANS.forEach((p) => {
      expect(planById(p.id)).toBe(p);
      expect(plansForGame(p.game)).toContain(p);
    });
    expect(planById('nope')).toBeNull();
  });

  it('gives every plan a doctrine for both sides plus the honest read', () => {
    PERSONNEL_PLANS.forEach((p) => {
      expect(p.doctrine.offense.length).toBeGreaterThan(80);
      expect(p.doctrine.defense.length).toBeGreaterThan(80);
      expect(p.doctrine.honest.length).toBeGreaterThan(80);
    });
  });

  it('has unique role ids', () => {
    const ids = ALL_ROLES.map(({ role }) => role.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers both sides with a full personnel grouping on each', () => {
    PERSONNEL_PLANS.forEach((p) => {
      ['offense', 'defense'].forEach((side) => {
        const n = p.roles.filter((r) => r.side === side).length;
        expect(n).toBeGreaterThanOrEqual(11);
      });
    });
  });

  it('gives every role a job, a failure mode, and live reads', () => {
    ALL_ROLES.forEach(({ role }) => {
      expect(role.job.length, role.id).toBeGreaterThan(60);
      expect(role.breaks.length, role.id).toBeGreaterThan(60);
      expect(role.personnel, role.id).toBeTruthy();
      expect(role.slot, role.id).toBeTruthy();
      expect(role.reads.length, role.id).toBeGreaterThan(0);
      role.reads.forEach((r) => {
        expect(r.when, role.id).toBeTruthy();
        expect(r.do.length, role.id).toBeGreaterThan(20);
      });
    });
  });
});

describe('Madden 27 position taxonomy', () => {
  it('uses only Madden 27 position codes', () => {
    ALL_ROLES.forEach(({ role }) => {
      expect(M27_POSITIONS, role.id).toContain(role.pos);
    });
  });

  it('never uses a position Madden 27 retired when it merged DE and OLB', () => {
    ALL_ROLES.forEach(({ role }) => {
      expect(RETIRED_POSITIONS, role.id).not.toContain(role.pos);
    });
  });

  it('maps every retired position to a live one', () => {
    POSITION_MIGRATION.forEach((m) => {
      expect(RETIRED_POSITIONS).toContain(m.was);
      expect(M27_POSITIONS).toContain(m.now);
      expect(m.note.length).toBeGreaterThan(10);
    });
    expect(POSITION_MIGRATION.map((m) => m.was).sort()).toEqual(
      [...RETIRED_POSITIONS].sort(),
    );
  });
});

describe('ratings vocabulary and sourcing', () => {
  it('only cites ratings the glossary defines', () => {
    ALL_ROLES.forEach(({ role }) => {
      [...role.ratings, ...(role.traps || [])].forEach((r) => {
        expect(RATING_GLOSSARY, `${role.id}:${r.key}`).toHaveProperty(r.key);
      });
      (role.archetype?.keys || []).forEach((k) => {
        expect(RATING_GLOSSARY, `${role.id} archetype ${k}`).toHaveProperty(k);
      });
    });
  });

  it('tags every claim with a known confidence level', () => {
    const ok = Object.keys(CONFIDENCE);
    ALL_ROLES.forEach(({ role }) => {
      [...role.ratings, ...(role.traps || [])].forEach((r) => {
        expect(ok, `${role.id}:${r.key}`).toContain(r.conf);
      });
      if (role.archetype) expect(ok).toContain(role.archetype.conf);
    });
    PERSONNEL_PLANS.forEach((p) => {
      p.buildOrder.forEach((s) => expect(ok, s.title).toContain(s.conf));
      p.inGame.forEach((r) => expect(ok, r.id).toContain(r.conf));
    });
  });

  it('gives every role at least one core rating and a real reason for each', () => {
    ALL_ROLES.forEach(({ role }) => {
      const core = role.ratings.filter((r) => r.tier === 'core');
      expect(core.length, role.id).toBeGreaterThanOrEqual(2);
      role.ratings.forEach((r) => {
        expect(r.why.length, `${role.id}:${r.key}`).toBeGreaterThan(50);
      });
    });
  });
});

// These are football assertions, not rendering assertions. They encode what
// the Madden 27 research actually established, so a future edit that quietly
// reverts to Madden 26 folklore fails the suite.
describe('Madden 27 football facts', () => {
  it('never treats Hit Power as a core rating — Tackle decides the connection', () => {
    ALL_ROLES.forEach(({ role }) => {
      const pow = role.ratings.find((r) => r.key === 'POW');
      if (pow) expect(pow.tier, role.id).not.toBe('core');
    });
  });

  it('never makes Speed a core rating at cornerback or safety', () => {
    // EA's six defensive-back archetype triads contain no SPD and no ACC.
    // M27's Jostle system is explicitly designed to let coverage technique
    // neutralize speed, so a speed-first DB evaluation is out of date.
    ALL_ROLES.filter(({ role }) => ['CB', 'FS', 'SS'].includes(role.pos)).forEach(
      ({ role }) => {
        const core = role.ratings.filter((r) => r.tier === 'core').map((r) => r.key);
        expect(core, role.id).not.toContain('SPD');
        expect(core, role.id).not.toContain('ACC');
      },
    );
  });

  it('puts Catch in Traffic and Spectacular Catch ahead of raw Catching', () => {
    // Timing-Based Catching: CTH drives the yellow window only; CIT and SPC
    // widen the green window against the coverage and difficulty penalties.
    const x = ALL_ROLES.find(({ role }) => role.id === 'off.x').role;
    const core = x.ratings.filter((r) => r.tier === 'core').map((r) => r.key);
    expect(core).toContain('CIT');
    expect(core).toContain('SPC');
    const cth = x.ratings.find((r) => r.key === 'CTH');
    expect(cth.tier).not.toBe('core');
  });

  it('makes Change of Direction core at running back — the one real threshold', () => {
    const hb = ALL_ROLES.find(({ role }) => role.id === 'off.hb').role;
    const core = hb.ratings.filter((r) => r.tier === 'core').map((r) => r.key);
    expect(core).toContain('COD');
    expect(hb.holder.line).toMatch(/COD 9[0-9]/);
  });

  it('flags Play Action as a trap rather than a quarterback core rating', () => {
    const qb = ALL_ROLES.find(({ role }) => role.id === 'off.qb').role;
    expect(qb.ratings.map((r) => r.key)).not.toContain('PAC');
    expect(qb.traps.map((t) => t.key)).toContain('PAC');
  });
});

describe('Falcons roster reality', () => {
  const plan = planById('falcons-m27');

  it('does not model the Falcons as a base 3-4', () => {
    // No DT above 74 OVR and two edges with Man Coverage in the 30s-40s.
    // The doctrine has to say nickel, and it has to say why.
    expect(plan.doctrine.defense.toLowerCase()).toMatch(/nickel/);
    expect(plan.doctrine.honest.toLowerCase()).toMatch(/3-4/);
    expect(plan.doctrine.honest.toLowerCase()).toMatch(/nose/);
  });

  it('grades the interior defensive line as a roster hole', () => {
    const dts = plan.roles.filter((r) => r.pos === 'DT');
    expect(dts.length).toBeGreaterThanOrEqual(2);
    dts.forEach((r) => {
      expect(r.holder.grade, r.id).toBe('hole');
      expect(r.holder.ovr, r.id).toBeLessThanOrEqual(74);
    });
  });

  it('grades every holder with a known grade', () => {
    plan.roles.forEach((r) => {
      expect(Object.keys(GRADES), r.id).toContain(r.holder.grade);
      expect(r.holder.line, r.id).toBeTruthy();
      expect(r.holder.verdict.length, r.id).toBeGreaterThan(60);
    });
  });
});

describe('depth-chart procedure and in-game reads', () => {
  it('numbers the build steps consecutively from one', () => {
    PERSONNEL_PLANS.forEach((p) => {
      p.buildOrder.forEach((s, i) => {
        expect(s.step).toBe(i + 1);
        expect(s.do.length).toBeGreaterThan(40);
        expect(s.why.length).toBeGreaterThan(60);
      });
    });
  });

  it('gives every in-game read a unique id, a visible tell, and an executable fix', () => {
    PERSONNEL_PLANS.forEach((p) => {
      const ids = p.inGame.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
      p.inGame.forEach((r) => {
        expect(['offense', 'defense'], r.id).toContain(r.side);
        expect(
          ['Pre-snap read', 'Between plays', 'By drive'],
          r.id,
        ).toContain(r.phase);
        expect(r.tell.length, r.id).toBeGreaterThan(15);
        expect(r.fix.length, r.id).toBeGreaterThan(60);
      });
    });
  });

  it('covers both sides of the ball with between-play reads', () => {
    PERSONNEL_PLANS.forEach((p) => {
      ['offense', 'defense'].forEach((side) => {
        expect(p.inGame.filter((r) => r.side === side).length).toBeGreaterThan(3);
      });
    });
  });
});

describe('knowledge scale', () => {
  it('runs 1-5 with a distinct label at every step', () => {
    expect(KNOW_ANCHORS.map((a) => a.value)).toEqual([1, 2, 3, 4, 5]);
    const labels = KNOW_ANCHORS.map((a) => a.label);
    expect(new Set(labels).size).toBe(5);
  });
});
