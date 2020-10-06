import { gql, useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Button, Container, Content, H2, Left, List, ListItem, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import globalStyles from '../styles/globalStyles';

const GET_PROJECTS = gql`
  query getProjects{
    getProjects{
      id,
      name
    }
  }
`;

const ProjectsPage = () => {
  const navigation = useNavigation();
  const { data, loading } = useQuery(GET_PROJECTS);

  if (loading) {
    return (<Text>Loading...</Text>);
  }

  return (
    <Container style={[globalStyles.container, { backgroundColor: '#e84347' }]}>
      <Button
        style={[globalStyles.btn, { marginTop: 30 }]}
        square
        block
        onPress={() => navigation.navigate('newProject')}
      >
        <Text
          style={globalStyles.btnText}
        >
          New Project</Text>
      </Button>
      <H2 style={globalStyles.subtitle}>Select a project</H2>
      <Content>
        <List style={styles.content}>
          {data.getProjects.map(project => (
            <ListItem
              key={project.id}
              onPress={() => navigation.navigate('project', project)}
            >
              <Left>
                <Text>{project.name}</Text>
              </Left>
            </ListItem>
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
export default ProjectsPage;
