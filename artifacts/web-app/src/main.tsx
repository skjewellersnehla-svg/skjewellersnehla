import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <main className="legacy-shell">
      <p className="eyebrow">SK Jewellers · Nehla</p>
      <h1>Jewellery for your chapter.</h1>
      <p className="body">
        Please use the current SK Jewellers storefront for the complete
        catalogue and enquiry experience.
      </p>
      <a href="/">Open storefront</a>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);