
import React from 'react';
import { Position, MemberOpinion } from '../types';
import { HEX_WIDTH, HEX_HEIGHT } from '../constants';

interface ConnectionLinesProps {
  center: Position;
  members: MemberOpinion[];
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ center, members }) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB300" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFB300" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {members.map((member) => (
        <line
          key={member.id}
          x1={center.x}
          y1={center.y}
          x2={member.x + HEX_WIDTH / 2}
          y2={member.y + HEX_HEIGHT / 2}
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          className="glow-line"
          style={{ filter: 'url(#glow)' }}
        />
      ))}
    </svg>
  );
};

export default ConnectionLines;
