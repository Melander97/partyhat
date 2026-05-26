type PartyhatColor = 'red' | 'yellow' | 'blue' | 'green' | 'white' | 'purple';

interface PartyhatProps {
  color?: PartyhatColor;
  size?: number;
  className?: string;
}

const colorMap: Record<PartyhatColor, { base: string; highlight: string; shadow: string }> = {
  red: { base: '#d62828', highlight: '#ff5252', shadow: '#9a1818' },
  yellow: { base: '#f1c40f', highlight: '#ffe066', shadow: '#b8860b' },
  blue: { base: '#2a6fdb', highlight: '#5b9bff', shadow: '#1a4a99' },
  green: { base: '#27ae60', highlight: '#5cd99a', shadow: '#1a7a3f' },
  white: { base: '#e8e8e8', highlight: '#ffffff', shadow: '#9a9a9a' },
  purple: { base: '#8e44ad', highlight: '#b878d6', shadow: '#5c2c75' },
};

export function Partyhat({ color = 'red', size = 220, className }: PartyhatProps) {
  const { base, highlight, shadow } = colorMap[color];
  const aspectHeight = (size * 180) / 220; // maintain 220x180 aspect ratio

  return (
    <svg
      width={size}
      height={aspectHeight}
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`A ${color} partyhat`}
    >
      {/* Shadow underneath */}
      <ellipse cx="110" cy="168" rx="70" ry="6" fill="#000000" opacity="0.4" />

      {/* Main crown body */}
      <path
        d="M 30 160 L 30 90 L 50 30 L 70 95 L 90 25 L 110 100 L 130 25 L 150 95 L 170 30 L 190 90 L 190 160 Z"
        fill={base}
      />

      {/* Left-side highlight */}
      <path
        d="M 30 160 L 30 90 L 50 30 L 70 95 L 90 25 L 110 100 L 110 160 Z"
        fill={highlight}
        opacity="0.55"
      />

      {/* Darker base band */}
      <rect x="30" y="148" width="160" height="12" fill={shadow} opacity="0.5" />

      {/* Seam line */}
      <line x1="30" y1="100" x2="190" y2="100" stroke="#000000" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}
