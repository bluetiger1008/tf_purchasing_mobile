import React, { useState, useContext, useMemo } from 'react'
import { CorrespondenceContext } from './index'
import { GlobalContext } from '../../../Main'
import { updateRfqCorrespondenceAPI } from 'services/helpers/apis/rfq'
import { updatePoCorrespondenceAPI } from 'services/helpers/apis/po'
import {
  sendThreadDraftAPI,
  updateThreadDraftAPI,
  deleteThreadDraftAPI,
} from 'services/helpers/apis/thread'

import { createThreadDraftAPI } from 'services/helpers/apis/thread'

const CorrespondenceContextProvider = ({
  children,
  initialValues,
  navigation,
}) => {
  const { subject, correspondenceFor } = initialValues

  const [messages, setMessages] = useState(initialValues.messages)
  const context = useContext(GlobalContext)

  const onReply = async (replyType) => {
    try {
      const createdThreadResponse = await createThreadDraft(replyType)

      navigation.navigate('MessageEditable', {
        message: createdThreadResponse.data.data,
      })

      onUpdateThreadDraft({
        uuid: createdThreadResponse.data.data.uuid,
        replyValue: 'internal',
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
    }
  }

  const onUpdateThreadDraft = async ({
    uuid,
    replyValue = 'internal',
    textMessage = '',
    isQuoted = false,
  }) => {
    try {
      const res = await updateThreadDraftAPI(uuid, {
        is_internal: replyValue === 'internal',
        body: textMessage,
        is_quote_attached: isQuoted,
      })

      setMessages([...res.data.data.messages])
    } catch (e) {
      context.onApiError(e)
    }
  }

  const createThreadDraft = (replyType) => {
    const isInternal =
      replyType === 'internal_note' ? true : messages[0].is_internal
    const replyTo = messages[0].uuid
    const toEmail = messages[0].to_email
    const authorId = messages[0].author_id
    return createThreadDraftAPI(
      isInternal,
      subject,
      replyTo,
      '',
      toEmail,
      authorId
    )
  }

  const onDeleteDraft = async (uuid) => {
    try {
      const res = await deleteThreadDraftAPI(uuid)
      context.onApiSuccess('Draft message is deleted')

      setMessages([...res.data.data.messages])
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onSendReply = async ({
    uuid,
    replyValue = 'internal',
    textMessage = '',
    isQuoted = false,
  }) => {
    setTimeout(async () => {
      try {
        await updateThreadDraftAPI(uuid, {
          is_internal: replyValue === 'internal',
          body: textMessage,
          is_quote_attached: isQuoted,
        })
        const res = await sendThreadDraftAPI(uuid)

        context.onApiSuccess('Reply message is sent.')

        setMessages([...res.data.data.messages])
      } catch (e) {
        context.onApiError(e)
      }
    }, 1000)
  }

  const saveDraftMessage = async (uuid, messageObject) => {
    try {
      correspondenceFor === 'rfq'
        ? await updateRfqCorrespondenceAPI(uuid, messageObject)
        : await updatePoCorrespondenceAPI(uuid, messageObject)
      context.onApiSuccess('Saved correspondence as draft', 2000)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onUpdateCorrespondence = async (uuid, updatedMessage) => {
    try {
      if (correspondenceFor === 'rfq') {
        await updateRfqCorrespondenceAPI(uuid, updatedMessage)
      } else {
        await updatePoCorrespondenceAPI(uuid, updatedMessage)
      }
      context.onApiSuccess('Correspondence added')
    } catch (e) {
      context.onApiError(e)
    }
  }

  const state = () => {
    return {
      ...initialValues,
      messages,
      onReply,
      onUpdateThreadDraft,
      onDeleteDraft,
      onSendReply,
      saveDraftMessage,
      onUpdateCorrespondence,
    }
  }

  const contextValue = useMemo(state, [messages])

  return (
    <CorrespondenceContext.Provider value={contextValue}>
      {children}
    </CorrespondenceContext.Provider>
  )
}

export default CorrespondenceContextProvider
