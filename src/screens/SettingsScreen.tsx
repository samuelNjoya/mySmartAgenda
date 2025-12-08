import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { Card, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [syncEnabled, setSyncEnabled] = useState(true);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

    const statisticsData = [
        { day: 'Lun', events: 4, tasks: 6 },
        { day: 'Mar', events: 6, tasks: 8 },
        { day: 'Mer', events: 3, tasks: 4 },
        { day: 'Jeu', events: 8, tasks: 10 },
        { day: 'Ven', events: 5, tasks: 7 },
        { day: 'Sam', events: 2, tasks: 3 },
        { day: 'Dim', events: 1, tasks: 2 },
    ];

    const achievements = [
        { id: 1, name: 'Productif', description: '7 jours de productivité', icon: 'rocket', achieved: true },
        { id: 2, name: 'Consistant', description: '30 habitudes complétées', icon: 'fire', achieved: true },
        { id: 3, name: 'Organisé', description: '50 tâches terminées', icon: 'check-all', achieved: true },
        { id: 4, name: 'Maître du temps', description: '100 événements planifiés', icon: 'clock', achieved: false },
    ];

    const appSettings = [
        {
            title: 'Notifications',
            description: 'Rappels et alertes',
            icon: 'bell',
            right: () => (
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#767577', true: theme.primary }}
                />
            ),
        },
        {
            title: 'Synchronisation',
            description: 'Sauvegarde cloud',
            icon: 'cloud',
            right: () => (
                <Switch
                    value={syncEnabled}
                    onValueChange={setSyncEnabled}
                    trackColor={{ false: '#767577', true: theme.primary }}
                />
            ),
        },
        {
            title: 'Mode sombre',
            description: 'Activer/désactiver',
            icon: 'theme-light-dark',
            right: () => (
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: theme.primary }}
                />
            ),
        },
        {
            title: 'Analytics',
            description: 'Statistiques d\'usage',
            icon: 'chart-bar',
            right: () => (
                <Switch
                    value={analyticsEnabled}
                    onValueChange={setAnalyticsEnabled}
                    trackColor={{ false: '#767577', true: theme.primary }}
                />
            ),
        },
    ];

    const moreOptions = [
        { title: 'Catégories personnalisées', icon: 'tag', action: () => { } },
        { title: 'Export des données', icon: 'export', action: () => { } },
        { title: 'Sauvegarde locale', icon: 'content-save', action: () => { } },
        { title: 'Mot de passe', icon: 'lock', action: () => { } },
        { title: 'Aide & Support', icon: 'help-circle', action: () => { } },
        { title: 'À propos', icon: 'information', action: () => { } },
    ];

    const exportData = () => {
        Alert.alert(
            'Exporter les données',
            'Choisissez le format d\'export',
            [
                { text: 'PDF', onPress: () => console.log('Export PDF') },
                { text: 'ICS', onPress: () => console.log('Export ICS') },
                { text: 'JSON', onPress: () => console.log('Export JSON') },
                { text: 'Annuler', style: 'cancel' },
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* En-tête profil */}
            <Card style={[styles.profileCard, { backgroundColor: theme.card }]}>
                <Card.Content style={styles.profileContent}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Icon name="account" size={40} color="white" />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: theme.text }]}>
                            Utilisateur
                        </Text>
                        <Text style={[styles.profileEmail, { color: theme.text + '80' }]}>
                            utilisateur@exemple.com
                        </Text>
                        <TouchableOpacity style={styles.upgradeButton}>
                            <Text style={styles.upgradeText}>Passer à Premium</Text>
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>

            {/* Statistiques */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Statistiques
            </Text>
            <Card style={[styles.statsCard, { backgroundColor: theme.card }]}>
                <Card.Content>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Icon name="calendar-check" size={24} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>156</Text>
                            <Text style={[styles.statLabel, { color: theme.text }]}>Événements</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="checkbox-marked" size={24} color={theme.success} />
                            <Text style={[styles.statValue, { color: theme.text }]}>89</Text>
                            <Text style={[styles.statLabel, { color: theme.text }]}>Tâches</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="fire" size={24} color={theme.warning} />
                            <Text style={[styles.statValue, { color: theme.text }]}>21</Text>
                            <Text style={[styles.statLabel, { color: theme.text }]}>Streak</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="trending-up" size={24} color={theme.secondary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>87%</Text>
                            <Text style={[styles.statLabel, { color: theme.text }]}>Productivité</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Graphique d'activité */}
            <Card style={[styles.chartCard, { backgroundColor: theme.card }]}>
                <Card.Title
                    title="Activité hebdomadaire"
                    titleStyle={{ color: theme.text }}
                    left={(props) => <Icon {...props} name="chart-line" size={24} color={theme.primary} />}
                />
                <Card.Content>
                    <View style={styles.activityChart}>
                        {statisticsData.map((item, index) => (
                            <View key={index} style={styles.activityBarContainer}>
                                <View style={styles.activityLabels}>
                                    <Text style={[styles.activityLabel, { color: theme.text }]}>{item.day}</Text>
                                    <Text style={[styles.activityValue, { color: theme.text }]}>
                                        {item.events + item.tasks}
                                    </Text>
                                </View>
                                <View style={[styles.activityBarBackground, { backgroundColor: theme.background, }]}>
                                    <View
                                        style={[
                                            styles.activityBarFill,
                                            {
                                                height: `${((item.events + item.tasks) / 18) * 100}%`,
                                                backgroundColor: theme.primary
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            {/* Réalisations */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Réalisations
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.achievementsScroll}
            >
                {achievements.map(achievement => (
                    <Card
                        key={achievement.id}
                        style={[
                            styles.achievementCard,
                            {
                                backgroundColor: theme.card,
                                opacity: achievement.achieved ? 1 : 0.6
                            }
                        ]}
                    >
                        <Card.Content style={styles.achievementContent}>
                            <View style={[
                                styles.achievementIcon,
                                { backgroundColor: achievement.achieved ? theme.primary + '20' : theme.background }
                            ]}>
                                <Icon
                                    name={achievement.icon as any}
                                    size={30}
                                    color={achievement.achieved ? theme.primary : theme.text + '50'}
                                />
                            </View>
                            <Text style={[styles.achievementName, { color: theme.text }]}>
                                {achievement.name}
                            </Text>
                            <Text style={[styles.achievementDescription, { color: theme.text + '80' }]}>
                                {achievement.description}
                            </Text>
                            {achievement.achieved && (
                                <Icon name="check-circle" size={20} color={theme.success} style={styles.badgeIcon} />
                            )}
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            {/* Paramètres */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Paramètres
            </Text>
            <Card style={[styles.settingsCard, { backgroundColor: theme.card }]}>
                {appSettings.map((setting, index) => (
                    <React.Fragment key={setting.title}>
                        <List.Item
                            title={setting.title}
                            description={setting.description}
                            left={props => <List.Icon {...props} icon={setting.icon} color={theme.primary} />}
                            right={setting.right}
                            titleStyle={{ color: theme.text }}
                            descriptionStyle={{ color: theme.text + '80' }}
                        />
                        {index < appSettings.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Card>

            {/* Plus d'options */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Plus d'options
            </Text>
            <Card style={[styles.optionsCard, { backgroundColor: theme.card }]}>
                {moreOptions.map((option, index) => (
                    <React.Fragment key={option.title}>
                        <List.Item
                            title={option.title}
                            left={props => <List.Icon {...props} icon={option.icon} color={theme.text} />}
                            right={props => <List.Icon {...props} icon="chevron-right" color={theme.text} />}
                            onPress={option.action}
                            titleStyle={{ color: theme.text }}
                        />
                        {index < moreOptions.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Card>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card }]}
                    onPress={exportData}
                >
                    <Icon name="export" size={24} color={theme.primary} />
                    <Text style={[styles.actionText, { color: theme.text }]}>
                        Exporter
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card }]}
                    onPress={() => Alert.alert('Sauvegarde', 'Sauvegarde démarrée')}
                >
                    <Icon name="cloud-upload" size={24} color={theme.success} />
                    <Text style={[styles.actionText, { color: theme.text }]}>
                        Sauvegarder
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card }]}
                    onPress={() => Alert.alert('Déconnexion', 'Êtes-vous sûr ?')}
                >
                    <Icon name="logout" size={24} color={theme.error} />
                    <Text style={[styles.actionText, { color: theme.text }]}>
                        Déconnexion
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Version */}
            <Text style={[styles.versionText, { color: theme.text + '60' }]}>
                Smart Agenda v1.0.0
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profileCard: {
        margin: 15,
        borderRadius: 15,
        elevation: 3,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        marginBottom: 10,
    },
    upgradeButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    upgradeText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        marginVertical: 10,
    },
    statsCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    chartCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 2,
    },
    achievementsScroll: {
        paddingLeft: 15,
        paddingRight: 5,
        marginBottom: 15,
    },
    achievementCard: {
        width: 140,
        marginRight: 10,
        borderRadius: 12,
        elevation: 1,
    },
    achievementContent: {
        alignItems: 'center',
        padding: 15,
    },
    achievementIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    achievementName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        textAlign: 'center',
    },
    achievementDescription: {
        fontSize: 12,
        textAlign: 'center',
    },
    badgeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    settingsCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 2,
    },
    optionsCard: {
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 15,
        elevation: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        marginHorizontal: 5,
        elevation: 1,
    },
    actionText: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 30,
    },

    // AJOUTE ces styles :
    activityChart: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    activityBarContainer: {
        alignItems: 'center',
        flex: 1,
    },
    activityLabels: {
        alignItems: 'center',
        marginBottom: 5,
    },
    activityLabel: {
        fontSize: 10,
        marginBottom: 2,
    },
    activityValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activityBarBackground: {
        width: 15,
        height: 100,
        //  backgroundColor: theme.background,
        borderRadius: 7,
        overflow: 'hidden',
    },
    activityBarFill: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderRadius: 7,
    },
});