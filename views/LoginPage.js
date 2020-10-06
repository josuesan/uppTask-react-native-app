import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Text, Container, H1, Form, Item, Input, Button, Toast } from 'native-base';
import globalStyles from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';

const AUTHENTICATE_USER = gql`
  mutation authenticateUser($input: AuthenticateInput){
    authenticateUser(input: $input){
      token
    }
  }
`;

const LoginPage = () => {
  const navigation = useNavigation();
  const [authenticateUser] = useMutation(AUTHENTICATE_USER);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formValues;

  const [toast, setToast] = useState({
    visible: false,
    msg: '',
  });

  const handleInputChange = (inputName, text) => {
    setFormValues({
      ...formValues,
      [inputName]: text,
    });
  };

  const showAlert = useCallback(() => {
    Toast.show({
      text: toast.msg,
      buttonText: 'OK',
      duration: 500,
      onClose: () => setToast({ visible: false, msg: '' }),
    });
  }, [toast.msg]);

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      return setToast({
        visible: true,
        msg: 'All fields are required',
      });
    }
    try {
      const { data } = await authenticateUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      const { token } = data.authenticateUser;
      await AsyncStorage.setItem('token', token);
      navigation.navigate('projects');
    } catch (error) {
      setToast({
        visible: true,
        msg: error.message.replace('Graphql error:', ''),
      });
    }
  };

  useEffect(() => {
    if (toast.visible) {
      showAlert();
    }
  }, [toast, showAlert]);

  return (
    <Container style={[{ backgroundColor: '#e84347' }, globalStyles.container]}>
      <View style={globalStyles.content}>
        <H1 style={globalStyles.title}>UpTask</H1>
        <Form>
          <Item
            inlineLabel
            last
            style={globalStyles.item}
          >
            <Input
              name="email"
              autoCompleteType="email"
              placeholder="Email"
              keyboardType="email-address"
              style={globalStyles.input}
              onChangeText={(text) => handleInputChange('email', text.toLowerCase())}
              value={email}
            />
          </Item>
          <Item
            inlineLabel
            last
            style={globalStyles.item}
          >
            <Input
              name="password"
              secureTextEntry={true}
              placeholder="Password"
              style={globalStyles.input}
              onChangeText={(text) => handleInputChange('password', text)}
              value={password}
            />
          </Item>
        </Form>
        <Button
          square
          block
          style={globalStyles.btn}
          onPress={handleSubmit}
        >
          <Text style={globalStyles.btnText}>Login</Text>
        </Button>
        <Text
          style={globalStyles.link}
          onPress={() => navigation.navigate('signup')}
        >
          Create account
        </Text>
      </View>
    </Container>
  );
};

export default LoginPage;
