import React, { useState, useEffect } from 'react' 
import { View, StyleSheet } from 'react-native' 
import { TextInput } from 'react-native-paper' 
import { MaterialIcons } from '@expo/vector-icons' 

const SearchBar = ({ onSearch, delayInterval = 500, style }) => {
  const [searchValue, setSearchValue] = useState('') 
  let timer 

  useEffect(() => {
    timer = null 
  }, []) 

  const onSearchChange = (term) => {
    clearTimeout(timer) 
    setSearchValue(term) 
    timer = setTimeout(async () => {
      onSearch(term) 
    }, delayInterval) 
  } 

  return (
    <View style={styles.content}>
      <MaterialIcons name='search' size={20} color='gray' />
      <TextInput
        underlineColor='#FFF'
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder='Search'
        style={{ ...styles.input, ...style }}
      />
    </View>
  ) 
} 

const styles = StyleSheet.create({
  input: {
    padding: 10,
    flexGrow: 1,
    height: 20,
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
}) 

export default SearchBar 
