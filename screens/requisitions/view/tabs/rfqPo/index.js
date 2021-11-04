import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, ScrollView, View, Modal } from 'react-native'
import { Title, IconButton } from 'react-native-paper'
import axios from 'axios'
import { connect } from 'react-redux'
import { GlobalContext } from '../../../../../Main'

import { getRequisitionRfqpoAPI } from 'services/helpers/apis/requisition'
import RfqTable from 'components/rfqTable'
import Loader from 'components/loader'
import AddToRfqModal from './addToRfqModal'

const RfqPo = ({ uuid, requisition }) => {
  const signal = axios.CancelToken.source()
  const context = useContext(GlobalContext)
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(false)
  const [addRfq, setAddRfq] = useState(false)
  const [partNumbers] = useState(requisition.requisition.part_numbers || null)

  useEffect(() => {
    getRequisitionRfqPo()
    return () => {
      signal.cancel('Api is being canceled')
    }
  }, [])

  const onRfqSent = () => {
    getRequisitionRfqPo()
  }

  const getRequisitionRfqPo = async () => {
    try {
      setLoading(true)
      const requisitionResponse = await getRequisitionRfqpoAPI(
        uuid,
        signal.token
      )
      const { lines } = requisitionResponse.data.data
      setLines(lines)
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }
  return loading ? (
    <Loader />
  ) : (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Title>RFQ/PO</Title>
          <IconButton
            icon='plus'
            color={'blue'}
            size={20}
            onPress={() => setAddRfq(true)}
          />
        </View>

        {lines !== [] ? (
          <RfqTable lines={lines} />
        ) : (
          <Text>No RFQ/PO found</Text>
        )}
      </ScrollView>

      <Modal visible={addRfq} transparent animationType='fade'>
        <AddToRfqModal
          onClose={() => setAddRfq(false)}
          partNumbers={partNumbers}
          requisition={requisition}
          onRfqSent={onRfqSent}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  button: {
    marginVertical: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const mapStateToProps = (state) => ({
  requisition: state.requisition.selectedRequisition,
})

export default connect(mapStateToProps)(RfqPo)
