import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(minutes * 60 + seconds);
  const [hasStarted, setHasStarted] = useState(false);
  const [onPause, setOnPause] = useState(false);

  useEffect(() => {
    let timer;    
    if (hasStarted && time > 0 && !onPause) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setHasStarted(false);
      alert("Time's up! Take a break.");    // TODO: change to notification
    }
    return () => clearInterval(timer);
  }, [hasStarted, onPause, time]);

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
              {[...Array(11).keys()].map((num) => (
                <Picker.Item key={num} label={`${num} min`} value={num} />
              ))}
            </Picker>
            <Picker
              selectedValue={seconds}
              style={styles.picker}
              onValueChange={(itemValue) => setSeconds(itemValue)}
            >
              {[...Array(60).keys()].map((num) => (
                <Picker.Item key={num} label={`${num} sec`} value={num} />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <Text style={styles.timer}>{formatTime(time)}</Text>
      )}

      // Start/pause/resume button
      <Button title={
          hasStarted ? (onPause ? "Resume" : "Pause") : "Start"
        } 
        onPress={
          hasStarted 
          ? () => {
            onPause ? setOnPause(false) : setOnPause(true);
          } 
          : startTimer
        } />
      <Button title="Reset" onPress={() => {
        setHasStarted(false); 
        setOnPause(false);
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

