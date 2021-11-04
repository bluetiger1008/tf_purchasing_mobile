import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text, Divider } from 'react-native-paper'
import { readRfqAPI } from 'services/helpers/apis/rfq'
import AssignDropdown from 'components/tables/assignDropdown'
import StatusDropdown from 'components/statusDropDown'
import Timeline from './components/timeline'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RfqViewTabs from './tabs'

import { useDispatch, useSelector } from 'react-redux'

import rfqActions from 'services/redux/rfq/actions'
import { useRfqListContext } from '../context'
import Loader from 'components/loader'
import { HeaderLinkTree } from 'components'

const { setRfqData, onRfqSendConfirmed, setIsQuoteUpdated } = rfqActions

const RfqView = ({
  navigation,
  route,
  sentRfqId,
  isQuoteUpdated,
  selectedTab,
  onClose,
  onRfqSendConfirmed,
  // setRfqData,
  setIsQuoteUpdated,
}) => {
  const { rfq } = route.params
  const [rfqData, setRfqData] = useState(null)
  const [loading, setLoading] = useState(false)

  const rfqListContext = useRfqListContext()
  const { statusList, userList, suppliersList, rpqLoading } = rfqListContext

  const dispatch = useDispatch()

  const callApis = async () => {
    setLoading(true)
    try {
      const readRfqResponse = await readRfqAPI(rfq.uuid)
      const readRfqData = readRfqResponse.data.data
      setRfqData(readRfqData)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const onStatusUpdated = () => {
    callApis()
  }

  useEffect(() => {
    callApis()
  }, [])

  useEffect(() => {
    if (sentRfqId) {
      callApis()
      onRfqSendConfirmed()
    }
  }, [sentRfqId])

  useEffect(() => {
    if (isQuoteUpdated) {
      callApis()
      setIsQuoteUpdated(false)
    }
  }, [isQuoteUpdated])

  const headerName = rfqData ? rfqData.id : ''

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['RFQs', headerName]} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      {loading && <Loader />}

      {!!rfqData && !loading && (
        <>
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                RFQ: {rfqData.id} | {rfqData.supplier}
              </Text>
              <View style={{ flexGrow: 1 }} />
              <View style={{ flexGrow: 1, height: 50, paddingLeft: 10 }}>
                <StatusDropdown
                  statuses={rfqData.status_list}
                  statusId={rfqData.status_id}
                  uuid={rfqData.uuid}
                  onStatusUpdated={onStatusUpdated}
                  selectorStyle={{
                    backgroundColor: rfqData.status_list.find(
                      (e, i) => e.id == rfqData.status_id
                    ).color,
                    borderRadius: 5,
                  }}
                  selectorTextStyle={{
                    color: '#FFF',
                    fontSize: 16,
                  }}
                  statusFor='rfq'
                />
              </View>
            </View>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}
            >
              Assigned To:
            </Text>
            <View style={{ flexGrow: 1, height: 50, paddingLeft: 10 }}>
              {userList.length > 0 && (
                <AssignDropdown
                  userList={userList}
                  selected={rfqData}
                  permissions={{ assign: rfqData.permissions.can_assign }}
                  updateFor='rfq'
                  selectorStyle={{
                    backgroundColor: '#e8e8e8',
                    borderRadius: 5,
                  }}
                />
              )}
            </View>

            <Divider style={{ marginVertical: 5 }} />

            <Timeline timeline={rfqData.timeline} />
          </View>
          <RfqViewTabs selectedRfq={rfqData} navigation={navigation} />
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flexShrink: 1,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

const mapStateToProps = (state) => ({
  sentRfqId: state.rfq.sent_rfq_id,
  isQuoteUpdated: state.rfq.is_quote_updated,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setRfqData,
      onRfqSendConfirmed,
      setIsQuoteUpdated,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(RfqView)
