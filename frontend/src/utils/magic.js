import data from './data.json';
export const magic = (activeMiningType, ActiveInstrumentType, startDate, endDate) => {
    const requiredReadings = data?.filter(d => d.miningCode === activeMiningType && d.instrumentCode === ActiveInstrumentType)[0]
    console.log(requiredReadings)
    const requiredInstrumentReadings = requiredReadings?.readings
    console.log(requiredInstrumentReadings)
    if (!requiredInstrumentReadings || requiredInstrumentReadings?.length == 0) {
        //console.log("inside 1 null")
        return null;
    }
    const dataInRange = requiredInstrumentReadings?.filter(d => {
        const date = new Date(d.date)
        const startDateInDate = new Date(startDate)
        const endDateInDate = new Date(endDate)
        if (date >= startDateInDate && date <= endDateInDate) {
            return d;
        }
    })
    if (!dataInRange || dataInRange?.length == 0) {
        // console.log("inside 2 null")
        return null;
    }
    console.log(dataInRange)

    const requiredFormattedData = [];
    const USL = requiredReadings.upperSafeLimit;
    const LSL = requiredReadings.lowerSafeLimit;
    //required format
    /*[
{date:
 value:
 usl:
 lsl:

},
{date:
 value:
 usl:
 lsl:
}


    ]*/

    //given format
    /*   [
           {
             "date": "2017-01-01",
             "readings": [
               {"time": "08:00", "value": 10},
               {"time": "12:00", "value": 12},
               {"time": "16:00", "value": 11}
             ]
           },
           {
             "date": "2017-01-02",
             "readings": [
               {"time": "09:00", "value": 11},
               {"time": "13:00", "value": 13},
               {"time": "17:00", "value": 14},
               {"time": "21:00", "value": 15}
             ]
           }
         ]  */
    if(activeMiningType==="INC"){
      dataInRange?.map(d => {
        d.readings.map(r => {
            requiredFormattedData.push({
              date:`${d.date}${" "}${r.time}`,
              x_tilt:r.value.x_tilt,
              y_tilt:r.value.y_tilt,
              USL:USL,
              LSL:LSL,
              range:[LSL,USL]
            })
        })
    })
    }
    else{
    dataInRange?.map(d => {
        d.readings.map(r => {
            requiredFormattedData.push({
              date:`${d.date}${" "}${r.time}`,
              value:r.value,
              USL:USL,
              LSL:LSL,
              range:[LSL,USL]
            })
        })
    })
  }
    // console.log(requiredFormattedData)
    return requiredFormattedData;
}
/*
depth:
x_tilt:
y_tilt:
date:
*/