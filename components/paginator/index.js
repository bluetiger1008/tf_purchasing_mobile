import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
} from 'react-native'
import { IconButton } from 'react-native-paper'

const Paginator = ({ onChangePage, tableViewInfo }) => {
  const [value, setValue] = useState('1')
  const lastPageIndex = Math.ceil(
    tableViewInfo.totalRows / tableViewInfo.rowsCount
  )

  const onNextPageNumber = () => {
    if (parseInt(value, 10) + 1 <= lastPageIndex)
      setValue(`${parseInt(value, 10) + 1}`)
    onChangePage(parseInt(value, 10) + 1)
  }

  const onPrevPageNumber = () => {
    if (parseInt(value, 10) - 1 > 0) {
      setValue(`${parseInt(value, 10) - 1}`)
      onChangePage(parseInt(value, 10) - 1)
    }
  }

  const onEndPageNumber = () => {
    setValue(`${lastPageIndex}`)
    onChangePage(lastPageIndex)
  }

  const onFirstPageNumber = () => {
    setValue('1')
    onChangePage(1)
  }

  return (
    <View style={styles.container}>
      <View>
        <Text>
          Page {value} of {lastPageIndex}
        </Text>
        <Text>Rows per page: {tableViewInfo.rowsCount}</Text>
      </View>

      <View style={styles.navigator}>
        <IconButton
          icon='chevron-double-left'
          style={styles.button}
          onPress={() => onFirstPageNumber()}
          disabled={parseInt(value, 10) === 1}
        />
        <IconButton
          style={styles.button}
          icon='chevron-left'
          onPress={() => onPrevPageNumber()}
          disabled={parseInt(value, 10) - 1 === 0}
        />
        <TextInput style={styles.input} onChangeText={setValue} value={value} />
        <IconButton
          icon='chevron-right'
          onPress={() => onNextPageNumber()}
          style={styles.button}
          disabled={parseInt(value, 10) + 1 > lastPageIndex}
        />
        <IconButton
          icon='chevron-double-right'
          onPress={() => onEndPageNumber()}
          style={styles.button}
          disabled={parseInt(value, 10) === lastPageIndex}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    zIndex: 99,
  },
  navigator: {
    flexDirection: 'row',
  },
  button: {
    margin: 0,
  },
  input: {
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
})

export default Paginator
