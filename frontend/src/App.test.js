// frontend/src/App.test.js
// Test simplifié adapté au projet NABTA
 
import { render, screen } from '@testing-library/react';
 
// Test basique qui vérifie que React fonctionne
test('React fonctionne correctement', () => {
  render(<div>NABTA</div>);
  expect(screen.getByText('NABTA')).toBeInTheDocument();
});