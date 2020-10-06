import { StyleSheet } from 'react-native';
const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 20,
    width: '100%',
  },
  item: {
    borderWidth: 0,
    borderColor: 'transparent',
    width: '100%',
    paddingLeft: 0,
  },
  btn: {
    backgroundColor: '#28303b',
  },
  btnText: {
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  link: {
    color: '#fff',
    marginTop: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default globalStyles;
