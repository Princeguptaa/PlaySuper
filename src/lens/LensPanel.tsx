import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/useAppStore';
import { EventStream } from './EventStream';
import { Funnel } from './Funnel';
import { EconomyMeter } from './EconomyMeter';
import { Simulator } from './Simulator';
import { SkinSwitcher } from './SkinSwitcher';
import { HypothesisCard } from './HypothesisCard';

export const LensPanel: React.FC = () => {
  const lensOpen = useAppStore(state => state.ui.lensOpen);
  const setLensOpen = useAppStore(state => state.setLensOpen);
  const variant = useAppStore(state => state.ui.variant);
  const switchVariant = useAppStore(state => state.switchVariant);
  const resetDemo = useAppStore(state => state.resetDemo);
  const events = useAppStore(state => state.events);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `events-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const PanelContent = (
    <div className="h-full flex flex-col bg-[#111] text-white p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold text-primary flex items-center space-x-2">
          <span>PM Lens</span>
        </h2>
        <button 
          className="lg:hidden text-[#a1a1aa] hover:text-white"
          onClick={() => setLensOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="bg-surface/10 border border-surface rounded-xl p-4 mb-4">
        <h3 className="font-bold mb-3">Store Variant</h3>
        <div className="flex bg-background border border-surface rounded p-1">
          <button
            className={`flex-1 py-1 text-sm rounded transition-colors ${variant === 'goal' ? 'bg-primary text-background font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
            onClick={() => switchVariant('goal')}
          >
            Goal Store
          </button>
          <button
            className={`flex-1 py-1 text-sm rounded transition-colors ${variant === 'classic' ? 'bg-primary text-background font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
            onClick={() => switchVariant('classic')}
          >
            Classic
          </button>
        </div>
      </div>

      <HypothesisCard />
      <EconomyMeter />
      <Simulator />
      <Funnel />
      <SkinSwitcher />
      <EventStream />
      
      <div className="mt-8 pt-4 border-t border-surface flex flex-col gap-2">
        <button 
          className="w-full py-2 bg-surface text-white rounded font-medium text-sm hover:bg-surface/80"
          onClick={handleExport}
        >
          Export Events (JSON)
        </button>
        <button 
          className="w-full py-2 bg-red-900/30 text-red-400 rounded font-medium text-sm hover:bg-red-900/50"
          onClick={() => {
            if (confirm('Are you sure you want to reset the demo? All progress will be lost.')) {
              resetDemo();
            }
          }}
        >
          Reset Demo
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static panel */}
      <div id="tour-step-4-desktop" className="hidden lg:block w-96 h-full border-l border-surface bg-[#0a0a0a]">
        {PanelContent}
      </div>

      {/* Tablet/Mobile slide-over/bottom sheet */}
      <AnimatePresence>
        {lensOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLensOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 h-[85vh] bg-[#0a0a0a] z-50 rounded-t-3xl border-t border-surface shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-surface rounded-full mx-auto my-3 shrink-0" />
              {PanelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
