import { Text } from '@react-three/drei';

export function AxesLabels() {
    return (
        <>
            <Text position={[5, 0, 0]} fontSize={1} color="red">X</Text>
            <Text position={[0, 5, 0]} fontSize={1} color="green">Y</Text>
            <Text position={[0, 0, 5]} fontSize={1} color="blue">Z</Text>
        </>
    );
}