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
import { Card, FAB, Searchbar, Chip, Button } from 'react-native-paper';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Idées pour le projet',
      content: 'Réflexions sur les nouvelles fonctionnalités à implémenter...',
      tags: ['projet', 'idées'],
      category: 'work',
      isPinned: true,
      date: 'Aujourd\'hui',
    },
    {
      id: '2',
      title: 'Liste de courses',
      content: 'Lait, Œufs, Pain, Fruits, Légumes',
      tags: ['perso', 'courses'],
      category: 'personal',
      isPinned: false,
      date: 'Hier',
    },
    {
      id: '3',
      title: 'Notes de réunion',
      content: 'Points discutés avec l\'équipe de développement...',
      tags: ['travail', 'réunion'],
      category: 'work',
      isPinned: true,
      date: '15 déc',
    },
    {
      id: '4',
      title: 'Objectifs 2024',
      content: '1. Apprendre React Native\n2. Voyager plus\n3. Lire 20 livres',
      tags: ['perso', 'objectifs'],
      category: 'personal',
      isPinned: false,
      date: '10 déc',
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'Application Agenda',
      description: 'Développement de l\'app',
      progress: 75,
      tasks: 12,
      completedTasks: 9,
      color: theme.primary,
    },
    {
      id: '2',
      title: 'Formation React',
      description: 'Cours et exercices',
      progress: 30,
      tasks: 20,
      completedTasks: 6,
      color: theme.success,
    },
    {
      id: '3',
      title: 'Réorganisation maison',
      description: 'Tri et rangement',
      progress: 50,
      tasks: 15,
      completedTasks: 7,
      color: theme.warning,
    },
  ]);

  const categories = [
    { id: 'all', name: 'Tout', icon: 'view-grid', color: theme.primary },
    { id: 'work', name: 'Travail', icon: 'briefcase', color: theme.primary },
    { id: 'personal', name: 'Perso', icon: 'account', color: theme.success },
    { id: 'study', name: 'Étude', icon: 'school', color: theme.warning },
    { id: 'ideas', name: 'Idées', icon: 'lightbulb', color: theme.secondary },
  ];

  const renderNoteCard = (note: any) => (
    <Card style={[styles.noteCard, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.noteHeader}>
          <View style={styles.noteTitleRow}>
            {note.isPinned && (
              <Icon name="pin" size={16} color={theme.warning} style={styles.pinIcon} />
            )}
            <Text style={[styles.noteTitle, { color: theme.text }]}>
              {note.title}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="dots-vertical" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <Text 
          style={[styles.noteContent, { color: theme.text }]}
          numberOfLines={3}
        >
          {note.content}
        </Text>
        
        <View style={styles.noteFooter}>
          <View style={styles.tagsContainer}>
            {note.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                style={[styles.tag, { backgroundColor: theme.background }]}
                textStyle={{ color: theme.text, fontSize: 12 }}
              >
                {tag}
              </Chip>
            ))}
          </View>
          <Text style={[styles.noteDate, { color: theme.text + '80' }]}>
            {note.date}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderProjectCard = (project: any) => (
    <Card style={[styles.projectCard, { backgroundColor: theme.card }]}>
      <Card.Content>
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: project.color + '20' }]}>
            <Icon name="folder" size={24} color={project.color} />
          </View>
          <View style={styles.projectInfo}>
            <Text style={[styles.projectTitle, { color: theme.text }]}>
              {project.title}
            </Text>
            <Text style={[styles.projectDescription, { color: theme.text + '80' }]}>
              {project.description}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="dots-vertical" size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressText, { color: theme.text }]}>
              Progression
            </Text>
            <Text style={[styles.progressPercent, { color: theme.text }]}>
              {project.progress}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${project.progress}%`,
                  backgroundColor: project.color
                }
              ]} 
            />
          </View>
          
          <View style={styles.projectStats}>
            <View style={styles.statItem}>
              <Icon name="checkbox-marked" size={16} color={theme.success} />
              <Text style={[styles.statText, { color: theme.text }]}>
                {project.completedTasks}/{project.tasks}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="calendar" size={16} color={theme.primary} />
              <Text style={[styles.statText, { color: theme.text }]}>
                15 jours
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="account-group" size={16} color={theme.secondary} />
              <Text style={[styles.statText, { color: theme.text }]}>
                3 membres
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Barre de recherche */}
      <Searchbar
        placeholder="Rechercher notes, projets..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.card }]}
        iconColor={theme.text}
        placeholderTextColor={theme.text + '80'}
        inputStyle={{ color: theme.text }}
      />

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'notes' && { backgroundColor: theme.primary },
          ]}
          onPress={() => setActiveTab('notes')}
        >
          <Icon 
            name="note-text" 
            size={20} 
            color={activeTab === 'notes' ? 'white' : theme.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'notes' ? 'white' : theme.text }
          ]}>
            Notes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'projects' && { backgroundColor: theme.primary },
          ]}
          onPress={() => setActiveTab('projects')}
        >
          <Icon 
            name="folder" 
            size={20} 
            color={activeTab === 'projects' ? 'white' : theme.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'projects' ? 'white' : theme.text }
          ]}>
            Projets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'quick' && { backgroundColor: theme.primary },
          ]}
          onPress={() => setActiveTab('quick')}
        >
          <Icon 
            name="lightning-bolt" 
            size={20} 
            color={activeTab === 'quick' ? 'white' : theme.text} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'quick' ? 'white' : theme.text }
          ]}>
            Rapide
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtres de catégorie */}
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
            <Text style={[styles.categoryText, { color: theme.text }]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenu */}
      <ScrollView style={styles.content}>
        {activeTab === 'notes' ? (
          <>
            {/* Notes épinglées */}
            {notes.filter(n => n.isPinned).length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Épinglées
                </Text>
                {notes.filter(n => n.isPinned).map(renderNoteCard)}
              </>
            )}

            {/* Toutes les notes */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Toutes les notes
            </Text>
            {notes.map(renderNoteCard)}
          </>
        ) : activeTab === 'projects' ? (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Mes projets
            </Text>
            {projects.map(renderProjectCard)}
            
            {/* Modèles de projet */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Modèles
            </Text>
            <View style={styles.templatesGrid}>
              <Card style={[styles.templateCard, { backgroundColor: theme.card }]}>
                <Card.Content style={styles.templateContent}>
                  <Icon name="book-open" size={40} color={theme.primary} />
                  <Text style={[styles.templateTitle, { color: theme.text }]}>
                    Étude
                  </Text>
                </Card.Content>
              </Card>
              <Card style={[styles.templateCard, { backgroundColor: theme.card }]}>
                <Card.Content style={styles.templateContent}>
                  <Icon name="briefcase" size={40} color={theme.success} />
                  <Text style={[styles.templateTitle, { color: theme.text }]}>
                    Travail
                  </Text>
                </Card.Content>
              </Card>
              <Card style={[styles.templateCard, { backgroundColor: theme.card }]}>
                <Card.Content style={styles.templateContent}>
                  <Icon name="home" size={40} color={theme.warning} />
                  <Text style={[styles.templateTitle, { color: theme.text }]}>
                    Maison
                  </Text>
                </Card.Content>
              </Card>
              <Card style={[styles.templateCard, { backgroundColor: theme.card }]}>
                <Card.Content style={styles.templateContent}>
                  <Icon name="plus" size={40} color={theme.text} />
                  <Text style={[styles.templateTitle, { color: theme.text }]}>
                    Nouveau
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </>
        ) : (
          /* Mode rapide */
          <View style={styles.quickMode}>
            <Card style={[styles.quickCard, { backgroundColor: theme.card }]}>
              <Card.Content style={styles.quickCardContent}>
                <Icon name="microphone" size={60} color={theme.primary} />
                <Text style={[styles.quickTitle, { color: theme.text }]}>
                  Note vocale
                </Text>
                <Text style={[styles.quickDescription, { color: theme.text }]}>
                  Enregistrez vos pensées
                </Text>
                <Button 
                  mode="contained" 
                  style={[styles.quickButton, { backgroundColor: theme.primary }]}
                >
                  Démarrer
                </Button>
              </Card.Content>
            </Card>
            
            <Card style={[styles.quickCard, { backgroundColor: theme.card }]}>
              <Card.Content style={styles.quickCardContent}>
                <Icon name="camera" size={60} color={theme.success} />
                <Text style={[styles.quickTitle, { color: theme.text }]}>
                  Photo note
                </Text>
                <Text style={[styles.quickDescription, { color: theme.text }]}>
                  Capturez des documents
                </Text>
                <Button 
                  mode="contained" 
                  style={[styles.quickButton, { backgroundColor: theme.success }]}
                >
                  Prendre photo
                </Button>
              </Card.Content>
            </Card>
          </View>
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
  searchBar: {
    margin: 15,
    borderRadius: 12,
    elevation: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingHorizontal: 15,
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
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  noteCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pinIcon: {
    marginRight: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
    height: 24,
  },
  noteDate: {
    fontSize: 12,
  },
  projectCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  projectIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  projectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  templateCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    elevation: 1,
  },
  templateContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  quickMode: {
    paddingBottom: 30,
  },
  quickCard: {
    marginBottom: 20,
    borderRadius: 20,
    elevation: 2,
  },
  quickCardContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  quickTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  quickDescription: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.8,
  },
  quickButton: {
    paddingHorizontal: 30,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});