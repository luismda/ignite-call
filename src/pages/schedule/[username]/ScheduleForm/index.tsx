import { useState } from 'react'
import { Text, Toast } from '@ig-ui/react'
import dayjs from 'dayjs'

import { CalendarStep } from './CalendarStep'
import { ConfirmStep } from './ConfirmStep'

interface SchedulingSuccess {
  title: string
  description: string
}

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [schedulingSuccess, setSchedulingSuccess] =
    useState<SchedulingSuccess | null>(null)

  function clearSelectedDateTime() {
    setSelectedDateTime(null)
  }

  function handleCancelScheduling() {
    clearSelectedDateTime()
    setSchedulingSuccess(null)
  }

  function handleSuccessConfirmScheduling() {
    clearSelectedDateTime()

    const schedulingDate = dayjs(selectedDateTime)
    const schedulingDateDescription = schedulingDate.format(
      'dddd[, ]DD[ de ]MMMM[ às ]HH:mm[h]',
    )

    setSchedulingSuccess({
      title: 'Agendamento realizado',
      description: schedulingDateDescription,
    })
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleCancelScheduling}
        onSuccessConfirmation={handleSuccessConfirmScheduling}
      />
    )
  }

  return (
    <>
      <CalendarStep onSelectDateTime={setSelectedDateTime} />

      {schedulingSuccess && (
        <Toast
          title={schedulingSuccess.title}
          description={<Text>{schedulingSuccess.description}</Text>}
          duration={6000}
        />
      )}
    </>
  )
}
