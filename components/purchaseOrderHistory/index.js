import React, { useEffect, useState } from 'react'
import _indexOf from 'lodash/indexOf'
import moment from 'moment-timezone'
import { View, StyleSheet } from 'react-native'
import { Subheading, Text } from 'react-native-paper'

const PurchaseOrderHistory = ({ historyData }) => {
  const [historyDates, setHistoryDates] = useState([])
  const [histories, setHistories] = useState([])

  useEffect(() => {
    let historiesArr = []
    let historyDatesArr = []

    historyData.map((history) => {
      const date = moment(history.datetime.timestamp).tz(
        history.datetime.timezone_name
      )

      if (_indexOf(historyDatesArr, date.format('MMMM DD YYYY')) === -1) {
        historyDatesArr = [...historyDatesArr, date.format('MMMM DD YYYY')]
      }

      historiesArr = [
        ...historiesArr,
        {
          date: date.format('MMMM DD YYYY'),
          time: date.format('h:m a z'),
          message: history.message,
        },
      ]
    })
    setHistoryDates(historyDatesArr)
    setHistories(historiesArr)
  }, [])

  return (
    <View>
      {historyDates.length > 0 &&
        histories.map((history, index) => {
          const { date, time, message } = history
          return (
            <View key={index} style={styles.item_container}>
              {histories.length - 1 != index ? (
                <View style={styles.vertical_line} />
              ) : (
                <View
                  style={{
                    ...styles.vertical_line,
                    backgroundColor: '#e6e6e6',
                    height: 70,
                  }}
                />
              )}

              <View
                style={{
                  ...styles.dot,
                  backgroundColor: index == 0 ? '#30b319' : 'gray',
                }}
              />

              <View style={{ marginLeft: 25 }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {date} {time}
                </Text>
                <Text style={{ color: '#808080', fontSize: 13 }}>
                  {message}
                </Text>
              </View>
            </View>
          )
        })}
      {historyDates.length === 0 && <Text>No history found</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  item_container: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    position: 'absolute',
    top: 4,
    left: 1.5,
  },
  vertical_line: {
    height: 100,
    width: 1,
    backgroundColor: 'gray',
    position: 'absolute',
    left: 6,
    top: 10,
  },
})

export default PurchaseOrderHistory
