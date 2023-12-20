import { useEffect } from 'react';
import { Cube } from './primitives/Cube';
import { pieces } from './data/pieces';
import type { PieceType } from './data/pieces';
import { Vector3, Euler } from 'three';
import { useSpring} from '@react-spring/three'
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

    const createCubes = (coordinate: Vector3, index: number) => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyEuler(eulerRotation);
        offsetCoordinate.add(origin);
        const spring: SpringProps = useSpring({
            location: [offsetCoordinate.x + location.x, offsetCoordinate.y + location.y, offsetCoordinate.z + location.z],
            config: { mass: 1, tension: 170, friction: 26 },
        });

        return <Cube key={index} location={spring.location} color={color} />;
    };

    return (
        <>
            {coordinates.map(createCubes)}
        </>
    );
};