import React, { useState } from "react"

import {
  Icon,
  List,
  ListItem,
  Button,
} from "@ui-kitten/components"


export default (data) => {

  const renderItemAccessory = (style) => (
    <Button style={style} size="tiny">CHECK</Button>
  );

  const renderItemIcon = (item) => { console.log(item.type)
    return(<Icon  name='pin-outline' fill='orange'/>)
  }

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      icon={ () => renderItemIcon (item)}
      accessory={renderItemAccessory}
    />
  )
  return (
    <List
      data={data}
      renderItem={renderItem}
    />
  )
}

