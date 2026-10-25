import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="hero" aria-labelledby="hero-heading">
      {!imageFailed && <img className="hero-image" src="/images/hero.jpg" alt="Tan leather tote, cream crossbody bag and black backpack on warm stone plinths" fetchpriority="high" onError={() => setImageFailed(true)} />}
      <div className="hero-fade" aria-hidden="true" />
      <div className="page-container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">The everyday collection</p>
          <h1 id="hero-heading">Carry your everyday.</h1>
          <p className="hero-subtitle">Thoughtfully selected bags for work, weekends, and everything in between.</p>
          <a href="#collection" className="primary-button">Shop bags <ArrowRight size={23} strokeWidth={1.5} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
