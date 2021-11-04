import React, { useState, useEffect } from 'react'
import { RfqListContext } from './index'
import { getApiClient } from 'services/helpers/apiConfig'

const RfqListContextProvider = ({ children }) => {
  const [statusList, setStatusList] = useState([])
  const [userList, setUserList] = useState([])
  const [suppliersList, setSuppliersList] = useState([])
  const [manufacturerList, setManufacturerList] = useState([])
  const [rpqLoading, setRpqLoading] = useState(false)

  useEffect(() => {
    const fetchApis = async () => {
      setRpqLoading(true)
      try {
        const client = await getApiClient()

        const getUserList = await client.get('user/assign/rfq')
        const getStatusList = await client.get('rfq/status/list')
        const getSuppliersList = await client.get('suppliers/list')
        const getManufacturerList = await client.get('manufacturer/list')

        setUserList(getUserList.data.data)
        setStatusList(getStatusList.data.data)
        setSuppliersList(getSuppliersList.data.data)
        setManufacturerList(getManufacturerList.data.data)
      } catch (e) {
        context.onApiError(e)
      } finally {
        setRpqLoading(false)
      }
    }

    fetchApis()
  }, [])

  const contextValue = {
    statusList,
    userList,
    suppliersList,
    manufacturerList,
    rpqLoading,
  }
  return (
    <RfqListContext.Provider value={contextValue}>
      {children}
    </RfqListContext.Provider>
  )
}

export default RfqListContextProvider
