import React, { useState } from 'react'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import useTheme from '../../../Theming'
import { ThemedButton, ThemedText } from '../../../components/ThemedComponents'

const QR_SIZE = 250

function QRCodeFrame({ data }: { data: string }) {
    return (
        <View style={{ padding: 10, backgroundColor: 'white' }}>
            <QRCode value={data} size={QR_SIZE} />
        </View>
    )
}

export default function SplitQRCode({ data }: { data: string }) {
    const theme = useTheme()

    const qrCodeChunks = splitDataIntoChunks(data, QR_SIZE)
    const [currentQRIndex, setCurrentQRIndex] = useState(0)

    const renderCurrentQRCode = () => {
        const currentChunk = qrCodeChunks[currentQRIndex]
        return <QRCodeFrame data={currentChunk} />
    }

    const handlePrevButton = () => {
        setCurrentQRIndex(prevIndex => Math.max(prevIndex - 1, 0))
    }

    const handleNextButton = () => {
        setCurrentQRIndex(prevIndex => Math.min(prevIndex + 1, qrCodeChunks.length - 1))
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{renderCurrentQRCode()}</View>
            {qrCodeChunks.length > 1 && (
                <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                    <View style={{ opacity: currentQRIndex === 0 ? 0.5 : 1 }}>
                        <ThemedButton
                            color={theme.color.primary_color}
                            title="Prev"
                            disabled={currentQRIndex === 0}
                            onPress={handlePrevButton}
                        />
                    </View>
                    <ThemedText
                        style={{
                            fontSize: 16,
                            textAlign: 'center',
                            marginHorizontal: 30,
                        }}>
                        Part {currentQRIndex + 1} of {qrCodeChunks.length}
                    </ThemedText>
                    <View style={{ opacity: currentQRIndex === qrCodeChunks.length - 1 ? 0.5 : 1 }}>
                        <ThemedButton
                            color={theme.color.primary_color}
                            title="Next"
                            disabled={currentQRIndex === qrCodeChunks.length - 1}
                            onPress={handleNextButton}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const splitDataIntoChunks = (data: string, chunkSize: number): string[] => {
    const chunks: string[] = []
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize))
    }
    return chunks
}
