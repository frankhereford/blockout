import { Text } from '@react-three/drei';

interface AxesLabelsProps {
    width: number;
    height: number;
    depth: number;
}

export function AxesLabels({width, height, depth}: AxesLabelsProps) {
    return (
        <>
            <Text position={[width + 1, 0, 0]} fontSize={1} color="red">X</Text>
            <Text position={[0, height + 1, 0]} fontSize={1} color="green">Y</Text>
            <Text position={[0, 0, depth + 1]} fontSize={1} color="blue">Z</Text>
            <Text position={[-.5, 0, -.5]} fontSize={1} color="white">O</Text>
        </>
    );
}