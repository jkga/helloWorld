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

  const renderItemIcon = (style) => (
    <Icon {...style} name='person' fill='green'/>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description}   [January 01, 2018]`}
      icon={renderItemIcon}
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

