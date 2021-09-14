function consume(event) {
  const { eventType } = event.data.event;
  const sample = {};
  let topic = eventType;

  if (eventType === "humidity") {
    sample.temperature = event.data.event.data.humidity.temperature;
    sample.humidity = event.data.event.data.humidity.relativeHumidity;
  } else if (eventType === "touch") {
    sample.touch = true;
  } else if (eventType === "networkStatus") {
    sample.signalStrength = event.data.event.data.networkStatus.signalStrength;
    sample.rssi = event.data.event.data.networkStatus.rssi;
    sample.transmissionMode =
      event.data.event.data.networkStatus.transmissionMode;
    topic = "network_status";
  } else if (eventType === "batteryStatus") {
    sample.batteryLevel = event.data.event.data.batteryStatus.percentage;
    topic = "battery_status";
  }

  emit("sample", { data: sample, topic });
}
