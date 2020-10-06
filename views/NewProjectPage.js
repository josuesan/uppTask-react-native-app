import React, { useCallback, useState, useEffect } from 'react';
import { Text, Container, H1, Form, Item, Input, Button, Toast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { gql, useMutation } from '@apollo/client';

const CREATE_PROJECT = gql`
mutation createProject($input:ProjectInput){
  createProject(input:$input){
    name,
    id
  }
}
`;
const GET_PROJECTS = gql`
  query getProjects{
    getProjects{
      id,
      name
    }
  }
`;
const NewProjectPage = () => {
  const navigation = useNavigation();
  const [createProject] = useMutation(CREATE_PROJECT, {
    update(cache, { data: { createProject } }) {
      const { getProjects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { getProjects: getProjects.concat([createProject]) },
      });
    },
  });
  const [projectName, setProjectName] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    msg: '',
  });

  const handleSubmit = async () => {
    if (projectName === '') {
      return setToast({
        visible: true,
        msg: 'The name of project is required',
      });
    }

    try {
      const { data } = await createProject({
        variables: {
          input: {
            projectName,
          },
        },
      });
      setToast({
        visible: true,
        msg: `Project ${data.createProject.name} created sucessfully`,
      });
      navigation.navigate('projects');
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

  return (
    <Container style={[globalStyles.container, { backgroundColor: '#e84347' }]}>
      <View style={globalStyles.content}>
        <H1 style={globalStyles.title}>New project</H1>
        <Form>
          <Item inlineLabel last style={globalStyles.item}>
            <Input
              style={globalStyles.input}
              placeholder="Project name"
              onChangeText={(text) => setProjectName(text)}
              value={projectName}
            />
          </Item>
        </Form>
        <Button
          style={[globalStyles.btn, { marginTop: 30 }]}
          square
          block
          onPress={handleSubmit}
        >
          <Text
            style={globalStyles.btnText}
          >
            Create project
          </Text>
        </Button>
      </View>
    </Container>
  );
};

export default NewProjectPage;
