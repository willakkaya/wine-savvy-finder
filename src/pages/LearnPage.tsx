import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Dot } from 'lucide-react';

const LearnPage: React.FC = () => {
  // SEO: meta description + canonical
  useEffect(() => {
    const desc = 'Learn about wine like a pro: grape varieties, tasting, pairing, regions, serving, and cellaring—clear, expert guidance.';
    const canonicalHref = `${window.location.origin}/learn`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalHref);

    // JSON-LD Article schema
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Learn About Wine: Varieties, Tasting, Pairing, Regions',
      description: desc,
      author: { '@type': 'Organization', name: 'WineCheck' },
      mainEntityOfPage: canonicalHref,
    };

    const scriptId = 'jsonld-learn-wine';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script') as HTMLScriptElement;
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    (script as HTMLScriptElement).textContent = JSON.stringify(ld);

    return () => {
      // leave tags for other pages to overwrite
    };
  }, []);

  // Scrollspy and smooth jump
  const sections = [
    { id: 'varieties', label: 'Varieties' },
    { id: 'tasting', label: 'Tasting' },
    { id: 'pairing', label: 'Pairing' },
    { id: 'regions', label: 'Regions' },
    { id: 'serving', label: 'Serving' },
    { id: 'glossary', label: 'Glossary' },
  ];
  const [activeId, setActiveId] = useState<string>('varieties');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0px 0px -60% 0px', threshold: [0.2, 0.6] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageContainer title="Learn About Wine" className="max-w-6xl mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Learn About Wine</h1>
      </header>

      <nav aria-label="On this page" className="mb-8 sticky top-16 z-20 bg-background/80 backdrop-blur border border-border/60 rounded-xl px-4 py-3 shadow-apple md:hidden">
        <ul className="flex flex-wrap gap-2 justify-center">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleJump(e, s.id)}
                  aria-current={active ? 'location' : undefined}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full transition ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    active
                      ? 'bg-primary/10 text-primary ring-primary/20'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 ring-transparent'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="md:grid md:grid-cols-12 md:gap-8">
        <aside className="hidden md:block md:col-span-3">
          <div className="sticky top-24">
            <div className="rounded-xl border border-border/60 bg-card p-4 shadow-apple">
              <p className="text-xs font-medium text-muted-foreground mb-2">On this page</p>
              <ul className="space-y-1">
                {sections.map((s) => {
                  const active = activeId === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => handleJump(e, s.id)}
                        aria-current={active ? 'location' : undefined}
                        className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition border-l-2 ${
                          active
                            ? 'text-primary bg-primary/5 border-primary'
                            : 'text-muted-foreground hover:bg-muted/60 border-transparent'
                        }`}
                      >
                        <Dot className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground/60'}`} />
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        <main className="md:col-span-9 space-y-8 text-[17px] md:text-[18px] leading-8">
          <section id="varieties" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">1) Grape Varieties & Styles</h2>
            <p className="text-foreground/90 mb-4">Grape variety shapes aroma, texture, and structure. Start with these benchmarks:</p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/90 marker:text-primary leading-relaxed">
              <li><strong>Cabernet Sauvignon</strong>: blackcurrant, cedar, firm tannin; great with grilled meats.</li>
              <li><strong>Pinot Noir</strong>: cherry, mushroom, silky tannin; versatile with poultry and salmon.</li>
              <li><strong>Syrah/Shiraz</strong>: blackberry, pepper, bold texture; excels with barbecue and stews.</li>
              <li><strong>Merlot</strong>: plum, cocoa, softer tannin; friendly with burgers, roasts.</li>
              <li><strong>Chardonnay</strong>: apple to tropical fruit; can be lean (unoaked) or creamy (oaked).</li>
              <li><strong>Sauvignon Blanc</strong>: citrus, herbs, vibrant acidity; perfect for salads and goat cheese.</li>
              <li><strong>Riesling</strong>: apple, jasmine; ranges dry to sweet; superb with spicy cuisine.</li>
              <li><strong>Champagne/Sparkling</strong>: citrus, brioche; refreshes palate, pairs broadly.</li>
            </ul>
          </section>

          <section id="tasting" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">2) How to Taste Like a Pro</h2>
            <article className="space-y-3 text-foreground/90">
              <p><strong>Look</strong>: assess color and intensity—age deepens whites (golden) and fades reds (brick rim).</p>
              <p><strong>Smell</strong>: swirl to release aromas; note fruit, floral, herbal, spice, oak, and earth tones.</p>
              <p><strong>Taste</strong>: evaluate <em>acidity</em> (mouthwatering), <em>tannin</em> (grip and dryness), <em>alcohol</em> (warmth), <em>body</em> (weight), and <em>finish</em> (length).</p>
              <p><strong>Conclusion</strong>: balance is key—no single element should dominate.</p>
            </article>
          </section>

          <section id="pairing" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">3) Food Pairing Fundamentals</h2>
            <div className="space-y-3 text-foreground/90">
              <p><strong>Match intensity</strong>: delicate wines with delicate dishes; bold with bold.</p>
              <p><strong>Acid loves fat</strong>: crisp whites and high-acid reds cut through rich, creamy foods.</p>
              <p><strong>Tannin tames protein</strong>: structured reds shine with steaks, lamb, and aged cheeses.</p>
              <p><strong>Sweet meets heat</strong>: off-dry whites complement spicy cuisines.</p>
              <p><strong>Sauce rules</strong>: pair to the sauce more than the protein.</p>
            </div>
          </section>

          <section id="regions" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">4) Regions to Know</h2>
            <div className="grid md:grid-cols-2 gap-6 text-foreground/90">
              <article>
                <h3 className="font-semibold mb-1">Old World</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-primary leading-relaxed">
                  <li><strong>Bordeaux</strong>: Cabernet/Merlot blends; cedar, cassis, structure.</li>
                  <li><strong>Burgundy</strong>: Pinot Noir and Chardonnay; purity, elegance, terroir.</li>
                  <li><strong>Champagne</strong>: benchmark sparkling; finesse, complexity.</li>
                  <li><strong>Barolo/Barbaresco</strong>: Nebbiolo; roses, tar, firm tannins.</li>
                </ul>
              </article>
              <article>
                <h3 className="font-semibold mb-1">New World</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-primary leading-relaxed">
                  <li><strong>Napa Valley</strong>: powerful Cabernet; ripe fruit, new oak.</li>
                  <li><strong>Sonoma</strong>: diverse styles; Pinot, Chardonnay, Zinfandel.</li>
                  <li><strong>Marlborough</strong>: zesty Sauvignon Blanc; citrus, passionfruit.</li>
                  <li><strong>Barossa</strong>: rich Shiraz; dark fruit, spice.</li>
                </ul>
              </article>
            </div>
          </section>

          <section id="serving" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">5) Serving & Cellaring</h2>
            <ul className="list-disc pl-5 space-y-2 text-foreground/90 marker:text-primary leading-relaxed">
              <li><strong>Temperature</strong>: Sparkling 42–50°F; Whites 45–55°F; Light Reds 55–60°F; Full Reds 60–65°F.</li>
              <li><strong>Glassware</strong>: larger bowls for reds, tulip shapes for whites and sparkling.</li>
              <li><strong>Decanting</strong>: soften tannins and blow off reduction; essential for young, structured reds.</li>
              <li><strong>Storage</strong>: steady 55°F, dark, minimal vibration; store bottles on their side (cork).</li>
            </ul>
          </section>

          <section id="glossary" className="rounded-xl border border-border border-t-2 border-primary/20 bg-card p-6 md:p-8 shadow-apple animate-fade-in scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 tracking-tight">Quick Glossary</h2>
            <div className="grid md:grid-cols-2 gap-6 text-foreground/90">
              <dl className="space-y-2">
                <dt className="font-semibold">Acidity</dt>
                <dd className="text-muted-foreground">Freshness and lift; makes wine feel lively.</dd>
                <dt className="font-semibold">Tannin</dt>
                <dd className="text-muted-foreground">Drying sensation from skins/oak; adds structure.</dd>
                <dt className="font-semibold">Body</dt>
                <dd className="text-muted-foreground">Weight on the palate; light to full.</dd>
              </dl>
              <dl className="space-y-2">
                <dt className="font-semibold">Dry vs. Sweet</dt>
                <dd className="text-muted-foreground">Dry has little residual sugar; sweet retains sugar.</dd>
                <dt className="font-semibold">Terroir</dt>
                <dd className="text-muted-foreground">Sense of place from soil, climate, and culture.</dd>
                <dt className="font-semibold">Finish</dt>
                <dd className="text-muted-foreground">Flavors that persist after swallowing.</dd>
              </dl>
            </div>
          </section>

          <aside className="bg-card border border-border rounded-lg p-4 shadow-apple">
            <p className="text-sm text-foreground/90"><strong>Pro tip:</strong> Keep notes on what you taste—variety, region, producer, vintage, and why you liked it. Patterns emerge quickly.</p>
          </aside>
        </main>
      </div>
    </PageContainer>
  );
};

export default LearnPage;
