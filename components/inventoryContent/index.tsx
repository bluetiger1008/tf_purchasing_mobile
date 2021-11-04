import React, { Component } from 'react'
import Rating from '@material-ui/lab/Rating'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import { toast } from 'react-toastify'

import adminActions from 'services/redux/admin/actions'
import InventoryTable from 'components/inventoryTable'
import {
  getRfqDraftAPI,
  createRfqAPI,
  createRfqLineAPI,
  getRfqMessageTemplateAPI,
} from 'services/helpers/apis/rfq'

import SendRfqModal from '../rfq/sendRfqModal'

const { onApiError } = adminActions

class Inventory extends Component {
  state = {
    anchorEl: null,
    rfqs: [],
    linesData: [],
    openRfqModal: false,
    messageTemplate: null,
    createdRfqLineUuid: null,
    createdRfqId: null,
  }

  async componentDidMount() {
    const { requisition, inventory, onApiError } = this.props

    if (requisition.permissions.create_rfq) {
      try {
        const res = await getRfqDraftAPI(inventory.supplier.id)

        this.setState({
          rfqs: res.data.data.rfq,
        })
      } catch (err) {
        onApiError(err)
      }
    }
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  onSelectLine = (linesData) => {
    const data = _filter(linesData, 'selected')

    this.setState({
      linesData: data,
    })
  }

  onAddRfq = () => {
    this.createRfq()
  }

  onSelectRfq = (rfq) => {
    this.setState({
      createdRfqId: rfq.id,
    })
    this.createRfqLine(rfq.id)
  }

  onCloseAddRfqModal = () => {
    this.setState({
      openRfqModal: false,
    })
  }

  createRfqLine = async (rfqId) => {
    const { requisition } = this.props
    const { linesData } = this.state

    linesData.map(async (line) => {
      try {
        let requestBody = {
          quantity: line.quantity_required,
          part_number: line.part_number,
          rfq_id: rfqId,
          requisition_uuid: requisition.requisition.uuid,
        }

        if (!_isEmpty(line.manufacturer)) {
          requestBody = {
            ...requestBody,
            manufacturer_id: line.manufacturer.id,
          }
        }

        const createRfqLine = await createRfqLineAPI(requestBody)

        const getRfqMessageTemplate = await getRfqMessageTemplateAPI(rfqId)

        this.setState({
          openRfqModal: true,
          createdRfqId: rfqId,
          messageTemplate: getRfqMessageTemplate.data.data,
          createdRfqLineUuid: createRfqLine.data.data.uuid,
        })
      } catch (e) {
        this.props.onApiError(e)
      }
    })
  }

  createRfq = async () => {
    const { inventory } = this.props

    try {
      const res = await createRfqAPI(inventory.supplier.id)
      const rfqId = res.data.data.rfq_id

      this.setState({
        createdRfqId: rfqId,
      })
      this.createRfqLine(rfqId)
    } catch (e) {
      this.props.onApiError(e)
    }
  }

  saveRfq = () => {
    const { createdRfqId } = this.state

    this.setState({
      openRfqModal: false,
    })
    toast.success(`RFQ ${createdRfqId} Created`)
  }

  render() {
    const {
      anchorEl,
      rfqs,
      linesData,
      openRfqModal,
      messageTemplate,
      createdRfqId,
      createdRfqLineUuid,
    } = this.state
    const { inventory, requisition } = this.props
    const createRfq = requisition.permissions.create_rfq
    let total = 0
    inventory.lines.map((line) => {
      total += line.quantity_available

      return total
    })

    return (
      <div className='inventory'>
        <div className='inventory-header'>
          <h2>{inventory.supplier.name}</h2>
          {inventory.supplier.rating && (
            <Rating
              name='simple-controlled'
              value={inventory.supplier.rating}
              readOnly
            />
          )}
          {inventory.supplier.banner && (
            <p
              style={{
                backgroundColor: inventory.supplier.banner.color,
                color: inventory.supplier.banner['text-color'],
                padding: '5px 10px',
                borderRadius: '5px',
                marginLeft: '10px',
              }}
            >
              {inventory.supplier.banner.text}
            </p>
          )}
        </div>
        <InventoryTable
          data={inventory.lines}
          onSelectLine={this.onSelectLine}
        />
        <div className='inventory-bottom'>
          <p>Total: {total}</p>
          {createRfq && (
            <div>
              {rfqs.length > 0 ? (
                <div>
                  <Button
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={this.handleClick}
                    variant='contained'
                    className='btn-rfq'
                    color='primary'
                    disabled={linesData.length === 0}
                  >
                    Add to RFQ &gt
                  </Button>
                  <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.onAddRfq}>New Rfq</MenuItem>
                    {rfqs.map((rfq, i) => (
                      <MenuItem onClick={() => this.onSelectRfq(rfq)} key={i}>
                        RFQ {rfq.id}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              ) : (
                <Button
                  variant='contained'
                  className='btn-rfq'
                  onClick={this.onAddRfq}
                  color='primary'
                  disabled={linesData.length === 0}
                >
                  Add to RFQ &gt
                </Button>
              )}
            </div>
          )}
        </div>
        <SendRfqModal
          open={openRfqModal}
          close={this.onCloseAddRfqModal}
          messageTemplate={messageTemplate}
          saveRfq={this.saveRfq}
          rfqId={createdRfqId}
          rfqLineUuid={createdRfqLineUuid}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  requisition: state.requisition.selectedRequisition,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ onApiError }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
