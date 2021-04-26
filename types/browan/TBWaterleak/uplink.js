function consume(event) {
  var payload = event.data.payload_hex;
  var bits = Bits.hexToBits(payload);
  var data = {};
  var lifecycle = {};

  data.waterleak = !!Bits.bitsToUnsigned(bits.substr(7, 1));

  lifecycle.voltage = Bits.bitsToUnsigned(bits.substr(8, 4));
  lifecycle.voltage = (25 + lifecycle.voltage) / 10;
  lifecycle.voltage = Math.round(lifecycle.voltage * 10) / 10;

  lifecycle.batteryLevel = Bits.bitsToUnsigned(bits.substr(12, 4));
  lifecycle.batteryLevel = 100 * (lifecycle.batteryLevel / 15);
  lifecycle.batteryLevel = Math.round(lifecycle.batteryLevel);

  data.temperature = Bits.bitsToUnsigned(bits.substr(17, 7));
  data.temperature = data.temperature - 32;

  data.humidity = Bits.bitsToUnsigned(bits.substr(25, 7));

  emit('sample', { "data": lifecycle, "topic": "lifecycle" });
  emit('sample', { "data": data, "topic": "default" });
}