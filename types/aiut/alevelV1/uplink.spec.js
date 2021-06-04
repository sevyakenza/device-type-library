const chai = require("chai");
const { validate } = require("jsonschema");
const rewire = require("rewire");
const utils = require("test-utils");

const { assert } = chai;

describe("Alevel V1 Uplink", () => {
  let defaultSchema = null;
  let consume = null;
  before((done) => {
    const script = rewire("./uplink.js");
    consume = utils.init(script);
    utils
      .loadSchema(`${__dirname}/default.schema.json`)
      .then((parsedSchema) => {
        defaultSchema = parsedSchema;
        done();
      });
  });

  let lifecycleSchema = null;
  before((done) => {
    utils
      .loadSchema(`${__dirname}/lifecycle.schema.json`)
      .then((parsedSchema) => {
        lifecycleSchema = parsedSchema;
        done();
      });
  });

  describe("consume()", () => {
    it("should decode the Alevel V1 payload", () => {
      const data = {
        data: {
          port: 3,
          payload_hex: "0746D8001700",
        },
      };

      utils.expectEmits((type, value) => {
        assert.equal(type, "sample");
        assert.isNotNull(value);
        assert.typeOf(value.data, "object");

        assert.equal(value.topic, "lifecycle");
        assert.equal(value.data.batteryVoltage, 3.66);
        assert.equal(value.data.batteryLevel, 0);
        assert.equal(value.data.deviceStatusFlag, 0);

        validate(value.data, lifecycleSchema, { throwError: true });
      });

      utils.expectEmits((type, value) => {
        assert.equal(type, "sample");
        assert.isNotNull(value);
        assert.typeOf(value.data, "object");

        assert.equal(value.topic, "default");
        assert.equal(value.data.currentLevel, 2.9);
        assert.equal(value.data.emptingFlag, false);
        assert.equal(value.data.tankingFlag, false);
        assert.equal(value.data.measurementError, false);
        assert.equal(value.data.outOfRangeError, true);
        assert.equal(value.data.sequenceNumber, 2);
        assert.equal(value.data.temperature, 23);
        validate(value.data, defaultSchema, { throwError: true });
      });

      consume(data);
    });
  });
});
