import { Button, TextInput } from '@ig-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Form } from './style'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput variant="sm" prefix="call.com/" placeholder="seu-usuario" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
