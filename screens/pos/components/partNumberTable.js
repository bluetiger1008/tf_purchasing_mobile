import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import {
  Text,
  DataTable,
  Checkbox,
  TextInput,
  Button,
} from 'react-native-paper'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import { MaterialIcons } from '@expo/vector-icons'

import { getComparator, stableSort } from 'components/tables/utils'

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => {
    onRequestSort(property)
  }

  const headCells = [
    {
      id: 'part_number',
      label: 'Part Number',
      flex: 2,
    },
    { id: 'manufacturer', label: 'Manufacturer', flex: 1.5 },
    { id: 'quantity', label: 'Quantity', flex: 1 },
  ]

  return (
    <DataTable.Header>
      {headCells.map((headCell) => (
        <DataTable.Title
          key={headCell.id}
          sortDirection={orderBy === headCell.id ? order : false}
          style={{ flex: headCell.flex }}
          onPress={() => createSortHandler(headCell.id)}
        >
          {headCell.label}
        </DataTable.Title>
      ))}
    </DataTable.Header>
  )
}

const ChangeQuantity = ({ line, onChange, onClose }) => {
  const [value, setValue] = useState(line.total_difference.toString())
  const [inputError, setInputError] = useState(false)

  const onChangeInput = (value) => {
    setValue(value)
    if (
      (parseInt(value, 10) >= 0 &&
        parseInt(value, 10) <= line.total_difference) ||
      value === ''
    ) {
      setInputError(false)
    } else {
      setInputError(true)
    }
  }

  const onUpdate = () => {
    onChange({ ...line, quantity: parseInt(value, 10) })
  }
  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Change Quantity
        </Text>

        <TextInput
          mode='outlined'
          style={styles.textInput}
          label='Quantity'
          value={value}
          onChangeText={onChangeInput}
        />

        <Text style={{ color: 'gray' }}>
          Maximum quantity is {line.total_difference}
        </Text>

        {inputError && <Text style={{ color: 'red' }}>Invalid quantity</Text>}

        <Button
          disabled={inputError || value == ''}
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onUpdate}
        >
          Update
        </Button>

        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <MaterialIcons name='close' size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  textInput: {
    backgroundColor: '#FFF',
    marginVertical: 0,
    paddingVertical: 0,
    marginBottom: 10,
  },
  button: {
    marginVertical: 7,
  },
})

const PartNumberTable = ({ lines, onSelectLine }) => {
  const [order, setOrder] = useState('ascending')
  const [orderBy, setOrderBy] = useState('part_number')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [tableRows, setTableRows] = useState(lines)
  const [changeQuantityModal, setChangeQuantityModal] = useState(false)
  const [selectedLine, setSelectedLine] = useState()

  useEffect(() => {
    const linesWithQuantity = lines.map((line) => ({
      ...line,
      quantity: line.total_difference,
    }))
    setTableRows(linesWithQuantity)
  }, [])

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'ascending'
    setOrder(isAsc ? 'descending' : 'ascending')
    setOrderBy(property)
  }

  const handleSelectAllClick = (value) => {
    if (value) {
      const newSelecteds = tableRows.map((n) => n.part_number)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
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

    setSelected(newSelected)
  }

  const handleChangePage = (newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(parseInt(value, 10))
    setPage(0)
  }

  const handleChangeQuantity = (line) => {
    const index = _findIndex(tableRows, { part_number: line.part_number })

    const arr = [...tableRows]
    arr[index].quantity = line.quantity
    setTableRows(arr)
    onCloseChangeQuantity()
  }

  const isSelected = (name) => selected.indexOf(name) !== -1
  const isSelectecAll =
    tableRows.length > 0 && selected.length === tableRows.length

  const onEditLine = (line) => {
    setSelectedLine(line)
  }

  const onCloseChangeQuantity = () => {
    setChangeQuantityModal(false)
    setSelectedLine(null)
  }

  useEffect(() => {
    if (selectedLine) {
      setChangeQuantityModal(true)
    }
  }, [selectedLine])

  useEffect(() => {
    if (selected.length > 0) {
      const selectedLines = []
      selected.map((partNumber) => {
        const selectedRow = _find(tableRows, { part_number: partNumber })
        selectedLines.push(selectedRow)

        return selectedLines
      })
      onSelectLine(selectedLines)
    } else {
      onSelectLine([])
    }
  }, [selected, tableRows])

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tableRows.length - page * rowsPerPage)

  const maxItemValue =
    tableRows.length < rowsPerPage * (page + 1)
      ? tableRows.length
      : rowsPerPage * (page + 1)
  return (
    <>
      <DataTable>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox.Android
              status={isSelectecAll ? 'checked' : 'unchecked'}
              onPress={() => handleSelectAllClick(!isSelectecAll)}
            />
            <Text>Select All</Text>
          </View>
          <Text> or Tap a row to select</Text>
        </View>

        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={tableRows.length}
        />

        {stableSort(tableRows, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            const isItemSelected = isSelected(row.part_number)

            return (
              <DataTable.Row
                style={{ backgroundColor: isItemSelected ? '#FF3EA5' : '#FFF' }}
                onPress={() => handleClick(!isItemSelected, row.part_number)}
                key={row.part_number}
              >
                <DataTable.Cell style={{ flex: 3 }}>
                  {row.part_number}
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  {row.manufacturer.abbreviation}
                </DataTable.Cell>

                <DataTable.Cell style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => onEditLine(row)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      paddingTop: 10,
                    }}
                  >
                    <Text>{row.quantity}</Text>
                    <MaterialIcons name='edit' size={15} color={'gray'} />
                  </TouchableOpacity>
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(tableRows.length / rowsPerPage)}
          onPageChange={handleChangePage}
          label={`${rowsPerPage * page + 1} - ${maxItemValue} of ${
            tableRows.length
          }`}
          optionsPerPage={[5, 10, 25]}
          itemsPerPage={rowsPerPage}
          setItemsPerPage={handleChangeRowsPerPage}
          showFastPagination
          optionsLabel={'Rows per page'}
        />
      </DataTable>

      <Modal visible={changeQuantityModal} transparent animationType='fade'>
        <ChangeQuantity
          line={selectedLine}
          onClose={onCloseChangeQuantity}
          onChange={handleChangeQuantity}
        />
      </Modal>
    </>
  )
}

export default PartNumberTable
