const adjectives = ['Quick', 'Silent', 'Mighty', 'Brave', 'Swift', 'Dark', 'Light', 'Epic', 'Noble', 'Wild'];
const nouns = ['Warrior', 'Ninja', 'Dragon', 'Knight', 'Phoenix', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Lion'];
const numbers = Array.from({ length: 100 }, (_, i) => String(i).padStart(2, '0'));

export const generateRandomUsername = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = numbers[Math.floor(Math.random() * numbers.length)];
  return `${adj}${noun}${num}`;
}; 