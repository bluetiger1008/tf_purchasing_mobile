import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { VictoryPie } from 'victory-native'
import Svg, { Text as SvgText } from 'react-native-svg'

const QuantityChart = ({ requisition, quantitiesColors }) => {
  const [chart, setChart] = useState(null)

  useEffect(() => {
    let chartData = {
      series: [],
      labels: [],
      colors: [],
    }

    requisition.pie_chart.map((serie, index) => {
      const serieValue = serie.end_degree - serie.start_degree
      chartData = {
        series: [...chartData.series, { x: `${index}`, y: serieValue }],
        colors: [...chartData.colors, serie.color],
      }

      return true
    })

    setChart(chartData)
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <Text>Quantity</Text>

        {chart && (
          <Svg height='200' width='200'>
            <SvgText
              fill='black'
              fontSize='20'
              fontWeight='bold'
              x='100'
              y='110'
              textAnchor='middle'
            >
              {requisition.quantity.order_quantity}
            </SvgText>
            <VictoryPie
              padAngle={5}
              innerRadius={100}
              width={200}
              height={200}
              colorScale={chart.colors}
              data={chart.series}
              labels={() => null}
              standalone={false}
            />
          </Svg>
        )}
      </View>
      <View>
        <View>
          <Text>RFQ</Text>
          <View style={styles.statusesWrapper}>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.rfq.draft.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.rfq.draft.text,
                }}
              >
                {requisition.quantity.rfq.draft} {'\n'} Draft
              </Text>
            </View>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.rfq.pending.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.rfq.pending.text,
                }}
              >
                {requisition.quantity.rfq.pending} {'\n'} Pending
              </Text>
            </View>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.rfq.quoted.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.rfq.quoted.text,
                }}
              >
                {requisition.quantity.rfq.quoted} {'\n'} Quoted
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text>PO</Text>
          <View style={styles.statusesWrapper}>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.po.draft.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.po.draft.text,
                }}
              >
                {requisition.quantity.po.draft}
                {'\n'} Draft
              </Text>
            </View>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.po.ordered.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.po.ordered.text,
                }}
              >
                {requisition.quantity.po.ordered} {'\n'} Ordered
              </Text>
            </View>
            <View
              style={{
                ...styles.statusBox,
                backgroundColor: quantitiesColors.po.confirmed.background,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: quantitiesColors.po.confirmed.text,
                }}
              >
                {requisition.quantity.po.confirmed} {'\n'} Confirmed
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusesWrapper: {
    flexDirection: 'row',
    width: 260,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusBox: {
    width: 80,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default QuantityChart
