import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Appbar, Text } from 'react-native-paper'
import AccordionItem from 'components/accordionItem'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import rfqActions from 'services/redux/rfq/actions'

import NonBidItemList from './components/nonBidItemList'
import QuotedItemList from './components/quotedItemList'

const { setIsQuotedUpdated } = rfqActions
import { getRfqQuoteAPI, updateRfqStatusAPI } from 'services/helpers/apis/rfq'

const Quote = ({ selectedRfq }) => {
  const [quotedItems, setQuotedItems] = useState([])
  const [nonBidItems, setNonBidItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const quoteResponse = await getRfqQuoteAPI(selectedRfq.uuid)
      const {
        quoted_items: { rfq_items = [], custom_items = [] },
        non_bid_items,
      } = quoteResponse.data.data
      if (selectedRfq.permissions.can_view_quote) {
        //add custom property
        rfq_items.map((e) => {
          const item = e
          item.isCustomItem = false
          return item
        })

        custom_items.map((e) => {
          const item = e
          item.isCustomItem = true
          return item
        })

        setQuotedItems([...rfq_items, ...custom_items])
        setNonBidItems(non_bid_items)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchQuote()
  }, [])
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <AccordionItem
        style={styles.accordion}
        title={'Quoted Items'}
        showState={useState(true)}
      >
        <QuotedItemList list={quotedItems} selectedRfq={selectedRfq} />
      </AccordionItem>

      <AccordionItem
        style={styles.accordion}
        title={'Non-Bid Items'}
        showState={useState(true)}
      >
        <NonBidItemList list={nonBidItems} />
      </AccordionItem>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  button: {
    marginVertical: 7,
    marginTop: 12,
  },
  accordion: {
    marginBottom: 10,
  },
})

const mapStateToProps = (state) => ({
  quotedCorrespondence: state.rfq.quoted_correspondence,
  // selectedRfq: state.rfq.selected_rfq
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setIsQuotedUpdated }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Quote)
