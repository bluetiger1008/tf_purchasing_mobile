import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { Text, Divider, Card, Checkbox } from 'react-native-paper'
import { TextPair } from 'components'
import { MaterialIcons } from '@expo/vector-icons'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import _findIndex from 'lodash/findIndex'
import QuantityInput from './quantityInput'

let counter = 0
function createData(line) {
  counter += 1
  return {
    id: counter,
    ...line,
    selected: false,
  }
}

const InventoryTable = ({ data, onSelectLine }) => {
  const [selected, setSelected] = useState([])
  const [currentData, setCurrentData] = useState([])
  const [availableData, setAvailableData] = useState([])

  const [quantityInput, setQuantityInput] = useState(false)
  const [editLine, setEditLine] = useState(null)

  useEffect(() => {
    setTableData(data)
  }, [])

  useEffect(() => {
    if (!_isEmpty(currentData)) {
      setSelectedPropertyInData(currentData)
    }
  }, [selected])

  useEffect(() => {
    if (editLine) {
      setQuantityInput(true)
    } else {
      setQuantityInput(false)
    }
  }, [editLine])

  const openQuantityInput = (line) => {
    setEditLine(line)
  }

  const onUpdateLine = () => {}

  const setTableData = (data) => {
    const tempData = [...currentData]
    data.map((item) => {
      tempData.push(createData(item))
    })

    setCurrentData([...tempData])

    setAvailableData(
      _filter(tempData, (o) => {
        return o.quantity_required !== 0
      })
    )
  }

  const setSelectedPropertyInData = (_data) => {
    let tempData = [..._data]

    currentData.map((line, i) => {
      tempData[i].selected = false
    })

    selected.map((id) => {
      const index = _findIndex(_data, { id })
      tempData[index].selected = true
      return id
    })

    setCurrentData([...tempData])
    onSelectLine([...tempData])
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const handleClick = (event, n) => {
    const selectedIndex = selected.indexOf(n.id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, n.id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    if (n.quantity_required > 0) {
      setSelected([...newSelected])
    } else {
      alert('Quantity must be at least 1')
    }
  }

  const handleChangeQuantity = (n) => {
    let tempData = [...currentData]
    const index = _findIndex(currentData, { id: n.id })
    tempData[index].quantity_required = n.quantity_required
    let newData = [...tempData]
    setCurrentData(newData)
    setSelectedPropertyInData(newData)
  }

  return (
    <>
      {currentData.map((line, i) => (
        <Card key={i} style={{ marginBottom: 10 }}>
          <Card.Content>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => openQuantityInput(line)}
                style={styles.row}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  Quantity:
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'gray',
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  {line.quantity_required || '0'}
                </Text>
                <View
                  style={styles.edit}
                  onPress={() => {
                    openQuantityInput(line)
                  }}
                >
                  <MaterialIcons name='edit' size={10} color={'#FFF'} />
                </View>
              </TouchableOpacity>

              <View style={{ flexGrow: 1 }} />
              <Checkbox
                color={'#b31767'}
                status={isSelected(line.id) ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleClick(!isSelected(line.id), line)
                }}
              />
            </View>
            <Divider style={{ marginBottom: 5 }} />
            <View style={styles.row}>
              <TextPair
                style={{ width: '50%' }}
                text={'Mfg'}
                value={
                  line.manufacturer ? line.manufacturer.abbreviation : '-- --'
                }
              />
              <TextPair
                style={{ width: '50%' }}
                text={'Quantity Available'}
                value={line.quantity_available || '-- --'}
              />
            </View>

            <View style={styles.row}>
              <TextPair
                style={{ width: '50%' }}
                text={'Part Number'}
                value={line.part_number || '-- --'}
              />
              <TextPair
                style={{ width: '50%' }}
                text={'Service'}
                value={line.source || '-- --'}
              />
            </View>

            <View style={styles.row}>
              <TextPair
                style={{ width: '50%' }}
                text={'Lead Time'}
                value={line.lead_time || '-- --'}
              />
              <TextPair
                style={{ width: '50%' }}
                text={'Data Retrieved'}
                value={
                  line.fetched ? line.fetched.human_date.relative.long : '-- --'
                }
              />
            </View>
          </Card.Content>
        </Card>
      ))}

      <Modal visible={quantityInput} animationType='fade' transparent>
        <QuantityInput
          line={editLine}
          onUpdateLine={onUpdateLine}
          onChangeQuantity={handleChangeQuantity}
          onClose={() => {
            setQuantityInput(false)
            setEditLine(null)
          }}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  valuesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  value: {
    width: '50%',
  },
  edit: {
    backgroundColor: '#f5c61d',
    padding: 2.5,
    borderRadius: 5,
  },
})

export default InventoryTable
