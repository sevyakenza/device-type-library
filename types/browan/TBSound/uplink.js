function consume(event) {
  const payload = event.data.payloadHex;
  const bits = Bits.hexToBits(payload);
  const data = {};
  const lifecycle = {};
  const topic = "default";

  data.open = !!Bits.bitsToUnsigned(bits.substr(0, 8));

  lifecycle.voltage = Bits.bitsToUnsigned(bits.substr(8, 4));
  lifecycle.voltage = (25 + lifecycle.voltage) / 10;
  lifecycle.voltage = Math.round(lifecycle.voltage * 10) / 10;

  lifecycle.batteryLevel = Bits.bitsToUnsigned(bits.substr(12, 4));
  lifecycle.batteryLevel = 100 * (lifecycle.batteryLevel / 15);
  lifecycle.batteryLevel = Math.round(lifecycle.batteryLevel);

  data.temperature = Bits.bitsToUnsigned(bits.substr(17, 7));
  data.temperature -= 32;

  data.soundAvg = Bits.bitsToUnsigned(bits.substr(24, 8));

  emit("sample", { data: lifecycle, topic: "lifecycle" });
  emit("sample", { data, topic });
}
