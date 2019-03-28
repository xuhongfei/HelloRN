/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import uuid4 from "uuid/v4";

import EditableTimer from "./components/EditableTimer";
import ToggleableTimerForm from "./components/ToggleableTimerForm";
import { newTimer } from "./utils/TimerUtils"

export default class App extends Component {

  state = {
    timers: [
      {
        title: "Mow the lawn",
        project: "House Chores",
        id: uuid4(),
        elapsed: 5456099,
        isRunning: true,
      },
      {
        title: "Bake squash",
        project: "Kitchen Chores",
        id: uuid4(),
        elapsed: 1273998,
        isRunning: false,
      },
    ],
  };

  componentDidMount() {
    const TIME_INTERVAL = 1000;
    this.intervalId = setInterval(() => {
      const { timers } = this.state;
      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;
          return {
            ...timer,
            elapsed: isRunning ? (elapsed + TIME_INTERVAL) : elapsed,
          };
        })
      });
    }, TIME_INTERVAL);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  };

  handleCreateFormSubmit = timer => {
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers],
    });
  }

  handleFormSubmit = (attrs) => {
    const { timers } = this.state;
    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, project } = attrs;

          return {
            ...timer,
            title,
            project,
          };
        }

        return timer;
      }),
    });
  };

  handleRemovePress = (itemId) => {
    const { timers } = this.state;
    this.setState({
      timers: timers.filter(t => t.id !== itemId),
    });
  };

  toggleTimer = timerId => {
    this.setState(prevState => {
      const { timers } = prevState;

      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;
          if (id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning,
            };
          }
          return timer;
        }),
      };
    });
  }

  render() { 
    const { timers } = this.state;

    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.appContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Timers</Text>
          </View>
          <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer}>
          <ScrollView style={styles.timerList}>
            <ToggleableTimerForm 
              onFormSubmit={this.handleCreateFormSubmit}
            />
            {timers.map(({title, project, id, elapsed, isRunning}) => (
              <EditableTimer
                key={id}
                id={id}
                title={title}
                project={project}
                elapsed={elapsed}
                isRunning={isRunning}
                onFormSubmit={this.handleFormSubmit}
                onRemovePress={this.handleRemovePress}
                onStartPress={this.toggleTimer}
                onStopPress={this.toggleTimer}
              />
            ))}
          </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
  },
  timerListContainer:{
    flex: 1,
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerList: {
    paddingBottom: 15,
  }
});

