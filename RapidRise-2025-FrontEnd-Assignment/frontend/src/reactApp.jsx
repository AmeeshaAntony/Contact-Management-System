import React from 'react';
import ReactDOM from 'react-dom/client';

function ReactComponent() {
  return <h2></h2>;
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<ReactComponent />);
