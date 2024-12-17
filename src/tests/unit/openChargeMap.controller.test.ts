import { importPOIData } from "../../controllers/import.controller"; // Path to the function
import { Response, NextFunction } from "express";
import pLimit from "p-limit";
import axios from "axios";
import { connectToDatabase } from "../../db/connection";
import {
  fetchPOIData,
  processInBatches,
} from "../../services/openChargeMap.service";
import { IFilters } from "../../utils/import.interface";
import POIModel from "../../db/models/poiModel";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../db/models/poiModel");

describe("importPOIData Controller", () => {
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

  it.skip("should successfully import POI data (positive test case)", async () => {
    await importPOIData(mockReq, mockRes, mockNext);

    // Check if the database connection was called
    expect(connectToDatabase).toHaveBeenCalledTimes(1);

    // Check if fetchPOIData was called
    expect(fetchPOIData).toHaveBeenCalledWith(mockReq.body.filters);

    // Check if processInBatches was called
    expect(processInBatches).toHaveBeenCalledWith(mockPOIData, 10);

    // Check if response was sent with success status
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({
      message: "POI data import process completed successfully",
      importPoisStatus: {
        batchSize: 10,
        page: 2,
      },
    });
  });
});
