import React from 'react';
import { Navigation } from 'lucide-react';

const JunctionHub = ({
    hubSize,
    hubMode,
    dynamicHubPath,
    showInternalRibbons,
    hubBoundaryPath,
    internalPaths,
    useFixedRibbonWidth
}) => {
    return (
        <>
            {/* HUB GEOMETRY 2: Dynamic Polygon */}
            {hubMode === 2 && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    viewBox={`-${hubSize / 2} -${hubSize / 2} ${hubSize} ${hubSize}`}
                >
                    <path
                        d={dynamicHubPath}
                        fill="#161616"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        className="transition-all duration-500"
                        style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,1))' }}
                    />
                </svg>
            )}

            {/* INTERNAL RIBBONS */}
            {showInternalRibbons && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    viewBox={`-${hubSize / 2} -${hubSize / 2} ${hubSize} ${hubSize}`}
                >
                    <defs>
                        <clipPath id="hub-clip">
                            {hubMode === 2 || hubMode === 0 ? (
                                <path d={hubBoundaryPath} />
                            ) : (
                                <rect x={-hubSize / 2} y={-hubSize / 2} width={hubSize} height={hubSize} />
                            )}
                        </clipPath>
                    </defs>
                    <g clipPath="url(#hub-clip)">
                        {internalPaths.map((path) => (
                            <path
                                key={path.id}
                                d={path.d}
                                fill="none"
                                stroke={path.color}
                                strokeWidth={useFixedRibbonWidth ? 32 : Math.max(10, Math.min(26, (path.volume / 100) * 8))}
                                strokeOpacity="0.85"
                                strokeLinecap="round"
                                className="transition-all duration-700"
                            />
                        ))}
                    </g>
                </svg>
            )}

            <div className={`absolute inset-0 border border-white/[0.04] rounded-[2rem] pointer-events-none flex items-center justify-center ${hubMode === 0 && 'hidden'}`}>
                <Navigation size={hubSize / 6} className="text-neutral-100 opacity-5 rotate-45" />
            </div>
            
        </>
    );
};

export default JunctionHub;
