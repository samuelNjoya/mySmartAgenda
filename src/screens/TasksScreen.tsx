import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Card, Checkbox, FAB, SegmentedButtons, Chip } from 'react-native-paper';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
//import { VictoryPie } from 'victory-native';
import { useTheme } from '../context/ThemeContext';

export default function TasksScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Préparer présentation', completed: false, priority: 'high', category: 'work' },
    { id: '2', title: 'Acheter cadeau', completed: true, priority: 'medium', category: 'personal' },
    { id: '3', title: 'Réserver hôtel', completed: false, priority: 'high', category: 'travel' },
    { id: '4', title: 'Réviser React Native', completed: false, priority: 'medium', category: 'education' },
    { id: '5', title: 'Faire les courses', completed: false, priority: 'low', category: 'personal' },
  ]);

  const [habits, setHabits] = useState([
    { id: '1', title: 'Méditation', streak: 7, frequency: 'daily', completed: true },
    { id: '2', title: 'Sport', streak: 3, frequency: 'daily', completed: false },
    { id: '3', title: 'Lecture', streak: 14, frequency: 'daily', completed: true },
    { id: '4', title: 'Journaling', streak: 21, frequency: 'daily', completed: true },
  ]);

  const categories = [
    { id: 'all', name: 'Tout', icon: 'view-grid', color: theme.primary },
    { id: 'work', name: 'Travail', icon: 'briefcase', color: theme.primary },
    { id: 'personal', name: 'Perso', icon: 'account', color: theme.success },
    { id: 'health', name: 'Santé', icon: 'heart', color: theme.secondary },
    { id: 'education', name: 'Éducation', icon: 'school', color: theme.warning },
  ];

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 } : habit
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'medium',
        category: 'personal'
      }]);
      setNewTask('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.text;
    }
  };
  // Calcule les statistiques des habitudes
  const completedCount = habits.filter(h => h.completed).length;
  const missedCount = habits.filter(h => !h.completed).length;
  const completionPercentage = habits.length > 0 
    ? Math.round((completedCount / habits.length) * 100) 
    : 0;
  const renderTasksTab = () => (
    <>
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: theme.card }]}>
          <Icon name="checkbox-marked-outline" size={24} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {tasks.filter(t => t.completed).length}/{tasks.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Terminées</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.card }]}>
          <Icon name="alert-circle-outline" size={24} color={theme.warning} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {tasks.filter(t => t.priority === 'high').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Importantes</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.card }]}>
          <Icon name="trending-up" size={24} color={theme.success} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Productivité</Text>
        </View>
      </View>

      {/* Filtres par catégorie */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.card }
            ]}
          >
            <Icon name={category.icon as any} size={20} color={category.color} />
            <Text style={[styles.categoryButtonText, { color: theme.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ajout rapide de tâche */}
      <Card style={[styles.addTaskCard, { backgroundColor: theme.card }]}>
        <Card.Content style={styles.addTaskContent}>
          <TextInput
            style={[styles.taskInput, { 
              color: theme.text, 
              backgroundColor: theme.background 
            }]}
            placeholder="Ajouter une nouvelle tâche..."
            placeholderTextColor={theme.text + '80'}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={addTask}
          >
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Liste des tâches */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.taskCard, { backgroundColor: theme.card }]}>
            <Card.Content>
              <View style={styles.taskRow}>
                <Checkbox.Android
                  status={item.completed ? 'checked' : 'unchecked'}
                  onPress={() => toggleTask(item.id)}
                  color={theme.primary}
                />
                <View style={styles.taskContent}>
                  <Text 
                    style={[
                      styles.taskTitle,
                      { 
                        color: theme.text,
                        textDecorationLine: item.completed ? 'line-through' : 'none',
                        opacity: item.completed ? 0.6 : 1
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View style={styles.priorityBadge}>
                      <View 
                        style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(item.priority) }
                        ]} 
                      />
                      <Text style={[styles.priorityText, { color: theme.text + '80' }]}>
                        {item.priority === 'high' ? 'Haute' : 
                         item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Text>
                    </View>
                    <Chip 
                      icon="briefcase" 
                      style={[styles.categoryChip, { backgroundColor: theme.background }]}
                      textStyle={{ color: theme.text }}
                    >
                      Travail
                    </Chip>
                  </View>
                </View>
                <TouchableOpacity style={styles.taskMenu}>
                  <Icon name="dots-vertical" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.tasksList}
      />
    </>
  );

  const renderHabitsTab = () => (
    <>
      {/* Statistiques des habitudes */}
      <View style={styles.habitsStats}>
        <Card style={[styles.habitStatCard, { backgroundColor: theme.card }]}>
          <Card.Content>
            <Text style={[styles.habitStatTitle, { color: theme.text }]}>
              Streak actuel
            </Text>
            <Text style={[styles.habitStatValue, { color: theme.primary }]}>
              {Math.max(...habits.map(h => h.streak))} jours
            </Text>
          </Card.Content>
        </Card>
        <Card style={[styles.habitStatCard, { backgroundColor: theme.card }]}>
          <Card.Content>
            <Text style={[styles.habitStatTitle, { color: theme.text }]}>
              Complétion
            </Text>
            <Text style={[styles.habitStatValue, { color: theme.success }]}>
              {Math.round((habits.filter(h => h.completed).length / habits.length) * 100)}%
            </Text>
          </Card.Content>
        </Card>
      </View>

    {/* Graphique des habitudes */}
{/* Graphique des habitudes (version barres) */}
<Card style={[styles.habitsChartCard, { backgroundColor: theme.card }]}>
  <Card.Content>
    <View style={styles.barChartContainer}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>
        Progression des habitudes
      </Text>
      
      <View style={styles.barChart}>
        {habits.map((habit, index) => {
          const progress = (habit.streak / 30) * 100; // Sur 30 jours max
          return (
            <View key={habit.id} style={styles.barItem}>
              <View style={styles.barLabelContainer}>
                <Text 
                  style={[styles.barLabel, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {habit.title}
                </Text>
                <Text style={[styles.barStreak, { color: theme.text + '80' }]}>
                  {habit.streak}j
                </Text>
              </View>
              
              <View style={[styles.barBackground, { backgroundColor: theme.background }]}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: habit.completed ? theme.success : theme.error 
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
      
      <View style={styles.chartStats}>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={20} color={theme.success} />
          <Text style={[styles.statText, { color: theme.text }]}>
            {completedCount} complétés
          </Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="close-circle" size={20} color={theme.error} />
          <Text style={[styles.statText, { color: theme.text }]}>
            {missedCount} manqués
          </Text>
        </View>
      </View>
    </View>
  </Card.Content>
</Card>

      {/* Liste des habitudes */}
      {habits.map(habit => (
        <Card key={habit.id} style={[styles.habitCard, { backgroundColor: theme.card }]}>
          <Card.Content>
            <View style={styles.habitRow}>
              <TouchableOpacity
                style={[
                  styles.habitCheckbox,
                  { 
                    backgroundColor: habit.completed ? theme.success : 'transparent',
                    borderColor: habit.completed ? theme.success : theme.border
                  }
                ]}
                onPress={() => toggleHabit(habit.id)}
              >
                {habit.completed && (
                  <Icon name="check" size={20} color="white" />
                )}
              </TouchableOpacity>
              <View style={styles.habitContent}>
                <Text style={[styles.habitTitle, { color: theme.text }]}>
                  {habit.title}
                </Text>
                <View style={styles.habitMeta}>
                  <View style={styles.streakContainer}>
                    <Icon name="fire" size={16} color={theme.warning} />
                    <Text style={[styles.streakText, { color: theme.text }]}>
                      {habit.streak} jours
                    </Text>
                  </View>
                  <Chip 
                    icon="repeat" 
                    style={[styles.frequencyChip, { backgroundColor: theme.background }]}
                    textStyle={{ color: theme.text }}
                  >
                    Quotidien
                  </Chip>
                </View>
              </View>
              <View style={styles.habitActions}>
                <TouchableOpacity style={styles.habitAction}>
                  <Icon name="chart-line" size={20} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.habitAction}>
                  <Icon name="bell-outline" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Sélecteur d'onglets */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          {
            value: 'tasks',
            label: 'Tâches',
            icon: 'format-list-checkbox',
            uncheckedColor: theme.text,
            checkedColor: theme.primary,
          },
          {
            value: 'habits',
            label: 'Habitudes',
            icon: 'repeat',
            uncheckedColor: theme.text,
            checkedColor: theme.primary,
          },
          {
            value: 'pomodoro',
            label: 'Pomodoro',
            icon: 'timer-outline',
            uncheckedColor: theme.text,
            checkedColor: theme.primary,
          },
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView style={styles.content}>
        {activeTab === 'tasks' && renderTasksTab()}
        {activeTab === 'habits' && renderHabitsTab()}
        {activeTab === 'pomodoro' && (
          <Card style={[styles.pomodoroCard, { backgroundColor: theme.card }]}>
            <Card.Content style={styles.pomodoroContent}>
              <Text style={[styles.pomodoroTime, { color: theme.text }]}>
                25:00
              </Text>
              <Text style={[styles.pomodoroLabel, { color: theme.text }]}>
                Session de travail
              </Text>
              <View style={styles.pomodoroControls}>
                <TouchableOpacity style={[styles.pomodoroButton, { backgroundColor: theme.success }]}>
                  <Icon name="play" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pomodoroButton, { backgroundColor: theme.error }]}>
                  <Icon name="stop" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pomodoroButton, { backgroundColor: theme.warning }]}>
                  <Icon name="refresh" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.pomodoroSession, { color: theme.text }]}>
                Session 3/4
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.primary }]}
        icon="plus"
        color="white"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedButtons: {
    margin: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
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
  categoriesScroll: {
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
  },
  categoryButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  addTaskCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  addTaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksList: {
    paddingBottom: 100,
  },
  taskCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    marginLeft: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
  },
  categoryChip: {
    height: 24,
  },
  taskMenu: {
    padding: 5,
  },
  habitsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  habitStatCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    elevation: 2,
  },
  habitStatTitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  habitStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
 
  // chartContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  habitCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitContent: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  streakText: {
    fontSize: 12,
    marginLeft: 4,
  },
  frequencyChip: {
    height: 24,
  },
  habitActions: {
    flexDirection: 'row',
  },
  habitAction: {
    padding: 5,
    marginLeft: 5,
  },
  pomodoroCard: {
    marginTop: 20,
    borderRadius: 20,
    elevation: 3,
  },
  pomodoroContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  pomodoroTime: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pomodoroLabel: {
    fontSize: 18,
    marginBottom: 30,
  },
  pomodoroControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pomodoroButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pomodoroSession: {
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

  //ajoute ces styles 
  habitsChartCard: {
  marginBottom: 15,
  borderRadius: 12,
  elevation: 2,
},
chartContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 10,
},
pieChartContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},
pieChartWrapper: {
  position: 'relative',
  width: 150,
  height: 150,
  alignItems: 'center',
  justifyContent: 'center',
},
pieChart: {
  width: 150,
  height: 150,
  borderRadius: 75,
  borderWidth: 1,
  overflow: 'hidden',
  position: 'relative',
},
pieSegment: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 75,
  left: 0,
  top: 0,
  transformOrigin: 'center center',
},
pieInnerCircle: {
  position: 'absolute',
  width: 80,
  height: 80,
  borderRadius: 40,
  top: '50%',
  left: '50%',
  marginLeft: -40,
  marginTop: -40,
  zIndex: 2,
},
pieCenterText: {
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
},
piePercentage: {
  fontSize: 24,
  fontWeight: 'bold',
},
pieLabel: {
  fontSize: 12,
  marginTop: 2,
},
chartLegend: {
  flex: 1,
  marginLeft: 20,
},
legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 15,
},
legendColor: {
  width: 16,
  height: 16,
  borderRadius: 8,
  marginRight: 12,
},
legendTextContainer: {
  flex: 1,
},
legendTitle: {
  fontSize: 14,
  fontWeight: '600',
  marginBottom: 2,
},
legendValue: {
  fontSize: 12,
  opacity: 0.8,
},

//encore 
barChartContainer: {
  padding: 10,
},
chartTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 15,
  textAlign: 'center',
},
barChart: {
  marginBottom: 15,
},
barItem: {
  marginBottom: 12,
},
barLabelContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 5,
},
barLabel: {
  fontSize: 12,
  flex: 1,
},
barStreak: {
  fontSize: 11,
  marginLeft: 10,
},
barBackground: {
  height: 8,
  borderRadius: 4,
  overflow: 'hidden',
},
barFill: {
  height: '100%',
  borderRadius: 4,
},
chartStats: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginTop: 10,
},
// statItem: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },
statText: {
  fontSize: 12,
  marginLeft: 5,
},
});