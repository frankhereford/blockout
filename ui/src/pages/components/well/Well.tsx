import React from 'react';
import GridPlane from './GridPlane';

interface WellProps {
    width: number;
    height: number;
    depth: number;
}

const Well: React.FC<WellProps> = ({ width, height, depth }) => {
    return (
        <>
            {/* Floor */}
            <GridPlane
                lowerLeft={{ x: 0, y: 0, z: 0 }}
                upperRight={{ x: width, y: 0, z: depth }}
            />
            {/* Front wall */}
            <GridPlane
                lowerLeft={{ x: 0, y: 0, z: 0 }}
                upperRight={{ x: width, y: height, z: 0 }}
            />
            {/* Back wall */}
            <GridPlane
                lowerLeft={{ x: 0, y: 0, z: depth }}
                upperRight={{ x: width, y: height, z: depth }}
            />
            {/* Left wall */}
            <GridPlane
                lowerLeft={{ x: 0, y: 0, z: 0 }}
                upperRight={{ x: 0, y: height, z: depth }}
            />
            {/* Right wall */}
            <GridPlane
                lowerLeft={{ x: width, y: 0, z: 0 }}
                upperRight={{ x: width, y: height, z: depth }}
            />
        </>
    );
};

export default Well;
