
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberOpinion, MainTopic, Position } from './types';
import HexCell from './components/HexCell';
import ConnectionLines from './components/ConnectionLines';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [mainTopic, setMainTopic] = useState<MainTopic>(() => {
    const saved = localStorage.getItem('mouchokro_topic');
    return saved ? JSON.parse(saved) : {
      title: 'আজকের বিষয়',
      description: 'এখানে আপনার মূল আলোচনার বিষয়বস্তু লিখুন...'
    };
  });
  
  const [members, setMembers] = useState<MemberOpinion[]>(() => {
    const saved = localStorage.getItem('mouchokro_members');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedMember, setSelectedMember] = useState<MemberOpinion | null>(null);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  
  // Board panning state
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // The logic center of the hive (always 0,0 in the pannable space)
  const centerPos: Position = { x: 0, y: 0 };

  // Persistence
  useEffect(() => {
    localStorage.setItem('mouchokro_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('mouchokro_topic', JSON.stringify(mainTopic));
  }, [mainTopic]);

  const addMember = () => {
    // Spiral placement logic: 
    // Uses the number of existing members to calculate a coordinate that doesn't overlap.
    const count = members.length;
    const angle = count * 0.9; // Golden angle-ish for distribution
    const radius = 240 + (count * 40); // Gradually expand outwards
    
    const newMember: MemberOpinion = {
      id: crypto.randomUUID(),
      name: '',
      opinion: '',
      links: '',
      score: 0,
      x: centerPos.x + Math.cos(angle) * radius - 110,
      y: centerPos.y + Math.sin(angle) * radius - 125,
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id: string, updates: Partial<MemberOpinion>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1a1a1a] touch-none">
      {/* Pannable Board Container */}
      <motion.div 
        ref={containerRef}
        drag
        dragMomentum={false}
        className="absolute w-[5000px] h-[5000px] cursor-move"
        style={{ 
          left: 'calc(50% - 2500px)', 
          top: 'calc(50% - 2500px)',
          x: boardOffset.x,
          y: boardOffset.y
        }}
        onDrag={(_, info) => setBoardOffset(prev => ({ x: prev.x + info.delta.x, y: prev.y + info.delta.y }))}
      >
        {/* Decorative Grid that moves with the board */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#FFB300 1px, transparent 1px)', 
               backgroundSize: '60px 60px' 
             }} />

        {/* Center Hive Origin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          
          {/* Connection Lines rendered relative to the pannable center */}
          <ConnectionLines 
            center={{ x: 0, y: 0 }} 
            members={members} 
          />

          {/* Main Topic Hexagon */}
          <div className="absolute -left-[130px] -top-[150px] z-30">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-[260px] h-[300px] hexagon-border relative cursor-pointer"
              onClick={() => setIsEditingTopic(true)}
            >
              <div className="w-full h-full bg-[#1a1a1a] hexagon-clip flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-[#FFB300] text-2xl font-bold mb-2 break-words w-full">
                  {mainTopic.title}
                </h1>
                <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">
                  {mainTopic.description}
                </p>
                <div className="mt-4 text-[10px] text-[#FFB300] uppercase tracking-widest opacity-50 font-bold">
                  মৌচক্র প্রধান শাখা
                </div>
              </div>
            </motion.div>
          </div>

          {/* Member Hexagons */}
          {members.map((member) => (
            <HexCell 
              key={member.id}
              member={member}
              onUpdate={(updates) => updateMember(member.id, updates)}
              onRemove={() => removeMember(member.id)}
              onView={() => setSelectedMember(member)}
              onRefine={() => {}}
            />
          ))}
        </div>
      </motion.div>

      {/* Persistent UI Elements (Overlay) */}
      <div className="fixed top-8 left-8 z-50 pointer-events-none">
        <h1 className="text-3xl font-bold text-[#FFB300] tracking-tighter flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 hexagon-border">
            <div className="w-full h-full bg-[#FFB300] hexagon-clip" />
          </div>
          মৌচক্র
        </h1>
        <div className="mt-2 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-amber-500/20 text-[10px] text-amber-500/60 uppercase tracking-widest">
          বোর্ডটি সরাতে ড্র্যাগ করুন
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
        <button 
          onClick={addMember}
          className="px-8 py-3 bg-[#FFB300] text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,179,0,0.3)] hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          সদস্য যোগ করুন
        </button>
      </div>

      <AnimatePresence>
        {isEditingTopic && (
          <Modal onClose={() => setIsEditingTopic(false)} title="মূল বিষয় পরিবর্তন করুন">
            <div className="space-y-4 p-2">
              <div>
                <label className="block text-[#FFB300] mb-2 font-medium">শিরোনাম</label>
                <input 
                  type="text"
                  value={mainTopic.title}
                  onChange={(e) => setMainTopic({ ...mainTopic, title: e.target.value })}
                  className="w-full bg-white/5 border border-amber-500/30 rounded p-2 focus:border-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#FFB300] mb-2 font-medium">বিস্তারিত</label>
                <textarea 
                  value={mainTopic.description}
                  onChange={(e) => setMainTopic({ ...mainTopic, description: e.target.value })}
                  className="w-full bg-white/5 border border-amber-500/30 rounded p-2 h-32 focus:border-amber-500 outline-none resize-none"
                />
              </div>
              <button 
                onClick={() => setIsEditingTopic(false)}
                className="w-full py-2 bg-[#FFB300] text-black font-bold rounded hover:bg-amber-400 transition-colors"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </Modal>
        )}

        {selectedMember && (
          <Modal onClose={() => setSelectedMember(null)} title={`${selectedMember.name || 'সদস্য'} এর মতামত`}>
            <div className="space-y-6 p-2">
              <div className="bg-white/5 p-4 rounded-lg border border-amber-500/10">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg italic">
                  "{selectedMember.opinion || 'কোন মতামত দেওয়া হয়নি'}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-[#FFB300]">
                <span className="text-sm font-bold uppercase tracking-widest opacity-50">লজিক স্কোর:</span>
                <span className="text-3xl font-black">{selectedMember.score || 0}</span>
              </div>

              {selectedMember.links && (
                <div>
                  <h4 className="text-[#FFB300] font-bold mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L7.04 14.33a2 2 0 002.828 2.828l1.101-1.101m.058-4.474l4.474-4.474a2 2 0 00-2.828-2.828l-4.474 4.474m.058 4.474l.439.439M15 15l2 2" />
                    </svg>
                    তথ্যসূত্র ও লিংক:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.links.split(',').map((link, idx) => {
                      const trimmed = link.trim();
                      if (!trimmed) return null;
                      const displayLink = trimmed.replace(/^https?:\/\//, '').slice(0, 30) + (trimmed.length > 30 ? '...' : '');
                      return (
                        <a 
                          key={idx} 
                          href={trimmed.startsWith('http') ? trimmed : `https://${trimmed}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded text-sm transition-colors border border-amber-500/20"
                        >
                          {displayLink}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
