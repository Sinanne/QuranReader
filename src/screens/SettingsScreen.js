import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { SPACING } from '../theme/spacing';
import AppText from '../components/common/AppText';
import { useStore } from '../store/useStore';
import { ArrowLeft, User, Bell, Moon, Download, Globe, HelpCircle, Shield, Info, LogOut, BookOpen, Edit2 } from 'lucide-react-native';
import { Slider } from 'react-native-elements';
import ProgressService from '../services/ProgressService';

const SettingsScreen = ({ navigation }) => {
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const settings = useStore(state => state.settings);
    const updateSetting = useStore(state => state.updateSetting);

    // Local state for sliders to prevent jumping
    const [pageGoal, setPageGoal] = useState(settings.dailyPageGoal || 15);
    const [memoGoal, setMemoGoal] = useState(settings.memorizationGoal || 5);

    const toggleLanguage = () => {
        const Order = ['en', 'fr', 'es'];
        const current = settings.readingLanguage || 'en';
        const next = Order[(Order.indexOf(current) + 1) % Order.length];
        updateSetting('readingLanguage', next);
    };

    const langLabels = { en: 'English', fr: 'Français', es: 'Español' };

    // Progress for the "Current Progress" card
    const [todayStats, setTodayStats] = useState({ pages: 0 });

    useEffect(() => {
        // Sync local state if global changes externally (rare, but good practice)
        setPageGoal(settings.dailyPageGoal || 15);
        setMemoGoal(settings.memorizationGoal || 5);
        loadProgress();
    }, [settings.dailyPageGoal, settings.memorizationGoal]);

    const loadProgress = async () => {
        // TODO: Refactor ProgressService to use Zustand if needed
        const pages = await ProgressService.getTodayPages();
        setTodayStats({ pages });
    };

    const handleSavePageGoal = (val) => {
        updateSetting('dailyPageGoal', Math.round(val));
    };

    const handleSaveMemoGoal = (val) => {
        updateSetting('memorizationGoal', Math.round(val));
    };

    const GoalCard = () => {
        const goal = settings.dailyPageGoal || 15;
        const current = todayStats.pages || 0;
        const progress = Math.min(current / goal, 1);

        return (
            <View style={[styles.goalCard, { backgroundColor: colors.surface }]}>
                <View style={styles.goalCardHeader}>
                    <View>
                        <AppText style={[styles.goalCardTitle, { color: colors.text }]}>Current Progress</AppText>
                        <AppText style={[styles.goalCardSubtitle, { color: colors.textSecondary }]}>{current} of {goal} pages read today</AppText>
                    </View>
                    <View style={[styles.goalIconContainer, { backgroundColor: colors.primary }]}>
                        <BookOpen color={'#FFF'} size={24} />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={[styles.progressBarBg, { backgroundColor: colors.secondary }]}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
                </View>
            </View>
        );
    };

    const SettingRow = ({ icon: Icon, label, value, onToggle, type = 'toggle', rightText }) => (
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIconContainer, { backgroundColor: isDarkMode ? 'rgba(42, 212, 106, 0.2)' : colors.highlight }]}>
                    <Icon size={20} color={colors.primary} />
                </View>
                <AppText style={[styles.settingLabel, { color: colors.text }]}>{label}</AppText>
            </View>

            {type === 'toggle' && (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={'#FFF'}
                />
            )}

            {type === 'link' && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {rightText && <AppText style={[styles.rightText, { color: colors.textSecondary }]}>{rightText}</AppText>}
                    <ArrowLeft size={16} color={colors.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={colors.text} size={24} />
                </TouchableOpacity>
                <AppText style={[styles.headerTitle, { color: colors.text }]}>Settings</AppText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <User size={40} color={colors.primary} />
                        <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                            <Edit2 size={12} color={'#FFF'} />
                        </View>
                    </View>
                    <AppText style={[styles.profileName, { color: colors.text }]}>Guest User</AppText>
                    <AppText style={[styles.profileEmail, { color: colors.textSecondary }]}>guest@quranreader.app</AppText>
                    <View style={[styles.premiumTag, { backgroundColor: isDarkMode ? 'rgba(42, 212, 106, 0.2)' : colors.highlight }]}>
                        <AppText style={[styles.premiumText, { color: colors.primary }]}>Start Premium</AppText>
                    </View>
                </View>

                <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>DAILY READING GOALS</AppText>

                <GoalCard />

                {/* Sliders */}
                <View style={[styles.sliderContainer, { backgroundColor: colors.surface }]}>
                    <View style={styles.sliderHeader}>
                        <AppText style={[styles.sliderLabel, { color: colors.text }]}>Daily Page Goal</AppText>
                        <AppText style={[styles.sliderValue, { color: colors.primary }]}>{Math.round(pageGoal)}</AppText>
                    </View>
                    <Slider
                        value={pageGoal}
                        onValueChange={setPageGoal}
                        onSlidingComplete={handleSavePageGoal}
                        minimumValue={1}
                        maximumValue={50}
                        step={1}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary }}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.secondary}
                    />
                </View>

                <View style={[styles.sliderContainer, { backgroundColor: colors.surface }]}>
                    <View style={styles.sliderHeader}>
                        <AppText style={[styles.sliderLabel, { color: colors.text }]}>Memorization (Verses)</AppText>
                        <AppText style={[styles.sliderValue, { color: colors.primary }]}>{Math.round(memoGoal)}</AppText>
                    </View>
                    <Slider
                        value={memoGoal}
                        onValueChange={setMemoGoal}
                        onSlidingComplete={handleSaveMemoGoal}
                        minimumValue={1}
                        maximumValue={20}
                        step={1}
                        thumbStyle={{ height: 20, width: 20, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary }}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.secondary}
                    />
                    <TouchableOpacity
                        style={{ marginTop: 12, alignItems: 'center', padding: 8, backgroundColor: colors.background, borderRadius: 8 }}
                        onPress={() => navigation.navigate('Memorization')}
                    >
                        <AppText style={{ color: colors.primary, fontWeight: 'bold' }}>View Hifz Dashboard</AppText>
                    </TouchableOpacity>
                </View>

                {/* App Preferences */}
                <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>APP PREFERENCES</AppText>
                <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
                    <SettingRow
                        icon={Bell}
                        label="Daily Reminders"
                        value={settings.dailyReminder}
                        onToggle={(v) => updateSetting('dailyReminder', v)}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <SettingRow
                        icon={Moon}
                        label="Dark Mode"
                        value={isDarkMode}
                        onToggle={() => toggleTheme()}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity onPress={() => { }}>
                        <SettingRow
                            icon={Download}
                            label="Audio Downloads"
                            type="link"
                        />
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity onPress={toggleLanguage}>
                        <SettingRow
                            icon={Globe}
                            label="Reading Language"
                            type="link"
                            rightText={langLabels[settings.readingLanguage || 'en']}
                        />
                    </TouchableOpacity>
                </View>

                {/* Support & Legal */}
                <AppText style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT & LEGAL</AppText>
                <View style={[styles.settingsGroup, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity onPress={() => { }}>
                        <SettingRow icon={HelpCircle} label="Help Center" type="link" />
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity onPress={() => { }}>
                        <SettingRow icon={Shield} label="Privacy Policy" type="link" />
                    </TouchableOpacity>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <TouchableOpacity onPress={() => { }}>
                        <SettingRow icon={Info} label="About Quran Reader" type="link" />
                    </TouchableOpacity>
                </View>

                {/* Sign Out */}
                <TouchableOpacity
                    style={[styles.signOutBtn, { backgroundColor: colors.surface, borderColor: 'rgba(255, 107, 107, 0.2)' }]}
                    onPress={() => Alert.alert("Sign Out", "This is a placeholder action.")}
                >
                    <LogOut size={20} color={'#FF6B6B'} style={{ marginRight: 8 }} />
                    <AppText style={styles.signOutText}>Sign Out</AppText>
                </TouchableOpacity>

                <AppText style={[styles.versionText, { color: colors.textSecondary }]}>Version 2.4.0 (Build 108)</AppText>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    backBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        marginBottom: SPACING.md,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 14,
        marginVertical: 4,
    },
    premiumTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: SPACING.xs,
    },
    premiumText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },
    goalCard: {
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    goalCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    goalCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    goalCardSubtitle: {
        fontSize: 13,
        marginTop: 4,
    },
    goalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    sliderContainer: {
        padding: SPACING.md,
        borderRadius: 12,
        marginBottom: SPACING.md,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sliderLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    sliderValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsGroup: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginLeft: 56, // indent past icon
        opacity: 0.1,
    },
    rightText: {
        marginRight: 8,
        fontSize: 14,
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        padding: SPACING.md,
        marginTop: SPACING.xl,
        borderWidth: 1,
    },
    signOutText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        marginTop: SPACING.lg,
        fontSize: 12,
    }
});

export default SettingsScreen;
