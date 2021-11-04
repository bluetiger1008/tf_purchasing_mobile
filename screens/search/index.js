import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import {
  Appbar,
  Button,
  Title,
  TextInput,
  Modal,
  Provider,
  Portal,
  List,
} from 'react-native-paper'
import MultiSelect from 'react-native-multiple-select'

import { getRequisitionsSearchAPI } from '../../services/helpers/apis/requisition'

let assigneeMultiSelect
let statusMultiSelect
const WAIT_INTERVAL = 1000
let timer

const SearchScreen = ({ route, navigation }) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedAssignees, setSelectedAssignees] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [options, setOptions] = useState([])
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const { params } = route

  const onSelectedItemsChange = (selectFor, selectedItemsArr) => {
    if (selectFor === 'assignee') {
      setSelectedAssignees(selectedItemsArr)
    } else {
      setSelectedStatuses(selectedItemsArr)
    }
  }

  useEffect(() => {
    timer = null
  }, [])

  const onSearchFieldChange = (value) => {
    clearTimeout(timer)
    setSearchValue(value)
    const termValue = value
    const assigneeValue = ''
    const statusValue = ''

    timer = setTimeout(async () => {
      try {
        const res = await getRequisitionsSearchAPI(
          termValue,
          assigneeValue,
          statusValue
        )
        const terms = res.data.data.search.terms.map((term) => `${term}`)
        setOptions(terms)
        setSearchModalVisible(true)
      } catch (e) {
        console.log(e)
      } finally {
      }
    }, WAIT_INTERVAL)
  }

  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    height: 500,
    marginLeft: 20,
    marginRight: 20,
  }

  const onSelectSearchValue = (value) => {
    setSearchValue(value)
    setSearchModalVisible(false)
  }

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack()
          }}
        />

        <Appbar.Content title='Search' subtitle='' />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <TextInput
          label='Search'
          value={searchValue}
          mode='outlined'
          onChangeText={onSearchFieldChange}
          style={styles.searchField}
        />

        <Portal>
          <Modal
            visible={searchModalVisible}
            onDismiss={() => {
              setSearchModalVisible(false)
            }}
            contentContainerStyle={containerStyle}
          >
            <ScrollView>
              {options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onSelectSearchValue(option)}
                >
                  <List.Item title={option} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Modal>
        </Portal>

        {params.userList && (
          <View style={{ marginBottom: 20 }}>
            <MultiSelect
              hideTags
              items={params.userList}
              uniqueKey='id'
              ref={(component) => {
                assigneeMultiSelect = component
              }}
              onSelectedItemsChange={(selectedArr) =>
                onSelectedItemsChange('assignee', selectedArr)
              }
              selectedItems={selectedAssignees}
              selectText='Assignee'
              searchInputPlaceholderText='Search Items...'
              onChangeInput={(text) => console.log(text)}
              // altFontFamily='ProximaNova-Light'
              tagRemoveIconColor='#555'
              tagBorderColor='#6200ee'
              tagTextColor='#000'
              selectedItemTextColor='#CCC'
              selectedItemIconColor='#CCC'
              itemTextColor='#000'
              displayKey='name'
              searchInputStyle={styles.searchInput}
              submitButtonColor='#6200ee'
              submitButtonText='Select'
            />
            {assigneeMultiSelect && (
              <View>
                {assigneeMultiSelect.getSelectedItemsExt(selectedAssignees)}
              </View>
            )}
          </View>
        )}

        {params.statusList && (
          <View>
            <MultiSelect
              hideTags
              items={params.statusList}
              uniqueKey='id'
              ref={(component) => {
                statusMultiSelect = component
              }}
              onSelectedItemsChange={(selectedArr) =>
                onSelectedItemsChange('status', selectedArr)
              }
              selectedItems={selectedStatuses}
              selectText='Status'
              searchInputPlaceholderText='Search Items...'
              onChangeInput={(text) => console.log(text)}
              // altFontFamily='ProximaNova-Light'
              tagRemoveIconColor='#555'
              tagBorderColor='#6200ee'
              tagTextColor='#000'
              selectedItemTextColor='#CCC'
              selectedItemIconColor='#CCC'
              itemTextColor='#000'
              displayKey='status'
              searchInputStyle={styles.searchInput}
              submitButtonColor='#6200ee'
              submitButtonText='Select'
            />
            {statusMultiSelect && (
              <View>
                {statusMultiSelect.getSelectedItemsExt(selectedStatuses)}
              </View>
            )}
          </View>
        )}

        <Button
          style={{ marginTop: 10 }}
          mode='contained'
          onPress={() => console.log('Pressed')}
        >
          Search
        </Button>
      </ScrollView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
    height: 100,
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  searchField: {
    marginBottom: 20,
  },
  searchInput: {
    color: '#CCC',
    height: 56,
    letterSpacing: 1,
  },
})

export default SearchScreen
