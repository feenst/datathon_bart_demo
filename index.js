require('dotenv').config();
const wreck = require('@hapi/wreck');

const sleep = async (timeout) => await new Promise(resolve => setTimeout(resolve, timeout));

const getStationsDepartureEstimates = async () => {
  const url = `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&key=${process.env.BART_API_KEY}&json=y`;
  const options = {
    json: true,
  };

  const {payload} = await wreck.get(url, options);

  return payload.root.station;
};

const saveStationsDepartureEstimates = (stationsDepartureEstimates) => {
  for (const station of stationsDepartureEstimates) {
    for (const departures of station.etd) {
      for (const estimate of departures.estimate) {
        console.log(`${estimate.length} car train for ${departures.destination} will depart ${station.name} platform ${estimate.platform} in ${estimate.minutes} minutes`);
      }
    }
  }
};

const run = async () => {
  const pollingDelayInMilliseconds = 60000;

  while (true) {
    console.log(new Date());
    const stationsDepartureEstimates = await getStationsDepartureEstimates();
    saveStationsDepartureEstimates(stationsDepartureEstimates);

    await sleep(pollingDelayInMilliseconds);
  }
};

run();