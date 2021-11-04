import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    width: '100%',
    marginBottom: 20,
  },
  forgot: {
    color: '#fb5b5a',
    fontSize: 16,
  },
  submitBtn: {
    width: 150,
    marginBottom: 20,
  },
  submitBtnLabel: {
    fontSize: 20,
  },
})

export default styles
