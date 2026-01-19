
import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { MemberOpinion } from '../types';
import { HEX_WIDTH, HEX_HEIGHT } from '../constants';

interface HexCellProps {
  member: MemberOpinion;
  onUpdate: (updates: Partial<MemberOpinion>) => void;
  onRemove: () => void;
  onView: () => void;
  onRefine: () => void;
}

const HexCell: React.FC<HexCellProps> = ({ member, onUpdate, onRemove, onView }) => {
  const [isEditing, setIsEditing] = useState(!member.name);
  const controls = useDragControls();

  const handleDrag = (_: any, info: any) => {
    // Coordinate updates are relative to the hive center
    onUpdate({ x: member.x + info.delta.x, y: member.y + info.delta.y });
  };

  const handleVote = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    onUpdate({ score: (member.score || 0) + delta });
  };

  const score = member.score || 0;

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onDrag={handleDrag}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: member.x, y: member.y }}
      // Use z-index to bring active/grabbed hexagon to front
      className="absolute cursor-grab active:cursor-grabbing z-20 group"
      style={{ width: HEX_WIDTH, height: HEX_HEIGHT }}
    >
      <div className="w-full h-full hexagon-border shadow-xl group-hover:scale-[1.05] transition-transform duration-300">
        <div className="w-full h-full bg-[#1a1a1a]/95 backdrop-blur-xl hexagon-clip flex flex-col items-center p-4 relative overflow-hidden">
          
          {/* Drag Handle Top */}
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="absolute top-2 w-10 h-1.5 bg-amber-500/30 rounded-full cursor-ns-resize hover:bg-amber-500/60 transition-colors z-20"
          />

          {isEditing ? (
            <div className="w-full h-full flex flex-col gap-2 pt-8">
              <input 
                placeholder="নাম"
                value={member.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full bg-white/5 border-b border-amber-500/30 text-xs p-1 focus:border-amber-500 outline-none text-white text-center"
              />
              <textarea 
                placeholder="মতামত..."
                value={member.opinion}
                onChange={(e) => onUpdate({ opinion: e.target.value })}
                className="w-full flex-grow bg-white/5 border border-amber-500/30 text-xs p-2 rounded focus:border-amber-500 outline-none text-white resize-none"
              />
              <input 
                placeholder="লিংক (কমা দিয়ে লিখুন)"
                value={member.links}
                onChange={(e) => onUpdate({ links: e.target.value })}
                className="w-full bg-white/5 border-b border-amber-500/30 text-[10px] p-1 focus:border-amber-500 outline-none text-white text-center"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-grow py-1 bg-[#FFB300] text-black font-bold text-[10px] rounded hover:bg-amber-400 active:scale-95"
                >
                  সংরক্ষণ
                </button>
                <button 
                  onClick={onRemove}
                  className="px-2 py-1 bg-red-500/20 text-red-500 text-[10px] rounded border border-red-500/30 hover:bg-red-500/40"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center pt-8 text-center" onClick={onView}>
              <h3 className="text-[#FFB300] font-bold text-sm mb-1 truncate w-full px-2 flex items-center justify-center gap-1.5">
                <span className="truncate max-w-[110px]">{member.name || 'বেনামী'}</span>
                <span className="bg-amber-500/20 text-[#FFB300] px-1.5 py-0.5 rounded text-[10px] font-black border border-amber-500/30 min-w-[22px]">
                  {score}
                </span>
              </h3>
              
              <div className="flex-grow flex items-center justify-center px-2 overflow-hidden">
                <p className="text-gray-400 text-[10px] line-clamp-4 italic leading-tight">
                  {member.opinion || 'কোন মতামত নেই...'}
                </p>
              </div>
              
              {/* Actions Footer */}
              <div className="flex items-center gap-2 mt-2 mb-2 pb-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                  className="p-1.5 bg-amber-500/10 text-[#FFB300] rounded-full hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>

                <div className="flex items-center gap-1 bg-black/40 rounded-full px-1 py-1 border border-amber-500/20">
                  <button 
                    onClick={(e) => handleVote(e, -1)}
                    className="w-7 h-7 flex items-center justify-center bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/30 active:scale-90 transition-all border border-red-500/20"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => handleVote(e, 1)}
                    className="w-7 h-7 flex items-center justify-center bg-green-500/10 text-green-500 rounded-full hover:bg-green-500/30 active:scale-90 transition-all border border-green-500/20"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HexCell;
