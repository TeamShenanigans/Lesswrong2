import React, { useEffect, useState } from 'react'
import _uniqBy from 'lodash/uniqBy';
import { getCalendarEvents } from './gardenCalendar';
import { registerComponent, Components } from '../../lib/vulcan-lib';


const WalledGardenEvents = ({frontpage=true}) => {
  const { FrontpageGcalEventItem, PortalBarGcalEventItem } = Components

  const [ events, setEvents ] = useState<any>([])
  useEffect(() => {
    const eventsCallback = (events) => {
      setEvents(_uniqBy(events, 'summary'))
    }

    if (Meteor.isClient) {
      void getCalendarEvents(eventsCallback)
    }
  }, [])


  const limit = frontpage ? 2 : 8
  if (!(events.length > 0)) return null

  return <div>
    { events.slice(0,limit).map((event,i)=> frontpage ?
      <FrontpageGcalEventItem key={`event-${i}`} gcalEvent={event}/>
      : <PortalBarGcalEventItem key={`event-${i}`} gcalEvent={event}/>
    )}
  </div>
}


const WalledGardenEventsComponent = registerComponent('WalledGardenEvents', WalledGardenEvents);

declare global {
  interface ComponentTypes {
    WalledGardenEvents: typeof WalledGardenEventsComponent
  }
}
