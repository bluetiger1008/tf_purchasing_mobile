import React from 'react'
import NameVariantTable from '../../components/table'
import {
  getManufacturerNameVariantListAPI,
  getManufacturerServiceListAPI,
  deleteManufacturerNameVariantAPI,
  updateManufacturerAPI,
} from 'services/helpers/apis/manufacturerNameVariant'

const ManufacturerNameVariants = ({ navigation }) => {
  return (
    <NameVariantTable
      navigation={navigation}
      tableType='manufacturer'
      headerName='Manufacturer Name Variant'
      getListAPI={getManufacturerNameVariantListAPI}
      getServicesListAPI={getManufacturerServiceListAPI}
      deleteAPI={deleteManufacturerNameVariantAPI}
      updateAPI={updateManufacturerAPI}
    />
  )
}

export default ManufacturerNameVariants
