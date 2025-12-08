import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Card, Button, FAB, Portal, Provider } from 'react-native-paper';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

export default function CalendarScreen() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    color: theme.primary,
    category: 'personal',
  });

  // Données de démonstration
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: theme.primary,
      selectedTextColor: 'white',
    },
    '2024-12-15': {
      marked: true,
      dotColor: theme.primary,
    },
    '2024-12-20': {
      marked: true,
      dotColor: theme.success,
    },
    '2024-12-25': {
      marked: true,
      dotColor: theme.warning,
    },
  };

  const events = [
    {
      id: 1,
      title: 'Réunion équipe',
      time: '10:00 - 11:30',
      color: theme.primary,
      category: 'work',
    },
    {
      id: 2,
      title: 'Déjeuner client',
      time: '13:00 - 14:30',
      color: theme.success,
      category: 'social',
    },
    {
      id: 3,
      title: 'Gym',
      time: '18:00 - 19:30',
      color: theme.secondary,
      category: 'health',
    },
    {
      id: 4,
      title: 'Cours de piano',
      time: '20:00 - 21:00',
      color: theme.warning,
      category: 'education',
    },
  ];

  const categories = [
    { id: 'work', name: 'Travail', color: theme.primary, icon: 'briefcase' },
    { id: 'personal', name: 'Perso', color: theme.success, icon: 'account' },
    { id: 'health', name: 'Santé', color: theme.secondary, icon: 'heart' },
    { id: 'education', name: 'Éducation', color: theme.warning, icon: 'school' },
    { id: 'social', name: 'Social', color: theme.error, icon: 'account-group' },
  ];

  const renderEventModal = () => (
    <Modal
      visible={showEventModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEventModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Nouvel événement
            </Text>
            <TouchableOpacity onPress={() => setShowEventModal(false)}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <TextInput
              style={[styles.input, { 
                color: theme.text, 
                borderColor: theme.border,
                backgroundColor: theme.background 
              }]}
              placeholder="Titre de l'événement"
              placeholderTextColor={theme.text + '80'}
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea, { 
                color: theme.text, 
                borderColor: theme.border,
                backgroundColor: theme.background 
              }]}
              placeholder="Description"
              placeholderTextColor={theme.text + '80'}
              multiline
              numberOfLines={3}
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
            />

            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: theme.background }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={20} color={theme.primary} />
              <Text style={[styles.dateButtonText, { color: theme.text }]}>
                {newEvent.startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Catégorie
            </Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { 
                      backgroundColor: newEvent.category === category.id 
                        ? category.color + '20' 
                        : theme.background,
                      borderColor: category.color,
                    }
                  ]}
                  onPress={() => setNewEvent({ ...newEvent, category: category.id })}
                >
                  <Icon name={category.icon as any} size={20} color={category.color} />
                  <Text style={[styles.categoryText, { color: theme.text }]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Couleur
            </Text>
            <View style={styles.colorsContainer}>
              {['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { 
                      backgroundColor: color,
                      borderWidth: newEvent.color === color ? 3 : 0,
                      borderColor: 'white',
                    }
                  ]}
                  onPress={() => setNewEvent({ ...newEvent, color })}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              onPress={() => setShowEventModal(false)}
              style={styles.cancelButton}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                // Sauvegarder l'événement
                setShowEventModal(false);
                setNewEvent({
                  title: '',
                  description: '',
                  startDate: new Date(),
                  endDate: new Date(),
                  color: theme.primary,
                  category: 'personal',
                });
              }}
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
            >
              Enregistrer
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <Provider>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Calendrier */}
        <Card style={[styles.calendarCard, { backgroundColor: theme.card }]}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: theme.card,
              calendarBackground: theme.card,
              textSectionTitleColor: theme.text,
              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: 'white',
              todayTextColor: theme.primary,
              dayTextColor: theme.text,
              textDisabledColor: theme.text + '50',
              monthTextColor: theme.text,
              arrowColor: theme.primary,
            }}
          />
        </Card>

        {/* Filtres de catégories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryFilter,
                { backgroundColor: theme.card }
              ]}
            >
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={[styles.categoryFilterText, { color: theme.text }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste des événements du jour */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Événements du {selectedDate}
        </Text>
        
        <ScrollView style={styles.eventsList}>
          {events.map(event => (
            <Card 
              key={event.id} 
              style={[styles.eventCard, { backgroundColor: theme.card }]}
            >
              <Card.Content>
                <View style={styles.eventHeader}>
                  <View style={styles.eventLeft}>
                    <View style={[styles.eventColor, { backgroundColor: event.color }]} />
                    <View>
                      <Text style={[styles.eventTitle, { color: theme.text }]}>
                        {event.title}
                      </Text>
                      <Text style={[styles.eventTime, { color: theme.text + '80' }]}>
                        {event.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity style={styles.eventAction}>
                      <Icon name="bell-outline" size={20} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eventAction}>
                      <Icon name="dots-vertical" size={20} color={theme.text} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.eventTags}>
                  <View style={[styles.eventTag, { backgroundColor: event.color + '20' }]}>
                    <Icon 
                      name={categories.find(c => c.id === event.category)?.icon || 'circle' as any} 
                      size={14} 
                      color={event.color} 
                    />
                    <Text style={[styles.eventTagText, { color: event.color }]}>
                      {categories.find(c => c.id === event.category)?.name}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Bouton d'ajout */}
        <FAB
          style={[styles.fab, { backgroundColor: theme.primary }]}
          icon="plus"
          color="white"
          onPress={() => setShowEventModal(true)}
        />

        {renderEventModal()}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarCard: {
    margin: 15,
    borderRadius: 15,
    elevation: 2,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  eventCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventTime: {
    fontSize: 14,
    marginTop: 2,
  },
  eventActions: {
    flexDirection: 'row',
  },
  eventAction: {
    padding: 5,
    marginLeft: 10,
  },
  eventTags: {
    flexDirection: 'row',
  },
  eventTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTagText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
  },
  colorsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
});