import React from 'react'
import {
  Text, CardItem, Card,
} from 'native-base'
import ToDo from '../../models/ToDo'

interface Props {
  toDo: ToDo
}

const ToDoCard = ({ toDo }: Props) => {
  const a = 1

  return (
    <Card>
      <CardItem>
        <Text>
          {toDo.text}
        </Text>
      </CardItem>
    </Card>
  )
}

export default ToDoCard
