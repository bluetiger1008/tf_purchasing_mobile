import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Text, Divider } from 'react-native-paper'
import AssignDropdown from 'components/tables/assignDropdown'
import StatusDropdown from 'components/statusDropDown'
import Timeline from 'components/timeline'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PoViewTabs from './tabs'

import purchaseOrderActions from 'services/redux/purchaseOrder/actions'
import { usePoListContext } from '../context'
import Loader from 'components/loader'
import _find from 'lodash/find'
import { HeaderLinkTree } from 'components'

const { setPoData, onPoSendConfirmed } = purchaseOrderActions

const PoView = ({ navigation, route }) => {
  const { po } = route.params
  const poListContext = usePoListContext()
  const { userList, purchaseOrderData, fetchPurchaseOrder, poLoading } =
    poListContext

  const onStatusUpdated = () => {
    fetchPurchaseOrder(po.uuid, { showLoading: false })
  }

  useEffect(() => {
    fetchPurchaseOrder(po.uuid, { showLoading: true })
  }, [])

  const headerName = purchaseOrderData ? purchaseOrderData.id : ''

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />

        <HeaderLinkTree links={['Purchase Orders', headerName]} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      {poLoading && <Loader />}

      {!!purchaseOrderData && !poLoading && (
        <>
          <View style={styles.content}>
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Purchase Order: {purchaseOrderData.id} |{' '}
                {purchaseOrderData.supplier}
              </Text>
              <View style={{ flexGrow: 1 }} />
              <View style={{ flexGrow: 1, height: 50, paddingLeft: 10 }}>
                <StatusDropdown
                  statuses={purchaseOrderData.status_list}
                  statusId={purchaseOrderData.status_id}
                  uuid={purchaseOrderData.uuid}
                  onStatusUpdated={onStatusUpdated}
                  selectorStyle={{
                    backgroundColor: purchaseOrderData.status_list.find(
                      (e, i) => e.id == purchaseOrderData.status_id
                    ).color,
                    borderRadius: 5,
                    borderWidth: 0,
                  }}
                  selectorTextStyle={{
                    color: '#FFF',
                    fontSize: 16,
                  }}
                  statusFor='po'
                />
              </View>
            </View>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, marginVertical: 5 }}
            >
              Assigned To:
            </Text>
            <View style={{ flexGrow: 1, height: 60, paddingLeft: 10 }}>
              {userList.length > 0 && (
                <AssignDropdown
                  userList={userList}
                  selected={purchaseOrderData}
                  permissions={{
                    assign: purchaseOrderData.permissions.can_assign,
                  }}
                  updateFor='po'
                  selectorStyle={{
                    backgroundColor: '#e8e8e8',
                    borderRadius: 5,
                  }}
                />
              )}
            </View>

            <Divider style={{ marginVertical: 5 }} />

            <Timeline timeline={purchaseOrderData.timeline} />
          </View>

          <PoViewTabs selectedPo={purchaseOrderData} navigation={navigation} />
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPoData,
      onPoSendConfirmed,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(PoView)
