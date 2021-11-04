import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, DataTable, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { TextPair } from 'components'

const ItemRow = ({ line }) => {
  const [expanded, setExpanded] = useState(false)
  const { part_number, total_quantity } = line

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleExpand}>
        <View style={styles.row}>
          <MaterialIcons
            name={expanded ? 'arrow-drop-down' : 'arrow-right'}
            size={25}
            style={{ marginRight: 10 }}
          />
          <TextPair
            style={{ width: '50%' }}
            text={'Item'}
            value={part_number ? part_number : '-- --'}
          />
          <TextPair
            style={{ width: '50%' }}
            text={'Quantity'}
            value={total_quantity || '-- --'}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <>
          <Divider style={{ marginTop: 10 }} />
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Requisition Number</DataTable.Title>
              <DataTable.Title>Quantity</DataTable.Title>
            </DataTable.Header>
            {line.lines.map((item, index) => {
              return (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{item.requisition}</DataTable.Cell>
                  <DataTable.Cell>{item.quantity}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
})

export default ItemRow
