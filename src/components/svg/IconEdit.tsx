import { ColorValue } from 'react-native'
import { Path, Svg } from 'react-native-svg'

export default function IconEdit({ size, color }: { size: number; color: ColorValue }) {
    return (
        <Svg viewBox="0 0 24 24" width={size} height={size}>
            <Path
                d="M17.665,10.455L20.755,7.365L16.635,3.245L13.545,6.335M17.665,10.455L7.365,20.755L3.245,20.755L3.245,16.635L13.545,6.335M17.665,10.455L13.545,6.335"
                fillOpacity={0}
                stroke={color}
                strokeWidth={1.5}
            />
        </Svg>
    )
}
