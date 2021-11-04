import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const Timeline = ({ timeline }) => {
  return (
    <View style={styles.row}>
      {timeline.map((time, index) => {
        const { icon, icon_color, line1, line2, line3, line_bold, line_color } =
          time
        return (
          <View style={styles.item} key={index}>
            <View style={{ width: 20, height: 20 }}>
              {timeline.length !== index + 1 ? (
                <View
                  style={{
                    height: line_bold ? 2 : 1,
                    width: 95,
                    backgroundColor: line_color,
                    position: 'absolute',
                    right: -85,
                    top: line_bold ? 8 : 8.5,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 5,
                    width: 95,
                    backgroundColor: '#FFF',
                    position: 'absolute',
                    right: -85,
                    top: 7,
                  }}
                />
              )}
              {icon ? (
                <MaterialIcons
                  name={icon.replace(/_/g, '-')}
                  color={icon_color || '#000'}
                  size={17}
                  style={{ backgroundColor: '#FFF' }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: '#FFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={styles.circle} />
                </View>
              )}
            </View>

            {!!line1 && (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {line1.replace(' ', '\n')}
              </Text>
            )}
            {!!line2 && (
              <Text style={{ fontSize: 12, color: 'gray' }}>{line2}</Text>
            )}
            {!!line3 && (
              <Text style={{ fontSize: 12, color: 'gray' }}>{line3}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    // alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    marginTop: 2,
    borderRadius: 7.5,
    backgroundColor: '#000',
  },
  item: {
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
})

export default Timeline
