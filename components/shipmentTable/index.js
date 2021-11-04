import React, { Component } from 'react'
import { View } from 'react-native'
import { DataTable, Subheading } from 'react-native-paper'

const PurchaseHistoryTable = ({ shipments }) => {
  let propertyNames = Object.getOwnPropertyNames(shipments)

  return (
    <View>
      {propertyNames.length > 0 &&
        propertyNames.map((propertyName, i) => (
          <View key={i} style={{ marginBottom: 20 }}>
            <Subheading>{propertyName}</Subheading>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Quantity</DataTable.Title>
                <DataTable.Title numeric>Item</DataTable.Title>
              </DataTable.Header>

              {shipments[propertyName].map((row, i) => (
                <DataTable.Row key={i}>
                  <DataTable.Cell numeric>{row.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>{row.requisition}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        ))}
    </View>
  )
}

export default PurchaseHistoryTable
