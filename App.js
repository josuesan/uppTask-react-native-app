import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';
import { Root } from 'native-base';
import ProjectsPage from './views/ProjectsPage';
import NewProjectPage from './views/NewProjectPage';
import ProjectPage from './views/ProjectPage';

const Stack = createStackNavigator();
const App = () => {
  return (
    <Root>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            name="login"
            component={LoginPage}
            options={{
              title: 'Login',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="signup"
            component={SignupPage}
            options={{
              title: 'Sign up',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="projects"
            component={ProjectsPage}
            options={{
              title: 'Projects',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="newProject"
            component={NewProjectPage}
            options={{
              title: 'New Project',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="project"
            component={ProjectPage}
            options={({ route }) => ({
              title: route.params.name,
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
};

export default App;
