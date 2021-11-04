import React, { } from "react"
import { View, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { TextPair } from "components"


const NonBidItemList = ({ list }) => {

    const renderItem = (item, key) => {
        const { quantity, item: partNumberItem, requisition_detail } = item
        return (
            <Card key={key}>
                <Card.Content>
                    <Text style={{ fontSize: 12, color: "gray" }}>Requisition number </Text>
                    <Text style={{ fontSize: 18, fontWeight: "bold", textDecorationLine: "underline" }}>
                        {requisition_detail ? requisition_detail.order_id : ""}
                    </Text>

                    <View style={styles.row}>
                        <TextPair
                            style={{ width: '50%' }}
                            text={'Quantity'}
                            value={
                                quantity || '-- --'
                            }
                        />
                        <TextPair
                            style={{ width: '50%' }}
                            text={'Part Number'}
                            value={
                                partNumberItem || '-- --'
                            }
                        />
                    </View>


                </Card.Content>
            </Card>
        )
    }
    return (
        <View>
            {
                list.map((item, index) => {
                    return renderItem(item, index)
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        marginTop: 10
    }
})

export default NonBidItemList