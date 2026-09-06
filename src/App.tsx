import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Mail,
  Moon,
  RotateCcw,
  Sparkles,
  Star,
  Sun,
  WandSparkles,
} from 'lucide-react';
import coupleImg from './assets/couple.jpg';

type IconComponent = typeof Heart;

const reasons: { label: string; title: string; copy: string; Icon: IconComponent }[] = [
  { label: 'Heart', title: 'Your warm heart', copy: 'You make every room softer just by being in it.', Icon: Heart },
  { label: 'Star', title: 'Your bright spirit', copy: 'You shine in ways you do not even realize.', Icon: Star },
  { label: 'Sun', title: 'Your sunny laugh', copy: 'Your laugh is still my favorite sound in the world.', Icon: Sun },
  { label: 'Magic', title: 'Your little magic', copy: 'You turn ordinary days into memories I keep forever.', Icon: WandSparkles },
  { label: 'Moon', title: 'My safe place', copy: 'With you, even the quiet moments feel like home.', Icon: Moon },
];

const heartCards = [
  { id: 0, word: 'You', color: 'rose' },
  { id: 1, word: 'make', color: 'peach' },
  { id: 2, word: 'life', color: 'lavender' },
  { id: 3, word: 'beautiful', color: 'mint' },
];

const flowerIcons = ['🌸', '🌺', '🌷', '🌹', '🌼', '✨', '💖', '🍃', '🌸', '💐'];

function App() {
  const [step, setStep] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState(false);
  const [popped, setPopped] = useState<number[]>([]);
  const [lights, setLights] = useState<boolean[]>([false, false, false, false, false]);
  const [selectedReason, setSelectedReason] = useState(0);
  const [seenReasons, setSeenReasons] = useState<number[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const progress = `${((step - 1) / 5) * 100}%`;
  const allPopped = popped.length === heartCards.length;
  const allReasonsSeen = seenReasons.length === reasons.length;
  const allLightsOn = lights.every(Boolean);

  const floaters = useMemo(() => Array.from({ length: 15 }, (_, index) => ({
    left: `${(index * 17 + 3) % 100}%`,
    delay: `${(index % 5) * 1.2}s`,
    duration: `${7 + (index % 4)}s`,
    size: `${12 + (index % 3) * 4}px`,
  })), []);

  function goTo(nextStep: number) {
    setStep(Math.min(6, Math.max(1, nextStep)));
  }

  function startJourney() {
    setBurst(true);
    window.setTimeout(() => {
      setBurst(false);
      goTo(2);
    }, 750);
  }

  function flipCard(index: number) {
    if (index !== popped.length || popped.includes(index)) return;
    setPopped((current) => [...current, index]);
  }

  function chooseReason(index: number) {
    setSelectedReason(index);
    setSeenReasons((current) => current.includes(index) ? current : [...current, index]);
  }

  function resetJourney() {
    setStep(1);
    setPopped([]);
    setLights([false, false, false, false, false]);
    setSelectedReason(0);
    setSeenReasons([]);
    setLetterOpen(false);
    setGiftOpen(false);
  }

  return (
    <main className="journey-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="floaters" aria-hidden="true">
        {floaters.map((floater, index) => <span key={index} style={floater}>♡</span>)}
      </div>

      <header className="topbar">
        <button className="nav-button" aria-label="Previous step" onClick={() => goTo(step - 1)} disabled={step === 1}>
          <ArrowLeft size={17} />
        </button>
        <div className="brand-mark"><Heart size={14} fill="currentColor" /> for my love</div>
        <button className="nav-button" aria-label="Next step" onClick={() => goTo(step + 1)} disabled={step === 6 || (step === 2 && !allPopped) || (step === 3 && !allLightsOn) || (step === 4 && !allReasonsSeen) || (step === 5 && !letterOpen)}>
          <ArrowRight size={17} />
        </button>
      </header>

      <div className="progress-track"><div className="progress-value" style={{ width: progress }} /></div>
      <p className="step-label">chapter {step} <span>of 6</span></p>

      <section className={`scene scene-${step}`}>
        {step === 1 && <Landing onYes={startJourney} noPosition={noPosition} setNoPosition={setNoPosition} />}
        {step === 2 && <HeartCardStage popped={popped} flipCard={flipCard} allPopped={allPopped} onContinue={() => goTo(3)} />}
        {step === 3 && <LightStage lights={lights} setLights={setLights} allLightsOn={allLightsOn} onContinue={() => goTo(4)} />}
        {step === 4 && <BouquetStage selectedReason={selectedReason} seenReasons={seenReasons} chooseReason={chooseReason} allReasonsSeen={allReasonsSeen} onContinue={() => goTo(5)} />}
        {step === 5 && <LetterStage letterOpen={letterOpen} setLetterOpen={setLetterOpen} onContinue={() => goTo(6)} />}
        {step === 6 && <GiftStage giftOpen={giftOpen} setGiftOpen={setGiftOpen} onReplay={resetJourney} />}
      </section>

      {burst && (
        <div className="flower-bomb-container" aria-hidden="true">
          {Array.from({ length: 32 }, (_, index) => {
            const angle = (index * 360) / 32;
            const distance = 110 + (index % 5) * 40;
            const icon = flowerIcons[index % flowerIcons.length];
            const scale = 0.9 + (index % 3) * 0.4;
            return (
              <span
                key={index}
                className="flower-particle"
                style={{
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`,
                  '--scale': scale,
                  animationDelay: `${(index % 4) * 0.04}s`,
                } as React.CSSProperties}
              >
                {icon}
              </span>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Landing({ onYes, noPosition, setNoPosition }: { onYes: () => void; noPosition: { x: number; y: number }; setNoPosition: (position: { x: number; y: number }) => void }) {
  function moveNo() {
    setNoPosition({ x: Math.random() * 170 - 85, y: Math.random() * 100 - 50 });
  }
  return (
    <div className="content landing-content">
      <p className="eyebrow">a little suprise, made with love</p>
      <h1><em>My Love</em> <span className="tiny-heart">♡</span></h1>
      <div className="hero-art" aria-label="A little cat holding a flower bouquet">
        <div className="sparkle s1">✦</div><div className="sparkle s2">✦</div><div className="sparkle s3">·</div>
        <div className="cat-ear left-ear" /><div className="cat-ear right-ear" />
        <div className="cat-head"><span className="ear-inner left-inner" /><span className="ear-inner right-inner" /><div className="cat-eye left-eye" /><div className="cat-eye right-eye" /><div className="cat-nose" /><div className="cat-mouth" /></div>
        <div className="cat-body"><div className="paw paw-left" /><div className="paw paw-right" /><div className="heart-badge">♥</div></div>
        
        {/* Flower bouquet replacing the candle/cake */}
        <div className="bouquet-mini">
          <div className="mini-wrap" />
          <div className="mini-flower f1">🌸</div>
          <div className="mini-flower f2">🌷</div>
          <div className="mini-flower f3">🌺</div>
          <div className="mini-leaf l1">🍃</div>
          <div className="mini-ribbon">🎀</div>
        </div>
      </div>
      <p className="intro-copy">I created a little something just for you,<br />to celebrate how beautifully you make my life.</p>
      <p className="ready-copy">Ready to see it?</p>
      <div className="button-row">
        <button className="primary-button" onClick={onYes}>
          Yes, show me <Heart size={16} fill="currentColor" />
        </button>
        <button className="ghost-button playful" onMouseEnter={moveNo} onFocus={moveNo} style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}>
          Not yet
        </button>
      </div>
    </div>
  );
}

function HeartCardStage({ popped, flipCard, allPopped, onContinue }: { popped: number[]; flipCard: (index: number) => void; allPopped: boolean; onContinue: () => void }) {
  return (
    <div className="content stage-content">
      <p className="eyebrow">a gentle reminder floats just for you</p>
      <h2>Flip the hearts</h2>
      <p className="subheading">and reveal a message from my heart...</p>
      
      <div className="cards-area">
        {heartCards.map((card, index) => {
          const isFlipped = popped.includes(index);
          return (
            <div
              key={card.id}
              className={`heart-card-wrapper ${isFlipped ? 'flipped' : ''}`}
              onClick={() => flipCard(index)}
              role="button"
              tabIndex={0}
              aria-label={`Flip card ${index + 1}`}
            >
              <div className="heart-card-inner">
                <div className={`heart-card-front card-${card.color}`}>
                  <div className="card-sparkle">✦</div>
                  <Heart className="card-heart-icon" size={30} fill="currentColor" />
                  <span className="card-number">{index + 1}</span>
                  <span className="card-tap-text">Tap me</span>
                </div>
                <div className="heart-card-back">
                  <Heart className="card-back-bg-heart" size={60} />
                  <span className="revealed-card-word">{card.word}</span>
                  <div className="card-decor">✨</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`message-reveal ${allPopped ? 'visible' : ''}`}>
        {allPopped ? (
          <><Sparkles size={17} /> You make life beautiful <Sparkles size={17} /></>
        ) : (
          <span>tap them in order, one by one</span>
        )}
      </div>
      <ContinueButton visible={allPopped} onClick={onContinue} />
    </div>
  );
}

function LightStage({ lights, setLights, allLightsOn, onContinue }: { lights: boolean[]; setLights: (lights: boolean[]) => void; allLightsOn: boolean; onContinue: () => void }) {
  function toggleLight(index: number) {
    setLights(lights.map((isOn, i) => (i === index ? true : isOn)));
  }

  const litCount = lights.filter(Boolean).length;

  return (
    <div className="content stage-content">
      <p className="eyebrow">make a wish, my love</p>
      <h2>Light up my world</h2>
      <p className="subheading">Close your eyes and tap each light to illuminate our special journey.</p>
      
      <div className="lights-display-area">
        <div className="lights-wire" />
        <div className="lights-container">
          {lights.map((isOn, index) => (
            <div
              key={index}
              className={`light-fixture fixture-${index} ${isOn ? 'is-on' : 'is-off'}`}
              onClick={() => toggleLight(index)}
              role="button"
              tabIndex={0}
              aria-label={`Switch on light ${index + 1}`}
            >
              <div className="light-cord" />
              <div className="light-socket" />
              <div className="light-bulb">
                <div className="bulb-glass">
                  <div className="bulb-filament" />
                  {isOn && <div className="bulb-glow-core" />}
                </div>
                {isOn && (
                  <div className="light-aura">
                    <span className="ray r1" />
                    <span className="ray r2" />
                    <span className="ray r3" />
                    <span className="ray r4" />
                  </div>
                )}
              </div>
              <span className="light-number">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="hint">
        {allLightsOn
          ? 'All 5 lights are glowing bright — your wish is on its way! ✨'
          : `Tap each light to switch it on (${litCount} of 5 glowing)`}
      </p>
      <ContinueButton visible={allLightsOn} onClick={onContinue} />
    </div>
  );
}

function BouquetStage({ selectedReason, seenReasons, chooseReason, allReasonsSeen, onContinue }: { selectedReason: number; seenReasons: number[]; chooseReason: (index: number) => void; allReasonsSeen: boolean; onContinue: () => void }) {
  const reason = reasons[selectedReason];
  return (
    <div className="content stage-content">
      <p className="eyebrow">for the one who brings beauty to my world</p>
      <h2>Five little reasons</h2>
      <p className="subheading">Each button holds a piece of why you are so special to me.</p>
      <div className="reason-buttons">
        {reasons.map(({ label, Icon }, index) => (
          <button className={`reason-button ${selectedReason === index ? 'active' : ''} ${seenReasons.includes(index) ? 'seen' : ''}`} key={label} onClick={() => chooseReason(index)} aria-label={label}>
            <Icon size={21} fill={index === 0 ? 'currentColor' : 'none'} />
            <span>{index + 1}</span>
          </button>
        ))}
      </div>
      <div className="reason-card">
        <div className="reason-icon"><reason.Icon size={19} /></div>
        <div><p>{reason.title}</p><span>{reason.copy}</span></div>
      </div>
      <div className="tulip-bouquet">
        <div className="bouquet-paper" />
        <div className="tulip t1" />
        <div className="tulip t2" />
        <div className="tulip t3" />
        <div className="tulip t4" />
        <div className="tulip t5" />
        <div className="leaf l1" />
        <div className="leaf l2" />
        <div className="ribbon" />
      </div>
      <p className="hint">{seenReasons.length} of 5 reasons discovered</p>
      <ContinueButton visible={allReasonsSeen} onClick={onContinue} />
    </div>
  );
}

function LetterStage({ letterOpen, setLetterOpen, onContinue }: { letterOpen: boolean; setLetterOpen: (open: boolean) => void; onContinue: () => void }) {
  return (
    <div className="content stage-content letter-content">
      <p className="eyebrow">words I hope you keep forever</p>
      <h2>A letter carrying<br /><em>all my love...</em></h2>
      {!letterOpen ? (
        <button className="envelope" onClick={() => setLetterOpen(true)} aria-label="Open love letter">
          <div className="envelope-back" />
          <div className="envelope-flap" />
          <div className="envelope-paper"><Mail size={20} /><span>open me</span></div>
          <Heart className="envelope-heart" size={22} fill="currentColor" />
        </button>
      ) : (
        <div className="letter-card">
          <div className="letter-stamp"><Heart size={15} fill="currentColor" /></div>
          <p>To my favorite person,</p>
          <h3>my love <span>♡</span></h3>
          <p>Somehow, you make the everyday feel like a little bit of magic. Thank you for your patience, your kindness, and the way you make me laugh when I need it most.</p>
          <p>You are the most beautiful part of my world — the comfort in my quiet moments, and the joy in my every day. Every single day with you feels like a gift.</p>
          <p>soft mornings, and big dreams your heart can hold.💖💞💝</p>
          <p className="signature">Always yours,<br /><em>with all my heart</em> <Heart size={14} fill="currentColor" /></p>
        </div>
      )}
      <ContinueButton visible={letterOpen} onClick={onContinue} label="Keep this love" />
    </div>
  );
}

function GiftStage({ giftOpen, setGiftOpen, onReplay }: { giftOpen: boolean; setGiftOpen: (open: boolean) => void; onReplay: () => void }) {
  return (
    <div className="content stage-content final-content">
      <p className="eyebrow">one last thing...</p>
      <h2>A tiny token<br /><em>of my love</em></h2>
      <p className="subheading">Tap the gift to open your final surprise.</p>
      {!giftOpen ? (
        <button className="gift-button" onClick={() => setGiftOpen(true)} aria-label="Open gift">
          <div className="gift-lid"><span /><i /></div>
          <div className="gift-box"><span /><i /></div>
          <div className="gift-bow"><b /><b /></div>
        </button>
      ) : (
        <div className="polaroid">
          <div className="couple-photo-wrapper">
            <img src={coupleImg} alt="You and Me" className="couple-photo" />
            <div className="photo-heart-overlay">♥</div>
          </div>
          <p>you + me, always</p>
        </div>
      )}
      {giftOpen && (
        <>
          <h3 className="final-line">Lots of love for you <Heart size={20} fill="currentColor" /></h3>
          <p className="closing">You are my favorite story, my safest place,<br />and the best thing that ever happened to me.</p>
          <button className="replay-button" onClick={onReplay}><RotateCcw size={14} /> Replay our little story</button>
        </>
      )}
      {!giftOpen && <p className="hint">made especially for you</p>}
    </div>
  );
}

function ContinueButton({ visible, onClick, label = 'Continue' }: { visible: boolean; onClick: () => void; label?: string }) {
  return (
    <button className={`continue-button ${visible ? 'is-visible' : ''}`} onClick={onClick} disabled={!visible}>
      {label}<ArrowRight size={16} />
    </button>
  );
}

export default App;
