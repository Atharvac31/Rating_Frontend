import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="home-root">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-left">
          <span className="logo-icon material-symbols-outlined">rocket_launch</span>
          <h2 className="logo-text">RateIt</h2>
        </div>

        <div className="nav-right">
          <a href="#" className="nav-link">Features</a>
          <a href="#" className="nav-link">About Us</a>

          <Link to="/login" className="btn btn-outline">Log In</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Find and Rate Your Favorite Stores</h1>
          <p className="hero-sub">
            Join our community to share honest reviews and discover the best local businesses.
          </p>
          <Link to="/signup" className="btn btn-primary hero-btn">Get Started for Free</Link>
        </div>

        <div className="hero-right">
          <div
            className="hero-img"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsR9bVrl_iZoY_HQ5-0psk7cR0kOAliijPrG4cDRBY81LKyKLiRjb3yLSzRRTokrsFDd96ChRXNLiGuRdcNhgZ6iAi2a91uqsG--IbmBVhbOTD81HNOhv55KNf-HJjLkQaLqIcKH37EQP4to3_54ADGpCu_SS-pkhIZZnxXgakbYOF1E3VHkgAYErs3yj30AGbc0h79LpWTaAUmNjyMpDVk5Omgfl5oFZ3Y9nWknPlotYwWmkWm5GhMRZMFy6q-bwDHby6H6pOeroQ')",
            }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 className="section-title">Why You'll Love Our Platform</h2>

        <div className="features-grid">
          <div className="feature-card">
            <span className="material-symbols-outlined feature-icon">star</span>
            <h3 className="feature-title">Authentic Ratings</h3>
            <p className="feature-sub">Submit and view genuine ratings from 1 to 5 stars.</p>
          </div>

          <div className="feature-card">
            <span className="material-symbols-outlined feature-icon">search</span>
            <h3 className="feature-title">Discover Great Stores</h3>
            <p className="feature-sub">Easily find top-rated stores near you.</p>
          </div>

          <div className="feature-card">
            <span className="material-symbols-outlined feature-icon">person</span>
            <h3 className="feature-title">Simple Sign-Up</h3>
            <p className="feature-sub">Get started in seconds with our secure login system.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta">
        <h2 className="cta-title">Ready to get started?</h2>
        <p className="cta-sub">Join thousands of users finding the best local businesses today.</p>

        <Link to="/signup" className="btn btn-primary cta-btn">Sign Up Now</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2024 RateIt. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
