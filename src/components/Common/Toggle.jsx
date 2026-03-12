import React from 'react';

const Toggle = ({ label, subLabel, enabled, onToggle }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs text-neutral-300">{label}</span>
                {subLabel && <span className="text-[9px] text-neutral-500 italic">{subLabel}</span>}
            </div>
            <button
                onClick={onToggle}
                className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-neutral-700'}`}
            >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
            </button>
        </div>
    );
};

export default Toggle;
