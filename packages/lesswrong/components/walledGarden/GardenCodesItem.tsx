import React, { useState } from 'react';
import { registerComponent, Components } from '../../lib/vulcan-lib';
import CreateIcon from '@material-ui/icons/Create';
import { eventRoot, eventName, eventTime, eventFormat } from "./PortalBarGcalEventItem";

const styles = theme => ({
  root: {
    ...eventRoot(theme),
    '&:hover $icon': {
      opacity: 1
    },
  },
  eventName: {
    ...eventName(theme)
  },
  eventTime: {
    ...eventTime(theme)
  },
  icon: {
    color: theme.palette.grey[700],
    height: 16,
    width: 16,
    cursor: "pointer",
    opacity: .35,
    marginLeft: 8,
    position: "relative",
    top: 1,
    '&:hover': {
      opacity: 1
    }
  }
})

export const GardenCodesItem = ({classes, gardenCode}:{
  classes:ClassesType,
  gardenCode: GardenCodeFragment
}) => {
  const { GardenCodesEditForm } = Components
  const [editing, setEditing] = useState(false)
  if (editing) {
    return <GardenCodesEditForm gardenCodeId={gardenCode._id} cancelCallback={()=> setEditing(false)}   />
  }
  return <div className={classes.root}>
      <span className={classes.eventName}>{gardenCode.title}</span>
      <div className={classes.eventTime}>
        {eventFormat(gardenCode.startTime)}
      </div>
      <CreateIcon className={classes.icon} onClick={() => setEditing(true)}/>
    </div>
}

const GardenCodesItemComponent = registerComponent('GardenCodesItem', GardenCodesItem, {styles});

declare global {
  interface ComponentTypes {
    GardenCodesItem: typeof GardenCodesItemComponent
  }
}
