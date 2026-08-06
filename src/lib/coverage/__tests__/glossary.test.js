// built by nnnsightnnn — signal from noise
// Glossary validation: unique terms, real definitions, and no dangling
// "see also" links — a see reference to a renamed term should fail loudly.

import { describe, it, expect } from 'vitest';
import { GLOSSARY, GLOSSARY_BY_TERM } from '../glossary';

describe('glossary integrity', () => {
  it('has a meaningful number of terms', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(30);
  });

  it('terms are unique', () => {
    const terms = GLOSSARY.map((e) => e.term);
    expect(new Set(terms).size).toBe(terms.length);
  });

  GLOSSARY.forEach((e) => {
    describe(`term "${e.term}"`, () => {
      it('has a real definition', () => {
        expect(e.def.length).toBeGreaterThan(40);
      });

      it('see-also links resolve to existing terms', () => {
        (e.see || []).forEach((s) => {
          expect(GLOSSARY_BY_TERM[s], `"${e.term}" links to missing term "${s}"`).toBeTruthy();
          expect(s).not.toBe(e.term);
        });
      });
    });
  });
});
