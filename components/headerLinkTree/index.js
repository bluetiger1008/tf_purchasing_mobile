import React from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { StackActions } from '@react-navigation/native'
import { navigationRef } from '../../RootNavigation'

const HeaderLinkTree = ({ links }) => {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, flexDirection: 'row' }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {links.map((link, index) => {
        const isLastItem = links.length == index + 1
        let popAction = StackActions.pop(links.length - (index + 1))

        return (
          <View style={{ flexDirection: 'row' }} key={index}>
            <TouchableOpacity
              disabled={isLastItem}
              onPress={() => {
                !isLastItem && navigationRef.current?.dispatch(popAction)
              }}
            >
              <Text style={styles.text}>{link}</Text>
            </TouchableOpacity>
            {!isLastItem && <Text style={styles.text}> / </Text>}
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#FFF',
    fontSize: 16,
  },
})

export default HeaderLinkTree
