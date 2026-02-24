import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Dumbbell, Calendar, TrendingUp, Settings, CheckCircle2, Circle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock Data from your 5/3/1 v7 logic
const Lifts = {
  SQUAT: { tm: 315, step: 10 },
  BENCH: { tm: 225, step: 5 },
  DEADLIFT: { tm: 405, step: 10 },
  PRESS: { tm: 135, step: 5 },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('train');
  const [selectedLift, setSelectedLift] = useState('SQUAT');
  const [completedSets, setCompletedSets] = useState([]);

  const toggleSet = (index) => {
    if (completedSets.includes(index)) {
      setCompletedSets(completedSets.filter(i => i !== index));
    } else {
      setCompletedSets([...completedSets, index]);
    }
  };

  const renderTrain = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Iron 5/3/1 <Text style={styles.version}>v7.0</Text></Text>
      
      {/* Barbell Visual */}
      <View style={styles.card}>
        <View style={styles.barContainer}>
          <View style={styles.bar}>
             {/* Left side plates */}
             <View style={styles.plateSide}>
               <View style={[styles.plate, styles.p45]} />
               <View style={[styles.plate, styles.p45]} />
               <View style={[styles.plate, styles.p25]} />
             </View>
             {/* Right side plates */}
             <View style={[styles.plateSide, { flexDirection: 'row' }]}>
               <View style={[styles.plate, styles.p45]} />
               <View style={[styles.plate, styles.p45]} />
               <View style={[styles.plate, styles.p25]} />
             </View>
          </View>
        </View>
        <Text style={styles.loadText}>LOAD: <Text style={styles.loadWeight}>315</Text> lbs</Text>
      </View>

      {/* Lift Selector */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Lift</Text>
          <TouchableOpacity onPress={() => {}} style={styles.selector}>
            <Text style={styles.selectorText}>{selectedLift}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sets */}
      <View style={styles.card}>
        {[1, 2, 3, 4, 5].map((set, i) => (
          <TouchableOpacity 
            key={i} 
            style={[styles.setRow, completedSets.includes(i) && styles.setDone]} 
            onPress={() => toggleSet(i)}
          >
            <View>
              <Text style={styles.setText}>Set {set}: 225 lbs x 5</Text>
              <Text style={styles.plateGuide}>45, 45</Text>
            </View>
            {completedSets.includes(i) ? 
              <CheckCircle2 color="#32d74b" size={28} /> : 
              <Circle color="#8e8e93" size={28} />
            }
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {activeTab === 'train' && renderTrain()}
      {activeTab !== 'train' && (
        <View style={styles.placeholder}>
          <Text style={styles.text}>Coming Soon: {activeTab}</Text>
        </View>
      )}

      {/* Navigation */}
      <View style={styles.nav}>
        {[
          { id: 'train', icon: Dumbbell, label: 'TRAIN' },
          { id: 'history', icon: Calendar, label: 'HISTORY' },
          { id: 'stats', icon: TrendingUp, label: 'STATS' },
          { id: 'settings', icon: Settings, label: 'SETTINGS' },
        ].map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.navItem} 
            onPress={() => setActiveTab(item.id)}
          >
            <item.icon color={activeTab === item.id ? '#0a84ff' : '#8e8e93'} size={24} />
            <Text style={[styles.navLabel, activeTab === item.id && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    color: '#0a84ff',
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  barContainer: {
    height: 100,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#38383a',
  },
  bar: {
    height: 6,
    width: '90%',
    backgroundColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  plateSide: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    height: 80,
  },
  plate: {
    height: 50,
    width: 10,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  p45: { backgroundColor: '#0a84ff', height: 70, width: 14 },
  p25: { backgroundColor: '#32d74b', height: 60, width: 12 },
  loadText: {
    textAlign: 'center',
    padding: 10,
    color: '#8e8e93',
    fontWeight: '700',
  },
  loadWeight: {
    color: '#fff',
    fontSize: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  label: {
    color: '#fff',
    fontSize: 18,
  },
  selectorText: {
    color: '#0a84ff',
    fontSize: 18,
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#38383a',
  },
  setDone: {
    backgroundColor: 'rgba(50, 215, 75, 0.1)',
  },
  setText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  plateGuide: {
    color: '#8e8e93',
    fontSize: 13,
    marginTop: 4,
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.98)',
    borderTopWidth: 1,
    borderTopColor: '#38383a',
    paddingTop: 12,
    paddingBottom: 34, // Safe area for iPhone home bar
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#0a84ff',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  }
});
