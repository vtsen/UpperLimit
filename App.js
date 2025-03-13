import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, AppState } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(minutes * 60 + seconds);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null); // Store the timestamp when timer starts

  useEffect(() => {
    let timer;

    if (hasStarted) {
      if (!startTime) {
        setStartTime(Date.now()); // Save the current time at the beginning
      }

      timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const newTime = Math.max(time - elapsedTime, 0);
        setTime(newTime);

        if (newTime === 0) {
          clearInterval(timer);
          setHasStarted(false);
          alert("Time's up! Take a break.");
        }
      }, 1000);
    } else {
      clearInterval(timer);
      setStartTime(null);
    }

    return () => clearInterval(timer);
  }, [hasStarted, startTime]);

  // Handle App State Changes (Resuming the App)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && hasStarted) {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setTime(Math.max(1500 - elapsedTime, 0));
      }
    });

    return () => subscription.remove();
  }, [hasStarted, startTime]);  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTime(minutes * 60 + seconds);
    setHasStarted(true);
  };

  return (
    <View style={styles.container}>
      {!hasStarted ? (
        <>
          <Text style={styles.label}>Set Timer:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={minutes}
              style={styles.picker}
              onValueChange={(itemValue) => setMinutes(itemValue)}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <Picker.Item key={i} label={`${i} min`} value={i} />
              ))}
            </Picker>
            <Picker
              selectedValue={seconds}
              style={styles.picker}
              onValueChange={(itemValue) => setSeconds(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i*5} label={`${i*5} sec`} value={i*5} />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <>
        <Text style={styles.hint}>
          Once started, no pause. Get your things done within the upper limit.
          </Text>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        </>
      )}

      // Start/pause/resume button
      <Button title={
          hasStarted ? "Abandon" : "Start"
        } 
        onPress={
          hasStarted 
          ? () => {setHasStarted(false);}
          : startTimer
        } />
      <Button title="Reset" onPress={() => {
        setHasStarted(false);
        setTime(minutes * 60 + seconds); 
        }
        } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  hint: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 200,
    width: 150,
    color: '#000',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

