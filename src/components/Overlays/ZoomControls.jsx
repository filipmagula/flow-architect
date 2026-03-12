import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const ZoomControls = ({ handleZoomIn, handleZoomOut, handleAutoFit, zoom }) => {
    return (
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
            <button
                onClick={handleZoomIn}
                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all shadow-xl"
                title="Zoom In"
            >
                <ZoomIn size={20} />
            </button>
            <button
                onClick={handleZoomOut}
                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all shadow-xl"
                title="Zoom Out"
            >
                <ZoomOut size={20} />
            </button>
            <button
                onClick={handleAutoFit}
                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-neutral-800 transition-all shadow-xl mt-2"
                title="Fit to View"
            >
                <Maximize size={20} />
            </button>
            <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-neutral-500 text-center shadow-lg">
                {Math.round(zoom * 100)}%
            </div>
        </div>
    );
};

export default ZoomControls;
