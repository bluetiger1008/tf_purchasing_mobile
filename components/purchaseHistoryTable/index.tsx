import React, { Component } from 'react'
import { View } from 'react-native'
import { Title, DataTable, Subheading } from 'react-native-paper'

// import { formatFloat } from 'utils/common'

type PurchaseHistoryTableProps = {
  priceHistory: object
}

const PurchaseHistoryTable = ({ priceHistory }: PurchaseHistoryTableProps) => {
  let propertyNames: string[] = []
  if (priceHistory) {
    propertyNames = Object.getOwnPropertyNames(priceHistory)
  }

  return (
    <View>
      {propertyNames.length > 0 &&
        propertyNames.map((propertyName, i) => (
          <View key={i} style={{ marginBottom: 20 }}>
            <Subheading>{propertyName}</Subheading>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title numeric>Quantity</DataTable.Title>
                <DataTable.Title numeric>Supplier</DataTable.Title>
                <DataTable.Title numeric>Unit Cost</DataTable.Title>
              </DataTable.Header>

              {priceHistory[propertyName].map((row, i) => (
                <DataTable.Row key={i}>
                  <DataTable.Cell>
                    {row.date_bought.formatted_date}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{row.order_qty}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.company_name}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.unit_cost}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        ))}
    </View>
  )
}

export default PurchaseHistoryTable
