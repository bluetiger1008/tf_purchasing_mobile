import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Modal, Alert } from 'react-native'
import {
  Card,
  Text,
  Divider,
  Button,
  Checkbox,
  IconButton,
} from 'react-native-paper'
import { TextPair } from 'components'
import DispatchSchedule from './dispatchSchedule'
import { useRfqListContext } from '../../../../../context'
import { GlobalContext } from '../../../../../../../Main'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _remove from 'lodash/remove'

import CreateNewQuote from './createNewQuote'
import EditQuote from './editQuote'
import AddToPo from './addToPo'
import colors from 'common/colors'

import {
  deleteRfqQuoteAPI,
  updateRfqQuoteAPI,
  updateRfqQuoteRatingAPI,
  updateRfqQuotePauseAPI,
  finalizeRfqQuoteAPI,
} from 'services/helpers/apis/rfq'

const QuotedItemList = ({ list = [], selectedRfq }) => {
  const context = useContext(GlobalContext)
  const { manufacturerList } = useRfqListContext()
  const [quotedList, setQuotedList] = useState(list)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [addQuote, setAddQuote] = useState(false)
  const [editQuote, setEditQuote] = useState(false)
  const [addToPo, setAddToPo] = useState(false)

  const { can_edit_quote, can_edit_lines, can_pause, can_update_rating } =
    selectedRfq.permissions

  const showFinalizeButton = can_edit_quote
  const showPoButton = !can_edit_quote && !can_edit_lines
  const showCreateButton = can_edit_quote && manufacturerList.length > 0

  // updateQuote
  const onUpdateQuote = async (quote) => {
    const tempQuoteList = [...quotedList]
    tempQuoteList[selectedIndex] = {
      ...tempQuoteList[selectedIndex],
      item: quote.item,
      manufacturer_id: quote.manufacturer_id,
      price: quote.price,
      quantity: quote.quantity,
      supplier_part_number: quote.supplier_part_number,
      supplier_part_number_custom: quote.supplier_part_number_custom,
      dispatch_schedule: quote.dispatch_schedule,
    }

    setQuotedList(tempQuoteList)
  }
  // add quote
  const onAddQuote = async (quote) => {
    const tempQuoteList = [...quotedList]
    tempQuoteList.push({
      rfq_quote_line_uuid: quote.uuid,
      isCustomItem: true,
      ...quote,
    })
    setQuotedList(tempQuoteList)
  }

  const onDeleteQuote = async (_selectedQuote) => {
    try {
      await deleteRfqQuoteAPI(_selectedQuote.rfq_quote_line_uuid)
      const tempQuoteList = [...quotedList]
      _remove(
        tempQuoteList,
        (v) => v.rfq_quote_line_uuid == _selectedQuote.rfq_quote_line_uuid
      )
      setQuotedList([...tempQuoteList])
      context.onApiSuccess('Quote item is deleted.')
    } catch (error) {
      context.onApiError(error)
    } finally {
    }
  }

  const onSelectQuote = async (quote, index) => {
    if (!can_edit_quote) return
    setSelectedQuote(quote)
    setSelectedIndex(index)
  }

  const onFinalizeQuote = async () => {
    try {
      await finalizeRfqQuoteAPI(selectedRfq.uuid)
      Alert.alert(
        'Congratulations! ',
        `You have finalized the quote for RFQ ${selectedRfq.id}`,
        [
          {
            text: 'Okay',
            onPress: () => {},
          },
        ]
      )
    } catch (error) {
      context.onApiError(error)
    } finally {
    }
  }

  const onClickSmile = (quote, index) => {
    const tempArray = [...quotedList]
    const rating = tempArray[index].rating
    tempArray[index].rating = rating === 1 ? 0 : 1
    setQuotedList(tempArray)
    updateRating(quote.rfq_quote_line_uuid, tempArray[index].rating)
  }

  const onClickPoop = (quote, index) => {
    const tempArray = [...quotedList]
    const rating = tempArray[index].rating
    tempArray[index].rating = rating !== -1 ? -1 : 0
    setQuotedList(tempArray)
    updateRating(quote.rfq_quote_line_uuid, tempArray[index].rating)
  }

  const onClickPause = async (quote, index) => {
    const tempArray = [...quotedList]
    const puseState = tempArray[index].pause ? 'off' : 'on'
    try {
      await updateRfqQuotePauseAPI(quote.rfq_quote_line_uuid, puseState)
      tempArray[index].pause = !tempArray[index].pause
      setQuotedList(tempArray)
    } catch (error) {
      context.onApiError(error)
    } finally {
    }
  }

  const updateRating = async (quote_uuid, rating) => {
    try {
      await updateRfqQuoteRatingAPI(quote_uuid, rating)
    } catch (error) {
      context.onApiError(error)
    } finally {
    }
  }

  const handleSelect = (name) => {
    const selectedIndex = selectedIds.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1))
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      )
    }

    setSelectedIds(newSelected)
  }

  const getSelectedQuotes = () => {
    return _filter(quotedList, (quote) =>
      selectedIds.includes(quote.rfq_quote_line_uuid)
    )
  }

  useEffect(() => {
    if (selectedQuote) {
      setEditQuote(true)
    }
  }, [selectedQuote])

  useEffect(() => {
    if (quotedList.length <= 0 && list.length > 0) {
      setQuotedList(list)
    }
  }, [list])

  const renderItem = (item, key) => {
    const {
      quantity,
      item: partNumberItem,
      rfq_line,
      supplier_part_number,
      supplier_part_number_custom,
      manufacturer_id,
      price,
      dispatch_schedule,
    } = item

    const manufacturerValue =
      manufacturerList.length > 0 && manufacturer_id > 0
        ? _find(manufacturerList, { id: manufacturer_id }).name || ''
        : '-- --'

    const isSelected = selectedIds.includes(item.rfq_quote_line_uuid)
    return (
      <Card
        style={{ marginBottom: 10 }}
        key={key}
        onPress={() => onSelectQuote(item, key)}
      >
        <Card.Content>
          {showPoButton && (
            <View style={styles.poSelection}>
              <Checkbox.Android
                color={colors.primary}
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={() => {
                  handleSelect(item.rfq_quote_line_uuid)
                }}
              />

              <View style={{ flexDirection: 'row' }}>
                {can_update_rating && (
                  <>
                    <IconButton
                      color={item.rating === -1 ? 'brown' : 'gray'}
                      icon='emoticon-poop'
                      onPress={() => onClickPoop(item, key)}
                    />
                    <IconButton
                      color={item.rating === 1 ? '#ffde34' : 'gray'}
                      icon='emoticon'
                      onPress={() => onClickSmile(item, key)}
                    />
                  </>
                )}

                {can_pause && (
                  <IconButton
                    color={item.pause ? '#ffde34' : 'gray'}
                    icon='hand'
                    onPress={() => onClickPause(item, key)}
                  />
                )}
              </View>
            </View>
          )}
          <Text style={{ fontSize: 12, color: 'gray' }}>
            Requisition number{' '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textDecorationLine: rfq_line ? 'underline' : 'none',
            }}
          >
            {rfq_line ? rfq_line.requisition_detail.order_id : '-- --'}
          </Text>

          <View style={styles.row}>
            <TextPair
              style={{ width: '50%' }}
              text={'Quantity'}
              value={quantity || '-- --'}
            />
            <TextPair
              style={{ width: '50%' }}
              text={'Part Number'}
              value={partNumberItem || '-- --'}
            />
          </View>

          <View style={styles.row}>
            <TextPair
              style={{ width: '50%' }}
              text={'Supplier Part No.'}
              value={supplier_part_number || '-- --'}
            />

            <TextPair
              style={{ width: '50%' }}
              text={'Manufacturer'}
              value={manufacturerValue || '-- --'}
            />
          </View>

          <View style={styles.row}>
            <TextPair
              style={{ width: '50%' }}
              text={'Custom'}
              value={supplier_part_number_custom ? 'Yes' : 'No' || '-- --'}
            />
            <TextPair
              style={{ width: '50%' }}
              text={'Price'}
              value={price ? `$${price.toFixed(2)}` : '-- --'}
            />
          </View>

          <Divider style={{ marginVertical: 10 }} />

          <DispatchSchedule list={dispatch_schedule} />
        </Card.Content>
      </Card>
    )
  }
  return (
    <>
      <View style={{ minHeight: 60 }}>
        {quotedList.map((item, index) => {
          return renderItem(item, index)
        })}

        {showCreateButton && (
          <Button
            style={styles.button}
            mode='contained'
            onPress={() => setAddQuote(true)}
          >
            Create New
          </Button>
        )}

        {showPoButton && (
          <Button
            style={styles.button}
            disabled={selectedIds.length <= 0}
            mode='contained'
            onPress={() => {
              setAddToPo(true)
            }}
          >
            Add to PO
          </Button>
        )}

        {showFinalizeButton && (
          <Button
            style={styles.button}
            mode='contained'
            onPress={onFinalizeQuote}
          >
            Finalize Quote
          </Button>
        )}
      </View>

      <Modal visible={addQuote} transparent animationType='fade'>
        <CreateNewQuote
          onClose={() => setAddQuote(false)}
          uuid={selectedRfq.uuid}
          onAddQuote={onAddQuote}
        />
      </Modal>

      <Modal visible={editQuote} transparent animationType='fade'>
        <EditQuote
          onClose={() => {
            setEditQuote(false)
            setSelectedQuote(null)
          }}
          selectedQuote={selectedQuote}
          onUpdateQuote={onUpdateQuote}
          onDeleteQuote={onDeleteQuote}
        />
      </Modal>

      <Modal visible={addToPo} transparent animationType='fade'>
        <AddToPo
          onClose={() => setAddToPo(false)}
          supplierId={selectedRfq.supplier_id}
          selectedQuotes={getSelectedQuotes()}
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
    marginTop: 10,
    width: '100%',
  },
  button: {
    marginVertical: 10,
  },
  poSelection: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
})

export default QuotedItemList
