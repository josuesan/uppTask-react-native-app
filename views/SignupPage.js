import { useNavigation } from '@react-navigation/native';
import { Button, Container, Form, H1, Input, Item, Text, Toast } from 'native-base';
import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation createUser($input:UserInput){
    createUser(input:$input)
  }
`;

const SignupPage = () => {
  const [createUser] = useMutation(CREATE_USER);
  const navigation = useNavigation();
  const [toast, setToast] = useState({
    visible: false,
    msg: '',
  });
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formValues;

  const handleInputChange = (inputName, text) => {
    setFormValues({
      ...formValues,
      [inputName]: text,
    });
  };

  const handleSubmit = async () => {
    if (name === '' || email === '' || password === '') {
      return setToast({
        visible: true,
        msg: 'All fields are required',
      });
    }
    if (password.length < 6) {
      return setToast({
        visible: true,
        msg: 'Password have to be 6 characters min',
      });
    }

    try {
      const { data } = await createUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });
      setToast({
        visible: true,
        msg: data.createUser,
      });
      navigation.navigate('login');
    } catch (error) {
      setToast({
        visible: true,
        msg: error.message.replace('Graphql error:', ''),
      });
      console.log(error);
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
              name="name"
              placeholder="Name"
              style={globalStyles.input}
              onChangeText={(text) => handleInputChange('name', text)}
              value={name}
            />
          </Item>
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
              onChangeText={(text) => handleInputChange('email', text)}
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
          <Text style={globalStyles.btnText}>Sign up</Text>
        </Button>
      </View>
    </Container>
  );
};

export default SignupPage;
