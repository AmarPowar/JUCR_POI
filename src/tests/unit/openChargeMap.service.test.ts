import axios from "axios";
import POIModel from "../../db/models/poiModel";
import {
  callOpenChargeMapBaseAPI,
  fetchPOIData,
  processInBatches,
  savePOIsToDB,
} from "../../services/openChargeMap.service";
import { connectToDatabase } from "../../db/connection";
import { NextFunction } from "express";
import pLimit from "p-limit";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../db/models/poiModel");

describe("Data Import Service ", () => {
  const mockFilters = {
    countrycode: "US",
    compact: true,
    verbose: false,
    output: "json",
    opendata: true,
    distance: 50,
    page: 1,
    maxresults: 10,
  };

  const mockInputParam = {
    key: "mockKey",
    country: "DE",
    maxResults: 10,
  };

  let mockReq: any;
  let mockRes: Response;
  let mockNext: NextFunction;

  const mockPOIData = {
    data: [
      {
        ID: 1,
        Title: "POI 1",
        AddressInfo: {
          AddressLine1: "Address 1",
          City: "City 1",
          Country: "Country 1",
        },
        Location: { Latitude: 10, Longitude: 20 },
      },
      {
        ID: 2,
        Title: "POI 2",
        AddressInfo: {
          AddressLine1: "Address 2",
          City: "City 2",
          Country: "Country 2",
        },
        Location: { Latitude: 30, Longitude: 40 },
      },
    ],
  };

  beforeEach(() => {
    // Mock the functions
    let connectDBMock = connectToDatabase;
    connectDBMock = jest.fn().mockImplementation(() => ({}));

    // Mock Axios GET Call openChargeMapBaseURL
    mockedAxios.get.mockResolvedValue(mockPOIData);

    // Mock Insert Many

    const mockResult = [
      { _id: "123", ...mockPOIData.data[0] },
      { _id: "123", ...mockPOIData.data[1] },
    ];

    POIModel.insertMany = jest.fn().mockImplementation(() => mockResult);

    // Mocking the request,response and next objects
    mockReq = {
      body: {
        filters: {
          countrycode: "US",
          compact: true,
          verbose: false,
          output: "json",
          opendata: true,
          distance: 50,
          page: 1,
          maxresults: 10,
        },
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(), // Allow chaining status and send
      send: jest.fn(), // Mock send
      json: jest.fn().mockReturnThis(), // Mock json method
      sendStatus: jest.fn().mockReturnThis(), // Mock sendStatus method
    } as unknown as Response;
    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  describe("fetchPOIData", () => {
    it("should fetch POI data successfully", async () => {
      const data = await fetchPOIData(mockFilters);
      expect(data).toEqual(mockPOIData.data);
    });

    it("should return an empty array if no data is returned", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const data = await fetchPOIData(mockFilters);

      expect(data).toEqual([]);
    });

    it("should throw an error if API call fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

      await expect(fetchPOIData(mockFilters)).rejects.toThrow("API Error");
    });
  });

  describe("savePOIsToDB", () => {
    it("should save POIs to the database successfully", async () => {
      const result = await savePOIsToDB(mockPOIData.data);
      expect(result).toEqual([
        {
          _id: "123",
          ID: 1,
          Title: "POI 1",
          AddressInfo: {
            AddressLine1: "Address 1",
            City: "City 1",
            Country: "Country 1",
          },
          Location: {
            Latitude: 10,
            Longitude: 20,
          },
        },
        {
          _id: "123",
          ID: 2,
          Title: "POI 2",
          AddressInfo: {
            AddressLine1: "Address 2",
            City: "City 2",
            Country: "Country 2",
          },
          Location: {
            Latitude: 30,
            Longitude: 40,
          },
        },
      ]);
    });

    it("should log duplicate key errors if any", async () => {
      const error = new Error("Duplicate Key Error");
      POIModel.insertMany = jest.fn().mockImplementation(() => error);
      await savePOIsToDB(mockPOIData.data);
      expect(POIModel.insertMany).toHaveBeenCalled();
    });
  });

  describe("callOpenChargeMapBaseAPI", () => {
    it("should make a successful API call", async () => {
      const response = await callOpenChargeMapBaseAPI(mockInputParam);
      expect(response.data).toEqual(mockPOIData.data);
    });
    it("should throw an error on API failure", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

      await expect(callOpenChargeMapBaseAPI(mockInputParam)).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("processInBatches", () => {
    it("should process POIs in batches successfully", async () => {
      const limit = 1;
      const limitConcurrency = pLimit(limit);

      await processInBatches(mockPOIData.data, limit, limitConcurrency);

      expect(POIModel.insertMany).toHaveBeenCalledTimes(limit);
    });

    it.skip("should handle errors during batch processing", async () => {
      const limit = 2;
      const limitConcurrency = pLimit(limit);

      POIModel.insertMany = jest
        .fn()
        .mockImplementation(() => new Error("Batch Error"));

      // await expect(
      //   processInBatches(mockPOIData.data, limit, limitConcurrency)
      // ).resolves.not.toThrow();

      await expect(
        processInBatches(mockPOIData.data, limit, limitConcurrency)
      ).rejects.toThrow("Batch Error");
    });
  });
});
