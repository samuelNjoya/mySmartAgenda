import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Card, Button, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//import { VictoryPie, VictoryChart, VictoryBar, VictoryTheme } from 'victory-native';
//import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const { theme } = useTheme();
    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({
        todayEvents: 3,
        pendingTasks: 5,
        currentStreak: 7,
        productivity: 85,
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Bonjour');
        else if (hour < 16) setGreeting('Bon après-midi');
        else setGreeting('Bonsoir');
    }, []);

    const quickActions = [
        { icon: 'plus-circle', title: 'Nouvel événement', color: theme.primary },
        { icon: 'format-list-checkbox', title: 'Nouvelle tâche', color: theme.secondary },
        { icon: 'repeat', title: 'Nouvelle habitude', color: theme.success },
        { icon: 'note-plus', title: 'Nouvelle note', color: theme.warning },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Réunion équipe', time: '10:00', color: '#6366f1' },
        { id: 2, title: 'Déjeuner client', time: '13:00', color: '#10b981' },
        { id: 3, title: 'Gym', time: '18:00', color: '#8b5cf6' },
    ];

    const motivationalQuotes = [
        "Le succès c'est tomber sept fois et se relever huit.",
        "La meilleure façon de prédire l'avenir est de le créer.",
        "Ne remettez pas à demain ce que vous pouvez faire aujourd'hui.",
    ];

    const chartData = [
        { x: 'Lun', y: 4 },
        { x: 'Mar', y: 6 },
        { x: 'Mer', y: 3 },
        { x: 'Jeu', y: 8 },
        { x: 'Ven', y: 5 },
        { x: 'Sam', y: 2 },
        { x: 'Dim', y: 1 },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* En-tête avec salutation */}
            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Avatar.Text
                        size={50}
                        label="UT"
                        style={{ backgroundColor: 'white' }}
                    />
                    <View style={styles.headerText}>
                        <Text style={styles.greeting}>{greeting},</Text>
                        <Text style={styles.username}>Utilisateur</Text>
                    </View>
                    <Icon name="weather-partly-cloudy" size={30} color="white" />
                </View>
            </LinearGradient>

            {/* Statistiques rapides */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Icon name="calendar-check" size={24} color={theme.primary} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {stats.todayEvents}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>Événements</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="checkbox-marked" size={24} color={theme.success} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {stats.pendingTasks}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>Tâches</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="fire" size={24} color={theme.warning} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {stats.currentStreak}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>Jours</Text>
                </View>
                <View style={styles.statCard}>
                    <Icon name="trending-up" size={24} color={theme.secondary} />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {stats.productivity}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.text }]}>Productivité</Text>
                </View>
            </View>

            {/* Actions rapides */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Actions rapides
            </Text>
            <View style={styles.quickActions}>
                {quickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.actionButton, { backgroundColor: action.color }]}
                    >
                        <Icon name={action.icon as any} size={28} color="white" />
                        <Text style={styles.actionText}>{action.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Événements à venir */}
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
                <Card.Title
                    title="Événements à venir"
                    left={(props) => <Icon {...props} name="clock-outline" size={24} color={theme.primary} />}
                    right={(props) => <Icon {...props} name="chevron-right" size={24} color={theme.text} />}
                />
                <Card.Content>
                    {upcomingEvents.map(event => (
                        <View key={event.id} style={styles.eventItem}>
                            <View style={[styles.eventDot, { backgroundColor: event.color }]} />
                            <View style={styles.eventDetails}>
                                <Text style={[styles.eventTitle, { color: theme.text }]}>
                                    {event.title}
                                </Text>
                                <Text style={[styles.eventTime, { color: theme.text }]}>
                                    {event.time}
                                </Text>
                            </View>
                            <Icon name="bell-outline" size={20} color={theme.text} />
                        </View>
                    ))}
                </Card.Content>
            </Card>

            {/* Graphique de productivité */}
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
                <Card.Title
                    title="Productivité hebdomadaire"
                    left={(props) => <Icon {...props} name="chart-bar" size={24} color={theme.primary} />}
                />
                <Card.Content>
                    <View style={styles.chartContainer}>
                        {chartData.map((item, index) => (
                            <View key={index} style={styles.barContainer}>
                                <View style={styles.barLabels}>
                                    <Text style={[styles.barLabel, { color: theme.text }]}>{item.x}</Text>
                                    <Text style={[styles.barValue, { color: theme.text }]}>{item.y}</Text>
                                </View>
                                <View style={[styles.barBackground, { backgroundColor: theme.background, }]}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                height: `${(item.y / 10) * 100}%`,
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

            {/* Citation du jour */}
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
                <Card.Title
                    title="Citation inspirante"
                    left={(props) => <Icon {...props} name="lightbulb-outline" size={24} color={theme.warning} />}
                />
                <Card.Content>
                    <Text style={[styles.quote, { color: theme.text }]}>
                        "{motivationalQuotes[1]}"
                    </Text>
                </Card.Content>
            </Card>

            {/* Widgets rapides */}
            <View style={styles.widgetsRow}>
                <Card style={[styles.widgetCard, { backgroundColor: theme.card }]}>
                    <Card.Content>
                        <Icon name="timer-outline" size={30} color={theme.primary} />
                        <Text style={[styles.widgetTitle, { color: theme.text }]}>
                            Pomodoro
                        </Text>
                        <Text style={[styles.widgetSubtitle, { color: theme.text }]}>
                            25:00
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.widgetCard, { backgroundColor: theme.card }]}>
                    <Card.Content>
                        <Icon name="water-outline" size={30} color={theme.primary} />
                        <Text style={[styles.widgetTitle, { color: theme.text }]}>
                            Hydratation
                        </Text>
                        <Text style={[styles.widgetSubtitle, { color: theme.text }]}>
                            6/8 verres
                        </Text>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        flex: 1,
        marginLeft: 15,
    },
    greeting: {
        fontSize: 18,
        color: 'white',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -20,
        marginBottom: 20,
    },
    statCard: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        width: (width - 60) / 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        width: (width - 60) / 2,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        color: 'white',
        marginTop: 5,
        fontWeight: '600',
    },
    card: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 15,
        elevation: 2,
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    eventDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    eventDetails: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    eventTime: {
        fontSize: 14,
        opacity: 0.7,
    },
    quote: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 24,
    },
    widgetsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    widgetCard: {
        width: (width - 50) / 2,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    widgetTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
    },
    widgetSubtitle: {
        fontSize: 14,
        marginTop: 5,
    },

    // AJOUTE ces styles :
    chartContainer: {
        flexDirection: 'row',
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barLabels: {
        alignItems: 'center',
        marginBottom: 5,
    },
    barLabel: {
        fontSize: 10,
        marginBottom: 2,
    },
    barValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    barBackground: {
        width: 20,
        height: 100,
        // backgroundColor: theme.background,
        borderRadius: 10,
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderRadius: 10,
    },
});