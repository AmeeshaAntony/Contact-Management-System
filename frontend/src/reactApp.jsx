import React from 'react';
import ReactDOM from 'react-dom/client';

function ReactComponent() {
  return <h2>This is a React Component</h2>;
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<ReactComponent />);
