/* app.jsx — compose the full homepage */
function App() {
  return (
    <React.Fragment>
      <TopBar />
      <HeaderNav />
      <main>
        <Hero />
        <TrustBar />
        <MeetOwner />
        <ServiceCardGrid />
        <WhyChooseUs />
        <GoogleReviews />
        <FAQAccordion />
        <ContactForm />
      </main>
      <Footer />
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
