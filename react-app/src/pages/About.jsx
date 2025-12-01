import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <section className="section section-bg-light text-center">
        <div className="container">
          <h1>About Wiserdome</h1>
          <p>Protecting your legacy, preserving your peace of mind.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div>
              <h2 className="text-primary">Our Mission</h2>
              <p className="mb-md">Wiserdome was founded with a single purpose: to bridge the gap between NRIs and their homes in India. We understand the anxiety of managing a valuable asset from thousands of miles away.</p>
              <p>Our mission is to bring professional, corporate-grade property management to the Indian residential sector, ensuring transparency, legal safety, and asset appreciation for our global clients.</p>
            </div>
            <div className="image-placeholder">
              <span>Image: Team Meeting</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-bg-light">
        <div className="container">
          <h2 className="text-center section-title">Why NRIs Trust Us</h2>
          <div className="grid-3">
            <div className="card text-center">
              <div className="trust-icon">🛡️</div>
              <h3>Asset Protection</h3>
              <p>We treat your property like our own, ensuring it remains safe from encroachment and damage.</p>
            </div>
            <div className="card text-center">
              <div className="trust-icon">👁️</div>
              <h3>Total Transparency</h3>
              <p>No hidden costs. Every repair, bill, and transaction is documented and shared.</p>
            </div>
            <div className="card text-center">
              <div className="trust-icon">🤝</div>
              <h3>Local Expertise</h3>
              <p>Our ground teams know the local laws, vendors, and market rates inside out.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
