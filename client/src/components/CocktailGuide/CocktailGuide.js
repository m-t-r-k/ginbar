import React, { useEffect, useMemo, useState } from 'react';
import './CocktailGuide.scss';
import {
  STRENGTH_OPTIONS, FLAVOR_PROFILES, AVOID_OPTIONS, LENGTH_OPTIONS,
  getCandidates, recommend
} from '../BarMenuList/cocktailLogic';

// Radio-Schritte springen beim Antippen weiter, Mehrfachauswahl braucht "Next"
const STEPS = [
  { key: 'strength', type: 'radio', question: 'How strong would you like it?', options: STRENGTH_OPTIONS },
  { key: 'flavors', type: 'multi', question: 'What are you in the mood for?', hint: 'Pick as many as you like – or none to be surprised.',
    options: FLAVOR_PROFILES.map(({ id, label }) => ({ id, label })) },
  { key: 'avoid', type: 'multi', question: 'Anything you would rather avoid?', hint: 'Skip if you like everything.', options: AVOID_OPTIONS },
  { key: 'length', type: 'radio', question: 'Short & intense or long & refreshing?', options: LENGTH_OPTIONS },
];

const EMPTY_ANSWERS = { flavors: [], avoid: [] };
const MAX_RESULTS = 3;

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const CocktailGuide = ({ recipes, onSelect, onClose }) => {
  // Einmal mischen, damit Gleichstände im Ranking nicht immer dieselben Drinks liefern
  const pool = useMemo(() => shuffle(recipes), [recipes]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const step = STEPS[stepIndex];
  const candidateCount = getCandidates(pool, answers).length;

  // Radio-Frage überspringen, wenn keine Antwort die Kandidaten weiter eingrenzt
  // (z.B. "short or long?", wenn alle übrigen Drinks ohnehin short sind)
  const canNarrow = (s, current) => {
    const count = getCandidates(pool, current).length;
    return s.type !== 'radio' || s.options.some(o => getCandidates(pool, { ...current, [s.key]: o.id }).length < count);
  };

  const advance = (nextAnswers) => {
    setAnswers(nextAnswers);
    let next = stepIndex + 1;
    while (next < STEPS.length && !canNarrow(STEPS[next], nextAnswers)) next++;
    const done = nextAnswers.strength === 'nonalc'
      || getCandidates(pool, nextAnswers).length <= MAX_RESULTS
      || next >= STEPS.length;
    if (done) setShowResults(true);
    else setStepIndex(next);
  };

  const pickRadio = (id) => advance({ ...answers, [step.key]: id });

  const toggleMulti = (id) => {
    const current = answers[step.key];
    setAnswers({
      ...answers,
      [step.key]: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
    });
  };

  const back = () => {
    if (showResults) setShowResults(false);
    else if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const restart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setShowResults(false);
  };

  const isSelected = (id) => step.type === 'radio'
    ? answers[step.key] === id
    : answers[step.key].includes(id);

  return (
    <div className="cocktail_guide" role="dialog" aria-modal="true" aria-label="Cocktail guide" onClick={onClose}>
      <div className="guide_panel" onClick={e => e.stopPropagation()}>
        <div className="guide_header">
          <span className="guide_title">Cocktail Guide</span>
          <ol className="guide_progress" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s.key} className={showResults || i <= stepIndex ? 'done' : ''}></li>
            ))}
          </ol>
          <button className="guide_close" onClick={onClose} aria-label="Close guide">
            <span></span><span></span>
          </button>
        </div>

        <div className="guide_body">
          {!showResults ? (
            <fieldset>
              <legend>{step.question}</legend>
              {step.hint && <p className="guide_hint">{step.hint}</p>}
              <div className={step.type === 'radio' ? 'guide_options cards' : 'guide_options chips'}>
                {step.options.map(option => (
                  <button
                    key={option.id}
                    className={isSelected(option.id) ? 'selected' : ''}
                    aria-pressed={isSelected(option.id)}
                    onClick={() => step.type === 'radio' ? pickRadio(option.id) : toggleMulti(option.id)}
                  >
                    <strong>{option.label}</strong>
                    {option.hint && <span>{option.hint}</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <div className="guide_results">
              <h3>Our picks for you</h3>
              {recommend(pool, answers, MAX_RESULTS).map(recipe => (
                <button key={recipe.id} className="result_card" onClick={() => onSelect(recipe)}>
                  <strong>{recipe.title}</strong>
                  <span className="result_ingredients">
                    {(recipe.ingredients || []).map(i => i.ingredient).filter(Boolean).join(' · ')}
                  </span>
                  <span className="result_link">View recipe →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="guide_footer">
          <button className="ghost" onClick={back} disabled={!showResults && stepIndex === 0}>Back</button>
          {showResults ? (
            <button className="primary" onClick={restart}>Start over</button>
          ) : (
            <>
              <button className="ghost" onClick={() => setShowResults(true)}>
                Recommend now <span>({candidateCount})</span>
              </button>
              {step.type === 'multi' && (
                <button className="primary" onClick={() => advance(answers)}>Next</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CocktailGuide;
