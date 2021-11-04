import React, { useState, useEffect, useContext } from 'react'
import { PoListContext } from './index'
import { getApiClient } from 'services/helpers/apiConfig'
import { GlobalContext } from '../../../Main'
import { getPoHistoryAPI, readPoAPI } from 'services/helpers/apis/po'

const PoListContextProvider = ({ children }) => {
  const context = useContext(GlobalContext)
  const [statusList, setStatusList] = useState([])
  const [userList, setUserList] = useState([])
  const [suppliersList, setSuppliersList] = useState([])
  const [manufacturerList, setManufacturerList] = useState([])
  const [poLoading, setPoLoading] = useState(false)
  const [purchaseOrderData, setPurchaseOrderData] = useState(null)

  useEffect(() => {
    const fetchApis = async () => {
      setPoLoading(true)
      try {
        const client = await getApiClient()

        const getUserList = await client.get('user/assign/rfq')
        const getStatusList = await client.get('po/status/list')
        const getSuppliersList = await client.get('suppliers/list')
        const getManufacturerList = await client.get('manufacturer/list')

        setUserList(getUserList.data.data)
        setStatusList(getStatusList.data.data)
        setSuppliersList(getSuppliersList.data.data)
        setManufacturerList(getManufacturerList.data.data)
      } catch (e) {
        console.log(error, 'error')
        context.onApiError(e)
      } finally {
        setPoLoading(false)
      }
    }

    fetchApis()
  }, [])

  const fetchPurchaseOrder = async (uuid, { showLoading = false }) => {
    if (showLoading) {
      setPoLoading(true)
    }

    try {
      const poResponse = await readPoAPI(uuid)
      const poData = poResponse.data.data
      setPurchaseOrderData(poData)
    } catch (error) {
      console.log(error, 'error')
      context.onApiError(error)
    } finally {
      setPoLoading(false)
    }
  }

  const contextValue = {
    statusList,
    userList,
    suppliersList,
    manufacturerList,
    poLoading,
    fetchPurchaseOrder,
    purchaseOrderData,
  }
  return (
    <PoListContext.Provider value={contextValue}>
      {children}
    </PoListContext.Provider>
  )
}

export default PoListContextProvider
