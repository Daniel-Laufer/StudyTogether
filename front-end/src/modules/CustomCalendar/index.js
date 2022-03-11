import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import React from 'react';
import moment from 'moment';

const localizer = momentLocalizer(moment);

function CustomCalendar() {
  const allViews = Object.keys(Views).map(k => Views[k]);
  return (
    <div>
      <Calendar
        localizer={localizer}
        step={60}
        timeslots={8}
        views={allViews}
        showMultiDayTimes
        defaultDate={new Date()}
      />
    </div>
  );
}

export default CustomCalendar;
