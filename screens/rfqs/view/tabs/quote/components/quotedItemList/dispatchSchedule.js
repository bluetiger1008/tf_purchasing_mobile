import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { TextPair } from 'components'
import _find from 'lodash/find'
import leadTimeValues from 'utils/leadTimes'

const DispatchSchedule = ({ list = [] }) => {
  if (list.length <= 0) return null

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
        Dispatch Schedule
      </Text>
      {list.map((schedule, index) => {
        const { quantity, lead_time_menu } = schedule
        return (
          <View style={styles.row} key={index}>
            <TextPair
              style={{ width: '50%' }}
              text={'Quantity'}
              value={quantity || '-- --'}
            />
            <TextPair
              style={{ width: '50%' }}
              text={'Lead Time'}
              value={
                lead_time_menu
                  ? _find(leadTimeValues, { value: lead_time_menu }).label
                  : '-- --'
              }
            />
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    marginTop: 10,
    width: '100%',
  },
})

export default DispatchSchedule
