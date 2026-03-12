import React from 'react';

const Slider = ({ label, value, min, max, step = 1, onChange, unit = 'px' }) => {
    return (
        <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-300">{label}</span>
                <span className="text-[10px] font-mono text-blue-400">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
    );
};

export default Slider;
