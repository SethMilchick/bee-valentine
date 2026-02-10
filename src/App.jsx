import { useMemo, useState } from 'react';
import Lottie from 'lottie-react';

import butterflyHeartsAnim from './lotties/butterfly-hearts.json';
import beeLoungingAnim from './lotties/bee-lounging.json';
import loveAndKissAnim from './lotties/love-and-kiss.json';

const MAX_YES_SCALE = 2.35;
const RELOAD_DELAY_MS = 3000;
const RETRY_TEXT_DELAY_MS = 700;

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [yesScale, setYesScale] = useState(1);
  const [exploding, setExploding] = useState(false);
  const [showRetryText, setShowRetryText] = useState(false);
  const [noText, setNoText] = useState('NO');

  const phrases = useMemo(
    () => ['NO WAY', 'NOT IT', 'PASS', 'NOPE', 'NO THX', 'NAAH'],
    [],
  );

  function handleNoPress(event) {
    event.preventDefault();
    if (exploding) return;

    setNoText(phrases[Math.floor(Math.random() * phrases.length)]);
    const nextScale = yesScale + 0.12;
    const didExplode = nextScale >= MAX_YES_SCALE;
    setYesScale(Math.min(nextScale, MAX_YES_SCALE));

    if (didExplode) {
      setExploding(true);
      window.setTimeout(() => {
        setShowRetryText(true);
      }, RETRY_TEXT_DELAY_MS);
      window.setTimeout(() => {
        window.location.reload();
      }, RELOAD_DELAY_MS);
    }
  }

  return (
    <div className="page">
      <div className="bgLottie" aria-hidden="true">
        <Lottie animationData={butterflyHeartsAnim} loop autoplay />
      </div>

      <div className="card">
        <div className="hero">
          <div className="heroStage">
            <Lottie
              key={accepted ? 'love-and-kiss' : 'bee-lounging'}
              className="heroLottie"
              animationData={accepted ? loveAndKissAnim : beeLoungingAnim}
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
            />
          </div>
        </div>

        <h1 className="title">{accepted ? 'BEE MINE FOREVER! 🐝💛' : 'WILL YOU BEE MINE?'}</h1>

        {!accepted ? (
          <div className="arena">
            <button
              className={`btn yes${exploding ? ' explode' : ''}`}
              style={{ '--yes-scale': yesScale }}
              disabled={exploding}
              onClick={() => setAccepted(true)}
            >
              YES
            </button>

            <button
              className="btn no"
              onPointerDown={handleNoPress}
              disabled={exploding}
              aria-label="No (not really)"
            >
              {noText}
            </button>
          </div>
        ) : null}
        {exploding && showRetryText ? (
          <div className="explodeMessage" aria-live="polite">
            <p className="explodeText">TRY AGAIN SHIONNA...</p>
          </div>
        ) : null}
        {exploding && showRetryText ? (
          <div className="explodeOverlay" aria-hidden="true" />
        ) : null}
      </div>
    </div>
  );
}
