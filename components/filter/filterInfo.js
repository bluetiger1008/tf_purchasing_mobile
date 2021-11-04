import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import { ShowControl } from 'components'

//list shape {selectedItems, arrayData, label, property}[]
const FilterInfo = ({ list, searchTerm }) => {
  let filteredObject = list.map((item, i) => {
    let text = item.selectedItems
      .map((e) => {
        return e ? _find(item.arrayData, { id: e })[item.property] : ''
      })
      .join()

    return { text, label: item.label }
  })

  const isTextFill = filteredObject.map((e) => e.text).join('')

  if (!searchTerm && !isTextFill) {
    return null
  }
  return (
    <View style={styles.filters}>
      <Text style={{ fontWeight: 'bold' }}>Filters: </Text>

      <ShowControl visible={searchTerm}>
        <Text>Search Term = {searchTerm}</Text>
      </ShowControl>
      {filteredObject.map((item, index) => {
        if (!item.text) return null
        return (
          <Text key={index}>
            {' '}
            {item.label} = {item.text};
          </Text>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    paddingBottom: 5,
  },
})

export default FilterInfo
