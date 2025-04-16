// app.jsx
import React from "react";
import Header from "./pages/Header";
import Content from "./pages/Content";

function App() {
  return (
    <div className="place-self-center min-h-20 w-3/4 border-2 border-t-0">
      <Header />
      <div className="p-4">
        <Content />
      </div>
    </div>
  );
}

export default App;
