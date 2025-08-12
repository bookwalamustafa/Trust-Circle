import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Steps from '../components/Steps';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';
import '../css/App.css';
import '../css/LandingPage.css';

function LandingPage() {
  return (
    <div className="App">
      <GridBackground />
      <Header />
      <Hero />
      <Steps />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;