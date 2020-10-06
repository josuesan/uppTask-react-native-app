import React from 'react';
import { Text, ListItem, Left, Right, Icon } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import { gql, useMutation } from '@apollo/client';

const UPDATE_TASK = gql`
  mutation updateTask($id:ID,$input:TaskInput,$status:Boolean){
    updateTask(id:$id,input:$input,status:$status){
      name
      id
      project
      status
    }
  }
`;
const DELETE_TASK = gql`
  mutation deleteTask($id:ID){
    deleteTask(id:$id)
  }
`;

const GET_TASKS = gql`
query getTasks($input:ProjectIdInput){
  getTasks(input:$input){
    name
    id
    status
  }
}
`;

const Task = ({ task, projectId }) => {
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
      const { getTasks } = cache.readQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: projectId,
          },
        },
      });
      cache.writeQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: projectId,
          },
        },
        data: {
          getTasks: getTasks.filter(elem => elem.id !== task.id),
        },
      });
    },
  });

  const deleteTaskDB = async () => {
    try {
      await deleteTask({
        variables: {
          id: task.id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async () => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          input: {
            name: task.name,
          },
          status: !task.status,
        },
      });

    } catch (error) {
      console.log(error);
    }
  };

  const showDeleteDialog = () => {
    Alert.alert(
      'Delete task',
      'Are you sure to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => deleteTaskDB() },
      ]
    );
  };

  return (
    <>
      <ListItem
        onPress={changeStatus}
        onLongPress={showDeleteDialog}
      >
        <Left>
          <Text>{task.name}</Text>
        </Left>
        <Right>
          {
            task.status
              ? (
                <Icon
                  style={[styles.icon, styles.completed]}
                  name="ios-checkmark-circle"
                />
              )
              : (
                <Icon
                  style={[styles.icon, styles.progress]}
                  name="ios-checkmark-circle"
                />
              )
          }
        </Right>
      </ListItem>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 32,
  },
  completed: {
    color: 'green',
  },
  progress: {
    color: '#e1e1e1',
  },
});

export default Task;
