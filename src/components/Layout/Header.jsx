import React from 'react';
import {
    Activity,
    RotateCw,
    Download,
    Upload,
    Map as MapIcon,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen
} from 'lucide-react';

const Header = ({
    showSidebar,
    setShowSidebar,
    globalRotation,
    setGlobalRotation,
    handleExport,
    handleImport,
    showDebugSidebar,
    setShowDebugSidebar
}) => {
    return (
        <header className="px-6 py-2 bg-neutral-900 border-b border-white/5 flex justify-between items-center z-50 shadow-lg shrink-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 mr-1"
                    title={showSidebar ? "Hide Controls" : "Show Controls"}
                >
                    {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
                <div className="flex items-center">
                    <Activity size={20} className="text-emerald-500" />
                </div>
                <h1 className="text-lg font-bold tracking-tight text-white">Flow Architect</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 bg-neutral-800/50 px-3 py-1 rounded-full border border-white/5">
                    <RotateCw size={12} className="text-neutral-500" />
                    <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase w-16">Spin</span>
                    <input
                        type="range" min="-90" max="90" value={globalRotation}
                        onChange={(e) => setGlobalRotation(parseInt(e.target.value))}
                        className="w-24 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-[9px] font-mono text-blue-400 w-6 text-right">{globalRotation}°</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="p-1.5 h-8 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center gap-2"
                        title="Export Configuration"
                    >
                        <Download size={14} />
                        <span className="hidden xl:inline text-[8px] font-black uppercase tracking-widest">Export</span>
                    </button>
                    <div className="relative">
                        <input
                            type="file"
                            id="import-config"
                            className="hidden"
                            accept=".json"
                            onChange={handleImport}
                        />
                        <label
                            htmlFor="import-config"
                            className="p-1.5 h-8 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                            title="Import Configuration"
                        >
                            <Upload size={14} />
                            <span className="hidden xl:inline text-[8px] font-black uppercase tracking-widest">Import</span>
                        </label>
                    </div>

                    <button
                        onClick={() => setShowDebugSidebar(!showDebugSidebar)}
                        className={`p-1.5 rounded-lg transition-colors border ${showDebugSidebar ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                        title="View Settings"
                    >
                        {showDebugSidebar ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
