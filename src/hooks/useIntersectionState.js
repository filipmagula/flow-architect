import { useState, useMemo, useCallback, useEffect } from 'react';

export const useIntersectionState = (initialType = '4-way') => {
    const [type, setType] = useState(initialType);
    const [arms, setArms] = useState([
        {
            id: 1,
            baseAngle: 0,
            angle: 0,
            label: 'North',
            ingressLanes: [
                { id: 'i1-1', name: 'Lane 1', volume: 150, movements: ['S', 'R'] },
                { id: 'i1-2', name: 'Lane 2', volume: 120, movements: ['L'] }
            ],
            egressLanes: [{ id: 'e1-1', name: 'Exit', volume: 270 }]
        },
        {
            id: 2,
            baseAngle: 90,
            angle: 0,
            label: 'East',
            ingressLanes: [{ id: 'i2-1', name: 'Lane 1', volume: 300, movements: ['S'] }],
            egressLanes: [{ id: 'e2-1', name: 'Exit', volume: 300 }]
        },
        {
            id: 3,
            baseAngle: 180,
            angle: 0,
            label: 'South',
            ingressLanes: [
                { id: 'i3-1', name: 'Lane 1', volume: 100, movements: ['S'] },
                { id: 'i3-2', name: 'Lane 2', volume: 200, movements: ['R'] }
            ],
            egressLanes: [{ id: 'e3-1', name: 'Exit', volume: 300 }]
        },
        {
            id: 4,
            baseAngle: 270,
            angle: 0,
            label: 'West',
            ingressLanes: [{ id: 'i4-1', name: 'Lane 1', volume: 150, movements: ['L', 'S', 'R'] }],
            egressLanes: [{ id: 'e4-1', name: 'Exit', volume: 150 }]
        },
    ]);

    useEffect(() => {
        if (type === '3-way') {
            setArms(prev => prev.slice(0, 3));
        } else if (type === '4-way' && arms.length < 4) {
            setArms(prev => {
                if (prev.length >= 4) return prev;
                return [...prev, {
                    id: 4,
                    baseAngle: 270,
                    angle: 0,
                    label: 'West',
                    ingressLanes: [{ id: 'i4-1', name: 'Lane 1', volume: 150, movements: ['S'] }],
                    egressLanes: [{ id: 'e4-1', name: 'Exit', volume: 150 }]
                }];
            });
        }
    }, [type]);

    const totalIngress = useMemo(() =>
        arms.reduce((sum, arm) => sum + arm.ingressLanes.reduce((s, l) => s + (parseInt(l.volume) || 0), 0), 0)
    , [arms]);

    const totalEgress = useMemo(() =>
        arms.reduce((sum, arm) => sum + arm.egressLanes.reduce((s, l) => s + (parseInt(l.volume) || 0), 0), 0)
    , [arms]);

    const delta = totalIngress - totalEgress;
    const deltaPercent = totalIngress > 0 ? (Math.abs(delta) / totalIngress) * 100 : 0;

    const updateArm = useCallback((id, updates) => {
        setArms(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }, []);

    const addLane = useCallback((armId, type) => {
        setArms(prev => prev.map(arm => {
            if (arm.id !== armId) return arm;
            if (type === 'egress') return arm; // App does not support multiple egresses
            if (arm.ingressLanes.length >= 5) return arm; // Max 5 ingress lanes

            const newName = `Lane ${arm.ingressLanes.length + 1}`;
            const newLane = { id: `i${armId}-${Date.now()}`, name: newName, volume: 0, movements: ['S'] };
            return { ...arm, ingressLanes: [...arm.ingressLanes, newLane] };
        }));
    }, []);

    const removeLane = useCallback((armId, type, laneId) => {
        setArms(prev => prev.map(arm => {
            if (arm.id !== armId) return arm;
            if (type === 'egress') return arm; // Exactly one egress per direction
            return { ...arm, ingressLanes: arm.ingressLanes.filter(l => l.id !== laneId) };
        }));
    }, []);

    const updateLane = useCallback((armId, type, laneId, field, value) => {
        setArms(prev => prev.map(arm => {
            if (arm.id !== armId) return arm;
            const listKey = type === 'ingress' ? 'ingressLanes' : 'egressLanes';
            const newLanes = arm[listKey].map(l => l.id === laneId ? { ...l, [field]: value } : l);
            return { ...arm, [listKey]: newLanes };
        }));
    }, []);

    const toggleMovement = useCallback((armId, laneId, move) => {
        setArms(prev => prev.map(arm => {
            if (arm.id !== armId) return arm;
            const lane = arm.ingressLanes.find(l => l.id === laneId);
            if (!lane) return arm;
            const newMoves = lane.movements.includes(move)
                ? lane.movements.filter(m => m !== move)
                : [...lane.movements, move];
            const newLanes = arm.ingressLanes.map(l => l.id === laneId ? { ...l, movements: newMoves } : l);
            return { ...arm, ingressLanes: newLanes };
        }));
    }, []);

    return {
        type, setType,
        arms, setArms,
        totalIngress, totalEgress, delta, deltaPercent,
        updateArm, addLane, removeLane, updateLane, toggleMovement
    };
};
