import React, { useEffect, useState } from 'react'
import _indexOf from 'lodash/indexOf'
import moment from 'moment-timezone'
import { View } from 'react-native'
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
        historyDates.map((date, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={i}>
            <Subheading>{date}</Subheading>
            {histories.length > 0 &&
              histories.map((history, j) => (
                <View
                  key={j}
                  style={{
                    display: `${history.date !== date ? 'none' : 'flex'}`,
                  }}
                >
                  {history.date === date ? (
                    <Text>
                      {history.time}.{''}
                      {''} {history.message}
                    </Text>
                  ) : null}
                </View>
              ))}
          </View>
        ))}
      {historyDates.length === 0 && <Text>No history found</Text>}
    </View>
  )
}

export default PurchaseOrderHistory
