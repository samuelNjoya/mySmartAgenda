import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Button, Avatar, Modal, Portal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getQuoteOfTheDay } from '../services/quotesService';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { 
    events, 
    tasks, 
    habits, 
    stats, 
    dailyQuote,
    addEvent,
    addTask,
    addHabit,
    toggleTask,
    toggleHabit,
  } = useApp();
  
  const [greeting, setGreeting] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000), // +1 heure
    color: theme.primary,
    category: 'personal',
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: new Date(),
  });
  
  const [newHabit, setNewHabit] = useState({
    title: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 16) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');
  }, []);

  const quickActions = [
    { 
      icon: 'plus-circle', 
      title: 'Nouvel événement', 
      color: theme.primary,
      onPress: () => setShowEventModal(true)
    },
    { 
      icon: 'format-list-checkbox', 
      title: 'Nouvelle tâche', 
      color: theme.secondary,
      onPress: () => setShowTaskModal(true)
    },
    { 
      icon: 'repeat', 
      title: 'Nouvelle habitude', 
      color: theme.success,
      onPress: () => setShowHabitModal(true)
    },
    { 
      icon: 'note-plus', 
      title: 'Nouvelle note', 
      color: theme.warning,
      onPress: () => setShowNoteModal(true)
    },
  ];

  // Événements à venir (aujourd'hui)
  const upcomingEvents = events
    .filter(event => {
      const today = new Date().toDateString();
      return event.startDate.toDateString() === today && !event.completed;
    })
    .slice(0, 3)
    .map(event => ({
      id: event.id,
      title: event.title,
      time: event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: event.color || theme.primary,
    }));

  // Tâches prioritaires
  const priorityTasks = tasks
    .filter(task => !task.completed && task.priority === 'high')
    .slice(0, 3);

  // Habitudes du jour
  const todayHabits = habits.slice(0, 3);

  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour l\'événement');
      return;
    }
    
    try {
      await addEvent({
        ...newEvent,
        completed: false,
      });
      
      setShowEventModal(false);
      setNewEvent({
        title: '',
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
        color: theme.primary,
        category: 'personal',
      });
      
      Alert.alert('Succès', 'Événement ajouté avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'événement');
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour la tâche');
      return;
    }
    
    try {
      await addTask({
        ...newTask,
        completed: false,
      });
      
      setShowTaskModal(false);
      setNewTask({
        title: '',
        priority: 'medium',
        dueDate: new Date(),
      });
      
      Alert.alert('Succès', 'Tâche ajoutée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter la tâche');
    }
  };

  const handleAddHabit = async () => {
    if (!newHabit.title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour l\'habitude');
      return;
    }
    
    try {
      await addHabit({
        ...newHabit,
        streak: 0,
        completed: false,
      });
      
      setShowHabitModal(false);
      setNewHabit({
        title: '',
        frequency: 'daily',
      });
      
      Alert.alert('Succès', 'Habitude ajoutée avec succès');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'habitude');
    }
  };

  // Modals
  const renderEventModal = () => (
    <Portal>
      <Modal
        visible={showEventModal}
        onDismiss={() => setShowEventModal(false)}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.modalTitle, { color: theme.text }]}>
          Nouvel événement
        </Text>
        
        <TextInput
          label="Titre"
          value={newEvent.title}
          onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
          style={[styles.input, { backgroundColor: theme.background }]}
          theme={{ colors: { text: theme.text } }}
        />
        
        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowEventModal(false)}
            style={styles.modalButton}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={handleAddEvent}
            style={[styles.modalButton, { backgroundColor: theme.primary }]}
          >
            Ajouter
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const renderTaskModal = () => (
    <Portal>
      <Modal
        visible={showTaskModal}
        onDismiss={() => setShowTaskModal(false)}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.modalTitle, { color: theme.text }]}>
          Nouvelle tâche
        </Text>
        
        <TextInput
          label="Titre"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
          style={[styles.input, { backgroundColor: theme.background }]}
          theme={{ colors: { text: theme.text } }}
        />
        
        <View style={styles.prioritySelector}>
          {['low', 'medium', 'high'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                { 
                  backgroundColor: newTask.priority === priority 
                    ? theme.primary 
                    : theme.background,
                  borderColor: theme.primary,
                }
              ]}
              onPress={() => setNewTask({ ...newTask, priority: priority as any })}
            >
              <Text style={[
                styles.priorityText,
                { color: newTask.priority === priority ? 'white' : theme.text }
              ]}>
                {priority === 'low' ? 'Basse' : priority === 'medium' ? 'Moyenne' : 'Haute'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowTaskModal(false)}
            style={styles.modalButton}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={handleAddTask}
            style={[styles.modalButton, { backgroundColor: theme.primary }]}
          >
            Ajouter
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const renderHabitModal = () => (
    <Portal>
      <Modal
        visible={showHabitModal}
        onDismiss={() => setShowHabitModal(false)}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.modalTitle, { color: theme.text }]}>
          Nouvelle habitude
        </Text>
        
        <TextInput
          label="Titre"
          value={newHabit.title}
          onChangeText={(text) => setNewHabit({ ...newHabit, title: text })}
          style={[styles.input, { backgroundColor: theme.background }]}
          theme={{ colors: { text: theme.text } }}
        />
        
        <View style={styles.frequencySelector}>
          {['daily', 'weekly', 'monthly'].map((frequency) => (
            <TouchableOpacity
              key={frequency}
              style={[
                styles.frequencyButton,
                { 
                  backgroundColor: newHabit.frequency === frequency 
                    ? theme.primary 
                    : theme.background,
                  borderColor: theme.primary,
                }
              ]}
              onPress={() => setNewHabit({ ...newHabit, frequency: frequency as any })}
            >
              <Text style={[
                styles.frequencyText,
                { color: newHabit.frequency === frequency ? 'white' : theme.text }
              ]}>
                {frequency === 'daily' ? 'Quotidienne' : 
                 frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuelle'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={() => setShowHabitModal(false)}
            style={styles.modalButton}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={handleAddHabit}
            style={[styles.modalButton, { backgroundColor: theme.primary }]}
          >
            Ajouter
          </Button>
        </View>
      </Modal>
    </Portal>
  );

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

      {/* Statistiques dynamiques */}
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

      {/* Actions rapides avec fonctionnalités */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Actions rapides
      </Text>
      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={action.onPress}
          >
            <Icon name={action.icon as any} size={28} color="white" />
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Événements à venir dynamiques */}
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Title
          title="Événements à venir"
          left={(props) => <Icon {...props} name="clock-outline" size={24} color={theme.primary} />}
          right={(props) => (
            <TouchableOpacity onPress={() => navigation.navigate('Calendrier')}>
              <Icon {...props} name="chevron-right" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventItem}
                onPress={() => navigation.navigate('Calendrier')}
              >
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
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
              Aucun événement aujourd'hui
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Tâches prioritaires */}
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Title
          title="Tâches importantes"
          left={(props) => <Icon {...props} name="alert-circle" size={24} color={theme.warning} />}
          right={(props) => (
            <TouchableOpacity onPress={() => navigation.navigate('Tâches')}>
              <Icon {...props} name="chevron-right" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          {priorityTasks.length > 0 ? (
            priorityTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity onPress={() => toggleTask(task.id)}>
                  <Icon 
                    name={task.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                    size={24} 
                    color={theme.primary} 
                  />
                </TouchableOpacity>
                <View style={styles.taskDetails}>
                  <Text style={[styles.taskTitle, { 
                    color: theme.text,
                    textDecorationLine: task.completed ? 'line-through' : 'none'
                  }]}>
                    {task.title}
                  </Text>
                  <View style={[styles.priorityBadge, { 
                    backgroundColor: task.priority === 'high' ? theme.error : 
                                   task.priority === 'medium' ? theme.warning : theme.success 
                  }]}>
                    <Text style={styles.priorityBadgeText}>
                      {task.priority === 'high' ? 'Haute' : 
                       task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Icon name="dots-vertical" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
              Aucune tâche prioritaire
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Citation du jour dynamique */}
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Card.Title
          title="Citation du jour"
          left={(props) => <Icon {...props} name="lightbulb-outline" size={24} color={theme.warning} />}
          right={(props) => (
            <TouchableOpacity onPress={() => {
              Alert.alert('Citation du jour', getQuoteOfTheDay());
            }}>
              <Icon {...props} name="refresh" size={24} color={theme.text} />
            </TouchableOpacity>
          )}
        />
        <Card.Content>
          <Text style={[styles.quote, { color: theme.text }]}>
            "{dailyQuote}"
          </Text>
        </Card.Content>
      </Card>

      {/* Widgets rapides */}
      <View style={styles.widgetsRow}>
        <Card 
          style={[styles.widgetCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Tâches', { tab: 'pomodoro' })}
        >
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
        <Card 
          style={[styles.widgetCard, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Tâches', { tab: 'habits' })}
        >
          <Card.Content>
            <Icon name="fire" size={30} color={theme.warning} />
            <Text style={[styles.widgetTitle, { color: theme.text }]}>
              Streak
            </Text>
            <Text style={[styles.widgetSubtitle, { color: theme.text }]}>
              {habits.length > 0 ? `${Math.max(...habits.map(h => h.streak))} jours` : 'Aucun'}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Modals */}
      {renderEventModal()}
      {renderTaskModal()}
      {renderHabitModal()}
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
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskDetails: {
    flex: 1,
    marginLeft: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 10,
  },
  // Styles pour les modals
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  frequencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  frequencyButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});