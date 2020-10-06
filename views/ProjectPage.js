import React, { useState, useEffect, useCallback } from 'react';
import { Text, Container, Item, Input, Form, Button, Toast, H2, Content, List } from 'native-base';
import globalStyles from '../styles/globalStyles';
import { gql, useMutation, useQuery } from '@apollo/client';
import { StyleSheet } from 'react-native';
import Task from '../components/Task';

const CREATE_TASK = gql`
  mutation createTask($input:TaskInput){
    createTask(input:$input){
      name
      id
      project
      status
    }
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

const ProjectPage = ({ route }) => {
  const [taskName, setTaskName] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    msg: '',
  });

  const [createTask] = useMutation(CREATE_TASK, {
    update(cache, { data }) {
      const { getTasks } = cache.readQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: route.params.id,
          },
        },
      });
      cache.writeQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: route.params.id,
          },
        },
        data: {
          getTasks: [...getTasks, data.createTask],
        },
      });
    },
  });
  const { data, loading } = useQuery(GET_TASKS, {
    variables: {
      input: {
        project: route.params.id,
      },
    },
  });


  const handleSubmit = async () => {
    if (taskName === '') {
      setToast({
        visible: true,
        msg: 'The task name is required',
      });
    }
    try {
      // eslint-disable-next-line no-shadow
      const { data } = await createTask({
        variables: {
          input: {
            name: taskName,
            project: route.params.id,
          },
        },
      });
      setTaskName('');
      setToast({
        visible: true,
        msg: `Task ${data.createTask.name} created sucessfully`,
      });
    } catch (error) {
      setToast({
        visible: true,
        msg: error.message.replace('Graphql error:', ''),
      });
    }
  };

  const showAlert = useCallback(() => {
    Toast.show({
      text: toast.msg,
      buttonText: 'OK',
      duration: 500,
      onClose: () => setToast({ visible: false, msg: '' }),
    });
  }, [toast.msg]);

  useEffect(() => {
    if (toast.visible) {
      showAlert();
    }
  }, [toast, showAlert]);

  if (loading) {
    return (<Text>Loading...</Text>);
  }
  return (
    <Container style={[globalStyles.container, { backgroundColor: '#e84347' }]}>
      <Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
        <Item inlineLabel last style={globalStyles.item}>
          <Input
            placeholder="Task name"
            style={globalStyles.input}
            onChangeText={(text) => setTaskName(text)}
            value={taskName}
          />
        </Item>
        <Button
          square
          block
          style={globalStyles.btn}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.btnText}>Create task</Text>
        </Button>
      </Form>
      <H2 style={globalStyles.subtitle}>Tasks: {route.params.name}</H2>
      <Content>
        <List style={styles.content}>
          {data.getTasks.map(task => (
            <Task
              key={task.id}
              task={task}
              projectId={route.params.id}
            />
          ))}
        </List>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    marginHorizontal: '2.5%',
  },
});
export default ProjectPage;
