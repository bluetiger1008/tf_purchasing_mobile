import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Button } from 'react-native-paper'

import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { MaterialIcons } from '@expo/vector-icons'
import { SinglePicker, DateTimePicker } from 'components'

import { GlobalContext } from '../../../../../Main'

import { updatePoAPI } from 'services/helpers/apis/po'
import moment from 'moment'

const EditInfo = ({
  onClose,
  carriersList,
  carriersServiceList,
  fetchCarriersService,
  uuid,
  permissions,
  onUpdate,
  defaultInfo,
}) => {
  const context = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(defaultInfo)

  const handleChangeField = (name, value) => {
    if (name === 'carrier') {
      fetchCarriersService(value)
    }
    setInfo({ ...info, [name]: value })
  }

  const updateCarrierInfo = async () => {
    const requestObject = { carrier_service_id: info.carrierService }
    if (info.dateConfirmed) {
      requestObject.date_confirmed = moment(info.dateConfirmed).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
    setLoading(true)
    try {
      await updatePoAPI(uuid, requestObject)
      context.onApiSuccess('Update Success')
      onUpdate(info)
      onClose()
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View style={styles.modal_wrapper}>
        <View style={styles.content}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Edit Info
          </Text>

          <SinglePicker
            title='Carrier'
            style={{ marginBottom: 10 }}
            list={carriersList}
            id='id'
            label='carrier'
            selectedValue={info.carrier}
            onChangeValue={(value) => handleChangeField('carrier', value.id)}
          />

          <SinglePicker
            title='Service'
            list={carriersServiceList}
            id='id'
            label='name'
            selectedValue={info.carrierService}
            onChangeValue={(value) => {
              handleChangeField('carrierService', value.id)
            }}
          />

          {permissions.can_edit_date_confirmed && (
            <>
              <DateTimePicker
                title='Date'
                onDateChange={(_date) =>
                  handleChangeField('dateConfirmed', _date)
                }
                mode='date'
                selectedDate={info.dateConfirmed}
              />

              <DateTimePicker
                title='Time'
                onDateChange={(_date) =>
                  handleChangeField('dateConfirmed', _date)
                }
                mode='time'
                format='hh:mm A'
                selectedDate={info.dateConfirmed}
              />
            </>
          )}

          <Button
            loading={loading}
            disabled={loading || !info.carrierService}
            style={{ ...styles.button, marginTop: 12 }}
            mode='contained'
            onPress={updateCarrierInfo}
          >
            Update
          </Button>

          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons name='close' size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </>
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
  uploadLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  imageLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    marginVertical: 10,
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
  pickerWrapper: {
    borderColor: '#000',
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    marginVertical: 7,
  },
})

export default EditInfo
