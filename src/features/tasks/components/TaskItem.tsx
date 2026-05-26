import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Image } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Task from '../../../core/database/models/Task';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isCompleted, setIsCompleted] = useState(task.completed);

  useEffect(() => {
    setIsCompleted(task.completed);
  }, [task.completed]);

  const toggleCompletion = async () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    try {
      await task.toggleCompletion();
    } catch (error) {
      setIsCompleted(task.completed); // rollback
      console.error('Error toggling completion:', error);
    }
  };

  const hasAttachment = !!task.attachmentUri;
  const hasDescription = !!task.description;

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        {hasAttachment && (
          <Image source={{ uri: task.attachmentUri }} style={styles.thumbnail} />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]} numberOfLines={2}>
            {task.title}
          </Text>
          {hasDescription && (
            <Text style={[styles.description, isCompleted && styles.completedText]} numberOfLines={2}>
              {task.description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={isCompleted}
        onValueChange={toggleCompletion}
        trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
        thumbColor={isCompleted ? '#10B981' : '#F3F4F6'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 18,
  },
  completedText: {
    color: '#9CA3AF',
  },
});

export default withObservables(['task'], ({ task }: { task: Task }) => ({
  task,
}))(TaskItem);
