import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Divider, Card, List, Checkbox } from 'react-native-paper'

const InventoryTable = ({ data }) => {
  const [checked, setChecked] = React.useState(false)
  console.log('data', data)
  return (
    <View>
      {data.map((line, i) => (
        <Card key={i}>
          <Card.Content>
            <View style={styles.row}>
              <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked)
                }}
              />
              <View style={styles.valuesWrapper}>
                <Text style={styles.value}>
                  Mfg: {line.manufacturer && line.manufacturer.abbreviation}
                </Text>
                <Text style={styles.value}>
                  Quantity Available: {line.quantity_available}
                </Text>
                <Text style={styles.value}>
                  Part Number: {line.part_number}
                </Text>
                <Text style={styles.value}>Serivce: {line.source}</Text>
                <Text style={styles.value}>Lead Time: {line.lead_time}</Text>
                <Text style={styles.value}>
                  Data Retrieved:{' '}
                  {line.fetched ? line.fetched.human_date.relative.long : ''}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  valuesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  value: {
    width: '50%',
  },
})

export default InventoryTable
