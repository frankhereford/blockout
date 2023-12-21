/* eslint-disable @typescript-eslint/prefer-for-of */
import { useState, useEffect } from 'react';
import Well from "./well/Well";
import { Camera } from './Camera';
import { Lighting } from "./lights/Lighting";
import { AxesLabels } from "./well/AxesLabels";
import { GroundPlane } from "./GroundPlane";
import { Piece } from './Piece';
import { Vector3, Quaternion } from "three";
import { usePieceStore } from "../stores/Piece"; //
import type { PieceType } from './data/pieces';
import { Pile } from './Pile';
import { pieces } from './data/pieces';
import { useInterval } from 'react-use';

type Cube = { location: Vector3, id: string, visible: boolean };
type Pile = Cube[][][];
interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

const roundVector3 = (vector: Vector3): Vector3 => {
    return new Vector3(
        Math.round(vector.x),
        Math.round(vector.y),
        Math.round(vector.z)
    );
};

function getLandingY(pile: Pile, cubes: Vector3[]): number {
    let landingY = Math.max(...cubes.map(cube => cube.y));
    for (let y = landingY; y >= 0; y--) {
        const adjustedCubes = cubes.map(cube => new Vector3(cube.x, y, cube.z));
        const flattenedPile = ([] as Cube[]).concat(...pile.map(row => ([] as Cube[]).concat(...row)));
        const visibleCubes = flattenedPile.filter(cube => cube.visible);
        const intersects = adjustedCubes.some(cube1 =>
            visibleCubes.some(cube2 =>
                cube1.x === cube2.location.x &&
                cube1.y === cube2.location.y &&
                cube1.z === cube2.location.z
            )
        );
        if (intersects) {
            return y + 1;
        }
    }
    return 0;
}
export const Scene = ({ width, height, depth }: SceneProps) => {
    const startingPosition = new Vector3((width / 2) - .5, height - 2, (width / 2) - .5);

    const [location, setLocation] = useState(startingPosition);
    const [rotation, setRotation] = useState(new Quaternion());
    const [pieceName, setPieceName] = useState<PieceType>('tee');
    const [position, setPosition] = useState<Vector3[]>([]);
    const [isFalling, setIsFalling] = useState<boolean>(true);

    const setPieceStoreName = usePieceStore((state) => state.setPieceStoreName);
    const setLocationStore = usePieceStore((state) => state.setLocationStore);
    const setRotationStore = usePieceStore((state) => state.setRotationStore);
    const cubesStore = usePieceStore((state) => state.cubesStore);  // remember, this is the location of the next requested move, granted or not
    const locationStore = usePieceStore((state) => state.locationStore);
    const rotationStore = usePieceStore((state) => state.rotationStore);

    const [dropInterval, setDropInterval] = useState(1000);


    useEffect(() => {
        setLocationStore(location);
    }, []);

    const initialPile: { location: Vector3, id: string, visible: boolean }[][][] = new Array(width).fill(null).map((_, x) =>
        new Array(height).fill(null).map((_, y) =>
            new Array(depth).fill(null).map((_, z) => ({
                location: new Vector3(x, y, z),
                id: `${x}-${y}-${z}`,
                visible: false,
            }))
        )
    );
    const [pile, setPile] = useState(initialPile);


    const updatePosition = (newLocation: Vector3, newRotation: Quaternion) => {
        setPieceStoreName(pieceName);
        setLocationStore(newLocation);
        setRotationStore(newRotation);
    };

    useEffect(() => {
        const roundedCubes = cubesStore.map(cube => roundVector3(new Vector3(cube.x, cube.y, cube.z)));

        const flattenedPile = ([] as Cube[]).concat(...pile.map(row => ([] as Cube[]).concat(...row)));
        const visibleCubes = flattenedPile.filter(cube => cube.visible);
        const intersects = roundedCubes.some(cube1 =>
            visibleCubes.some(cube2 =>
                cube1.x === cube2.location.x &&
                cube1.y === cube2.location.y &&
                cube1.z === cube2.location.z
            )
        );
        if (intersects) {
            const newPile = addPieceToPile(pile, position);
            setPile(newPile);
            return;
        }
        const allCubesAboveFloor = roundedCubes.every(cube => cube.y >= 0);

        if (!allCubesAboveFloor) {
            const newPile = addPieceToPile(pile, position);
            setPile(newPile);
        }

        const allCubesInWell = roundedCubes.every(cube =>
            cube.x >= 0 && cube.x < width &&
            cube.y >= 0 && 
            cube.z >= 0 && cube.z < depth
        );
        if (allCubesInWell) {
            setPosition(cubesStore);
            setLocation(locationStore);
            setRotation(rotationStore);
        }
        
    }, [cubesStore]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            let newLocation: Vector3 = location;
            const newRotation: Quaternion = rotation.clone();
            let newPile: Pile = pile;
            switch (event.code) {
                case 'ArrowUp':
                    newLocation = new Vector3(location.x, location.y, location.z - 1);
                    break;
                case 'ArrowDown':
                    newLocation = new Vector3(location.x, location.y, location.z + 1);
                    break;
                case 'ArrowLeft':
                    newLocation = new Vector3(location.x - 1, location.y, location.z);
                    break;
                case 'ArrowRight':
                    newLocation = new Vector3(location.x + 1, location.y, location.z);
                    break;
                case 'PageUp':
                    newLocation = new Vector3(location.x, location.y + 1, location.z);
                    break;
                case 'PageDown':
                    newLocation = new Vector3(location.x, location.y - 1, location.z);
                    break;
                case 'KeyQ':
                    const globalRotationQ = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
                    newRotation.premultiply(globalRotationQ);
                    break;
                case 'KeyW':
                    const globalRotationW = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
                    newRotation.premultiply(globalRotationW);
                    break;
                case 'KeyE':
                    const globalRotationE = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
                    newRotation.premultiply(globalRotationE);
                    break;
                case 'KeyA':
                    const landingY = getLandingY(pile, position);
                    newLocation = new Vector3(location.x, landingY, location.z);
                    break;
                case 'KeyO':
                    setIsFalling(prev => !prev);
                    break;
                case 'KeyZ':
                    newPile = makeRandomCubeVisible(pile);
                    setPile(newPile);
                    return;
                case 'KeyX':
                    newPile = makeRandomCubeInvisible(pile);
                    setPile(newPile);
                    return;
                case 'KeyC':
                    newPile = addPieceToPile(pile, position);
                    setPile(newPile);
                    return;
                case 'KeyV':
                    createPiece();
                    return;
                case 'KeyF':
                    console.log("position: ", position)
                    return;
                case 'Digit1':
                    newPile = emptyPlaneAndShiftAbove(pile, 0);
                    setPile(newPile);
                    return;
                case 'Digit2':
                    newPile = emptyPlaneAndShiftAbove(pile, 1);
                    setPile(newPile);
                    return;
                case 'Digit3':
                    newPile = emptyPlaneAndShiftAbove(pile, 2);
                    setPile(newPile);
                    return;
                case 'Digit4':
                    newPile = emptyPlaneAndShiftAbove(pile, 3);
                    setPile(newPile);
                    return;
                case 'Digit5':
                    newPile = emptyPlaneAndShiftAbove(pile, 4);
                    setPile(newPile);
                    return;
                case 'Digit6':
                    newPile = emptyPlaneAndShiftAbove(pile, 5);
                    setPile(newPile);
                    return;
                case 'Digit7':
                    newPile = emptyPlaneAndShiftAbove(pile, 6);
                    setPile(newPile);
                    return;
                default:
                    return;
            }
            updatePosition(newLocation, newRotation);
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [location, rotation, pile, cubesStore]);

    // Inside your component
    useInterval(() => {
        if (!isFalling) return;
        const newRotation: Quaternion = rotation.clone();
        const newLocation = new Vector3(location.x, location.y - 1, location.z);
        updatePosition(newLocation, newRotation);
    }, dropInterval);



    function makeRandomCubeVisible(pile: Pile): Pile {
        const newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        const flattenedCubes = newPile.flat(3);
        const invisibleCubes = flattenedCubes.filter(cube => !cube.visible);
        if (invisibleCubes.length === 0) {
            return pile;
        }
        const randomCube = invisibleCubes[Math.floor(Math.random() * invisibleCubes.length)];
        randomCube!.visible = true;
        return newPile;
    }

    function makeRandomCubeInvisible(pile: Pile): Pile {
        const newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        const flattenedCubes = newPile.flat(3);
        const visibleCubes = flattenedCubes.filter(cube => cube.visible);
        if (visibleCubes.length === 0) {
            return pile;
        }
        const randomCube = visibleCubes[Math.floor(Math.random() * visibleCubes.length)];
        randomCube!.visible = false;
        return newPile;
    }

    function emptyPlaneAndShiftAbove(pile: Pile, plane: number): Pile {
        const newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        for (let x = 0; x < newPile.length; x++) {
            for (let z = 0; z < newPile[x]![plane]!.length; z++) {
                newPile[x]![plane]![z]!.visible = false;
            }
        }
        for (let y = plane + 1; y < newPile[0]!.length; y++) {
            for (let x = 0; x < newPile.length; x++) {
                for (let z = 0; z < newPile[x]![y]!.length; z++) {
                    if (newPile[x]![y]![z]!.visible) {
                        newPile[x]![y - 1]![z]!.visible = true;
                        newPile[x]![y]![z]!.visible = false;
                    }
                }
            }
        }
        return newPile;
    }

    function checkFullPlanes(pile: Pile): Pile {
        const planesToEmpty: number[] = [];
        for (let y = 0; y < pile[0]!.length; y++) {
            let isPlaneFull = true;
            for (let x = 0; x < pile.length; x++) {
                for (let z = 0; z < pile[x]![y]!.length; z++) {
                    if (!pile[x]![y]![z]!.visible) {
                        isPlaneFull = false;
                        break;
                    }
                }
                if (!isPlaneFull) break;
            }
            if (isPlaneFull) {
                planesToEmpty.push(y);
            }
        }
        let newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        for (const plane of planesToEmpty) {
            newPile = emptyPlaneAndShiftAbove(newPile, plane);
        }
        return newPile;
    }

    function addPieceToPile(pile: Pile, position: Vector3[]): Pile {
        let newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        const roundedCubes = position.map(cube => roundVector3(new Vector3(cube.x, cube.y, cube.z)));
        //console.log('newPile', newPile)
        for (const cube of roundedCubes) {
            newPile[cube.x]![cube.y]![cube.z]!.visible = true;
        }
        newPile = checkFullPlanes(newPile);
        createPiece();
        return newPile;
    }

    function createPiece() {
        const keys = Object.keys(pieces) as PieceType[];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setPieceName(randomKey!);
        setLocation(startingPosition);
        setRotation(new Quaternion());
        //console.log("createPiece: ", pieceName, location, rotation)
    }

    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
            <Pile cubes={pile} />
            <Piece piece={pieceName} location={location} rotation={rotation.clone()} />
        </>
    );
};
