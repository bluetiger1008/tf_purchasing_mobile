import React, { useState, useEffect } from 'react'
import { Appbar, Card, Title, Text, List, useTheme } from 'react-native-paper'
import { View, FlatList, StyleSheet } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import { fetchShipmentExpeditingListAPI } from '../../services/helpers/apis/shipment'

const Home = ({ navigation }) => {
  const [expeditingData, setExpeditingData] = useState()

  const fetchShipmentExpediting = async () => {
    try {
      const res = await fetchShipmentExpeditingListAPI()
      setExpeditingData(res.data.data.expediting)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchShipmentExpediting()
  }, [])

  const renderItem = ({ item, index }) => {
    return (
      <ListItem
        bottomDivider
        containerStyle={styles.item(item, index, expeditingData)}
      >
        <Icon name={item.icon.icon} color={`#${item.icon.color}`} />
        <ListItem.Content>
          <ListItem.Title>{item.column1.text}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>
            {item.column2.text}
          </ListItem.Subtitle>
          <ListItem.Subtitle>{item.column3.text}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    )
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Home' subtitle='' />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.container}>
        <Title>Expediting</Title>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={expeditingData}
          keyExtractor={(item) => item.uuid}
          renderItem={renderItem}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 20 },
  listContainer: {
    marginTop: 8,
  },
  subtitle: {
    marginVertical: 8,
  },
  item: (item, index, expeditingData) => ({
    backgroundColor: `#${item.background_color}`,
    borderTopLeftRadius: index === 0 ? 10 : 0,
    borderTopRightRadius: index === 0 ? 10 : 0,
    borderBottomLeftRadius: index === expeditingData.length - 1 ? 10 : 0,
    borderBottomRightRadius: index === expeditingData.length - 1 ? 10 : 0,
  }),
})

export default Home
