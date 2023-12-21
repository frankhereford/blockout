import { useEffect, useMemo } from 'react';
import { Cube } from './primitives/Cube';
import { pieces } from './data/pieces';
import type { PieceType } from './data/pieces';
import { Vector3, Euler } from 'three';
import { useSprings } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'
import { usePieceStore } from '../stores/Piece';

interface SpringProps {
    location: SpringValue<number[]>;
}

interface PieceProps {
    piece?: PieceType;
    location?: Vector3;
    rotation?: Vector3;
}

const rotation_unit = Math.PI / 2;

const generateLocations = (piece: PieceType = 'tee', location: Vector3 = new Vector3(0, 0, 0), rotation: Vector3 = new Vector3(0, 0, 0)) => {
    const { coordinates, origin } = pieces[piece];
    const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);
    const locations: Vector3[] = [];

    coordinates.forEach(coordinate => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyEuler(eulerRotation);
        offsetCoordinate.add(origin);
        offsetCoordinate.add(location);
        locations.push(offsetCoordinate);
    });

    return locations;
};

export const Piece = ({ piece = 'tee', location = new Vector3(0, 0, 0), rotation = new Vector3(0, 0, 0) }: PieceProps) => {
    const { coordinates, color, origin } = pieces[piece];
    const pieceStoreName = usePieceStore((state) => state.pieceStoreName);
    const locationStore = usePieceStore((state) => state.locationStore);
    const rotationStore = usePieceStore((state) => state.rotationStore);
    const setCubesStore = usePieceStore((state) => state.setCubesStore);

    useEffect(() => {
        piece = pieceStoreName as PieceType;
        location = locationStore;
        rotation = rotationStore;
        const locations = generateLocations(piece, location, rotation);
        setCubesStore(locations);
    }, [pieceStoreName, locationStore, rotationStore]);


    const eulerRotation = new Euler(rotation.x * rotation_unit, rotation.y * rotation_unit, rotation.z * rotation_unit);

    const coordinatesWithEulerApplied = useMemo(() => coordinates.map(coordinate => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyEuler(eulerRotation);
        offsetCoordinate.add(origin);
        return offsetCoordinate;
    }), [coordinates, origin, eulerRotation]);


    const springs = useSprings(
        coordinatesWithEulerApplied.length,
        coordinatesWithEulerApplied.map((coordinate: Vector3) => ({
            location: [coordinate.x + location.x, coordinate.y + location.y, coordinate.z + location.z],
            config: { mass: 1, tension: 170, friction: 26 },
        }))
    );

    return (
        <>
            {springs.map((spring: SpringProps, index: number) => {
                return <Cube key={index} location={spring.location} color={color} />;
            })}
        </>
    );
};