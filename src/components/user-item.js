import React, { useState } from "react"

import {
  Icon,
  List,
  ListItem,
  Button,
  Text,
} from "@ui-kitten/components"


export default (data) => {


  const renderItemIcon = (item) => {
    let icon = { name: 'person-outline', fill: 'green' }
    if(item.type === 'organization') icon = { name: 'globe-2-outline', fill: 'blue' }
    if(item.type === 'community') icon = { name: 'people-outline', fill: 'orange' }
    
    return(<Icon name={icon.name} fill={icon.fill}/>)
  }

  const renderItem = ({ item, index }) => { 
    let Item = JSON.parse(JSON.stringify(item[Object.keys(item)]))
    //console.log(Object.values(item)[0].name)
    let d = new Date(Item.createdAt*1000)
    return (<ListItem
      title={`${Item.VID}`}
      description={`${Item.name || 'N/A' } ${Item.type && Item.type != 'inidividual' ? `(${Item.type})`: ''}`}
      icon={() => renderItemIcon (Item)}
      accessory={() => <Text appearance='hint' category='label'>{d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>}/>)
  }
  return (
    <List
      data={data}
      renderItem={renderItem}
    />
  )
}

