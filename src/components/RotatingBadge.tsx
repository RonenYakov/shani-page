/**
 * Rotating circular badge — "Strategy • Content • Growth" ring around the
 * flower mark. Shared by Hero and ContactBlock; each parent scopes the ring /
 * text / core colors through its own CSS (.badge / .ct-badge).
 */
const RotatingBadge = ({ pathId, centerFill }: { pathId: string; centerFill: string }) => (
  <svg viewBox="0 0 120 120">
    <g className="ring">
      <defs>
        <path id={pathId} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text>
        <textPath href={`#${pathId}`} startOffset="0%">
          Strategy • Content • Growth •&nbsp;
        </textPath>
      </text>
    </g>
    <circle className="core" cx="60" cy="60" r="33" />
    <g className="flower-mark" transform="translate(48,48) scale(0.42)">
      <ellipse cx="12" cy="5.4" rx="2.5" ry="3.6" />
      <ellipse cx="12" cy="18.6" rx="2.5" ry="3.6" />
      <ellipse cx="5.4" cy="12" rx="3.6" ry="2.5" />
      <ellipse cx="18.6" cy="12" rx="3.6" ry="2.5" />
      <ellipse cx="7.2" cy="7.2" rx="2.7" ry="2.7" />
      <ellipse cx="16.8" cy="16.8" rx="2.7" ry="2.7" />
      <circle cx="12" cy="12" r="2.4" fill={centerFill} />
    </g>
  </svg>
);

export default RotatingBadge;
