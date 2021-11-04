import React, { useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native'
import { Text, Card } from 'react-native-paper'
import Collapsible from 'react-native-collapsible'
import { MaterialIcons } from '@expo/vector-icons'

const AccordionItem = ({
  children,
  title,
  showState,
  expanded,
  customState,
  style,
  renderTitleComponent,
}) => {
  const [show, setShow] = customState ? useState(!expanded) : showState
  const rotateAnim = useRef(new Animated.Value(!show ? 0 : 1)).current

  const rotationValue = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '-90deg'],
  })

  const rotate = () => {
    Animated.timing(rotateAnim, {
      toValue: show ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }
  return (
    <Card style={{ ...styles.itemWrapper, ...style }}>
      <Card.Content>
        <TouchableOpacity
          onPress={() => {
            rotate()
            setShow(!show)
          }}
          style={styles.header}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
            {renderTitleComponent && renderTitleComponent()}
          </View>

          <Animated.View style={{ transform: [{ rotateZ: rotationValue }] }}>
            <MaterialIcons name='chevron-left' size={25} color={'gray'} />
          </Animated.View>
        </TouchableOpacity>

        <Collapsible style={styles.collapsedWrapper} collapsed={show}>
          {children}
        </Collapsible>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  collapsedWrapper: {
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    marginTop: 10,
  },
  itemWrapper: {
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
})

export default AccordionItem
