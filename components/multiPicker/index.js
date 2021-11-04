import React from 'react'
import { View } from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { MaterialIcons } from '@expo/vector-icons'
import colors from 'common/colors'

const MultiPicker = ({
  label,
  options,
  selectedItems,
  onSelectedItemsChange,
  disabled,
  style,
}) => {
  const items = [
    {
      name: label,
      id: -1,
      children: options,
    },
  ]

  return (
    <View style={style}>
      <SectionedMultiSelect
        styles={{
          chipContainer: {
            backgroundColor: colors.primary,
            borderColor: '#FFF',
          },
          chipText: { color: '#FFF', fontWeight: 'bold' },
          selectToggle: {
            borderWidth: 1,
            borderColor: 'gray',
            padding: 15,
            borderRadius: 2,
          },
          chipsWrapper: {
            backgroundColor: '#d9d9d9',
            borderBottomRightRadius: 2,
            borderBottomLeftRadius: 2,
            padding: 2,
            marginTop: 3,
          },
          subSeparator: { backgroundColor: 'gray' },
          subItem: { paddingVertical: 15 },
        }}
        colors={{
          primary: colors.primary,
          chipColor: colors.foreground,
        }}
        items={items}
        disabled={disabled}
        IconRenderer={MaterialIcons}
        uniqueKey='id'
        subKey='children'
        icons={{
          search: {
            name: 'search',
            size: 20,
          },
          selectArrowDown: {
            name: 'arrow-drop-down',
            size: 20,
          },
          check: {
            name: 'check',
            size: 20,
          },
          close: {
            name: 'close',
            size: 20,
          },
        }}
        searchPlaceholderText={'Search'}
        selectText={label}
        readOnlyHeadings={true}
        expandDropDowns={true}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
      />
    </View>
  )
}

export default MultiPicker
