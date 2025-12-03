/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { databaseClient } from './src/infrastructure/database/DatabaseClient';
import { migrationManager } from './src/infrastructure/database/MigrationManager';

import { WorkoutSessionRepository } from './src/data/repositories/WorkoutSessionRepository';
import { StartWorkoutUseCase } from './src/domain/usecases/workout/StartWorkoutUseCase';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [dbStatus, setDbStatus] = useState('Initializing...');

  useEffect(() => {
    const initDB = async () => {
      try {
        await databaseClient.init();
        await migrationManager.runMigrations();

        // Verification: Check if new table exists
        const result = await databaseClient.execute(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='VariationRotationTracker'"
        );
        const tableExists = result.rows?._array.length > 0;

        // Business Logic Verification
        const sessionRepo = new WorkoutSessionRepository();
        const startWorkout = new StartWorkoutUseCase(sessionRepo);
        const sessionResult = await startWorkout.execute('dummy_day_id');

        setDbStatus(
          `Database initialized & Migrations applied ✅\n` +
          `VariationRotationTracker Table: ${tableExists ? 'Found ✅' : 'Missing ❌'}\n` +
          `StartWorkout UseCase: ${sessionResult.success ? 'Success ✅' : 'Failed ❌'}`
        );
      } catch (error) {
        setDbStatus(`Error: ${error}`);
        console.error(error);
      }
    };

    initDB();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={styles.title}>LimitLift</Text>
        <Text style={styles.status}>{dbStatus}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;
