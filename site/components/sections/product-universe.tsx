import Image from 'next/image';
import { ArrowUpRight, Mail, Phone, ScanLine, Snowflake, Sparkles, Wind } from 'lucide-react';

import { campaigns, featureFiles, products } from '@/data/catalog';
import { AirconShowcase } from '@/components/experience/aircon-showcase';

export function ProductUniverse() {
  return (
    <div className="product-universe" id="collection">
      <nav className="portal-nav" aria-label="Product sections">
        <a className="portal-brand" href="#collection">DAIKIN<span>BY STRATO BUILDERS</span></a>
        <div><a href="#systems">Systems</a><a href="#explore-3d">Explore 3D</a><a href="#technology">Technology</a><a href="#campaigns">Journal</a></div>
        <a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={15} /></a>
      </nav>

      <section className="portal-intro" aria-labelledby="portal-title">
        <div className="intro-label"><span className="status-dot" /> COMFORT, CONSIDERED.</div>
        <div className="portal-intro__copy">
          <p className="kicker">Daikin × Strato Builders OPC · Cebu, Philippines</p>
          <h2 id="portal-title">Good design.<br />Great air.<br /><em>Better living.</em></h2>
          <div className="intro-bottom"><p className="lede">Spaces feel different when the climate is right. Discover Daikin cooling, thoughtfully specified and expertly installed by Strato Builders OPC.</p><a className="text-link" href="#systems">Find your system <ArrowUpRight size={19} /></a></div>
        </div>
        <div className="proof-row"><span><Snowflake size={20} /><b>Daikin technology</b>Comfort made intelligent</span><span><ScanLine size={20} /><b>One dedicated team</b>From design to maintenance</span><span><Wind size={20} /><b>Built around your space</b>Residential & commercial</span></div>
      </section>

      <section className="systems-section" id="systems" aria-labelledby="systems-title">
        <div className="section-heading"><p>01 / The collection</p><h2 id="systems-title">Your space.<br /><em>Your kind of cool.</em></h2><small>Explore the complete range. Every model and price guide is displayed below, ready to view.</small></div>
        <div className="product-grid">
          {products.map((product, index) => <article className="product-card" key={product.name}>
            <div className="product-card__heading"><span className="item-number">0{index + 1}</span><div><p>{product.tag}</p><h3>{product.name}</h3></div><Snowflake size={22} strokeWidth={1} /></div>
            <figure className="price-display"><Image src={product.image} alt={`${product.name} product configurations and pricing`} width={product.width} height={product.height} sizes="(max-width: 760px) 94vw, 46vw" /></figure>
            <div className="product-card__footer"><span>DAIKIN / WALL-MOUNTED SYSTEM</span><a href={`mailto:admin@stratobuilders.ph?subject=${encodeURIComponent('Quotation request: ' + product.name)}`}>Enquire <ArrowUpRight size={15} /></a></div>
          </article>)}
        </div>
        <p className="price-note">Published prices may change. Contact our team for a current quotation and installation scope tailored to your space.</p>
      </section>

      <AirconShowcase />

      <section className="technology-section" id="technology" aria-labelledby="technology-title">
        <div className="section-heading section-heading--light"><p>02 / Thoughtful technology</p><h2 id="technology-title">Feel the comfort.<br /><em>See the thinking.</em></h2><small>From precise airflow to intelligent controls, discover the details behind a better indoor environment.</small></div>
        <div className="feature-files">
          {featureFiles.map((feature) => <article key={feature.id} className="feature-file">
            <div className="feature-file__copy"><span className="item-number">{feature.id}</span><h3>{feature.title}</h3><p>{feature.caption}</p></div>
            <figure className="feature-file__image"><Image src={feature.image} alt={`${feature.title} Daikin technology information`} width={feature.width} height={feature.height} sizes="(max-width: 900px) 94vw, 65vw" /></figure>
          </article>)}
        </div>
      </section>

      <section className="service-ribbon" aria-label="Core services"><span><Snowflake /> Supply</span><span><ScanLine /> Design</span><span><Wind /> Installation</span><span><Sparkles /> Maintenance</span></section>

      <section className="campaigns-section" id="campaigns" aria-labelledby="campaigns-title">
        <div className="section-heading"><p>03 / The cooling journal</p><h2 id="campaigns-title">Fresh perspectives.<br /><em>Real possibilities.</em></h2><small>Residential comfort, commercial solutions, and the care that brings it all together.</small></div>
        <div className="campaign-wall">
          {campaigns.map((campaign, index) => <article key={campaign.title} className={`campaign-entry campaign-entry--${index + 1}`}>
            <figure className="campaign"><Image src={campaign.image} alt={`${campaign.title} campaign from Strato Builders OPC`} width={campaign.width} height={campaign.height} sizes="(max-width: 760px) 94vw, 46vw" /></figure>
            <div className="campaign-meta"><p>0{index + 1} / {campaign.type}</p><h3>{campaign.title}</h3></div>
          </article>)}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <p className="kicker"><span className="status-dot" /> Let’s make room for better air</p>
        <h2 id="contact-title">A better climate<br /><em>starts with a conversation.</em></h2>
        <div className="contact-actions">
          <a href="tel:+639568313526"><Phone size={21} strokeWidth={1.3} /><span>Call the team<small>+63 956 831 3526</small></span><ArrowUpRight /></a>
          <a href="mailto:admin@stratobuilders.ph"><Mail size={21} strokeWidth={1.3} /><span>Request a quotation<small>admin@stratobuilders.ph</small></span><ArrowUpRight /></a>
        </div>
        <div className="contact-footer"><strong>STRATO<br />BUILDERS OPC</strong><p>Daikin Authorized Dealer<br />VRV Gold Badge Accredited Installer</p><span>Cebu / Philippines<br />Better spaces. Brighter tomorrows.</span></div>
      </section>
    </div>
  );
}
