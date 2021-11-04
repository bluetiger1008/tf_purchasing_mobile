import React from 'react'
import NameVariantTable from '../../components/table'
import {
  getSupplierNameVariantListAPI,
  getSupplierNameVariantServicesAPI,
  deleteSupplierNameVariantAPI,
  updateSupplierVariantAPI,
} from 'services/helpers/apis/supplierNameVariants'

const SupplierNameVariantList = ({ navigation }) => {
  return (
    <NameVariantTable
      navigation={navigation}
      tableType='supplier'
      headerName='Supplier Name Variant'
      getListAPI={getSupplierNameVariantListAPI}
      getServicesListAPI={getSupplierNameVariantServicesAPI}
      deleteAPI={deleteSupplierNameVariantAPI}
      updateAPI={updateSupplierVariantAPI}
    />
  )
}

export default SupplierNameVariantList
