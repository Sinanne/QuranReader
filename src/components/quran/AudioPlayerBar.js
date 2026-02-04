import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';
import AppText from '../common/AppText';
import { Play, Pause, SkipBack, SkipForward, X, ListMusic } from 'lucide-react-native';

const AudioPlayerBar = ({
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    currentAyahLabel = 'Ayah 1',
    onClose
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <View style={{ width: '30%', height: '100%', backgroundColor: COLORS.brand.primary }} />
            </View>

            <View style={styles.content}>
                <View style={styles.leftInfo}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={20} color={COLORS.text.secondary} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 8 }}>
                        <AppText style={styles.label}>{currentAyahLabel}</AppText>
                    </View>
                </View>

                <View style={styles.controls}>
                    <TouchableOpacity onPress={onPrev}>
                        <SkipBack size={24} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.playBtn} onPress={onPlayPause}>
                        {isPlaying ? (
                            <Pause size={24} color={COLORS.brand.background} fill={COLORS.brand.background} />
                        ) : (
                            <Play size={24} color={COLORS.brand.background} fill={COLORS.brand.background} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onNext}>
                        <SkipForward size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.rightActions}>
                    <ListMusic size={24} color={COLORS.text.secondary} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.brand.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.brand.highlight,
        paddingBottom: SPACING.md,
    },
    progressBar: {
        height: 2,
        backgroundColor: COLORS.brand.highlight,
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
    },
    leftInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    closeBtn: {
        padding: 4,
    },
    label: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    playBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    rightActions: {
        flex: 1,
        alignItems: 'flex-end',
    }
});

export default AudioPlayerBar;
