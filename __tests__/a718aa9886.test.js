// ********RoostGPT********
/*
Test generated by RoostGPT for test NodeMochaTest using AI Type Open AI and AI Model gpt-4-1106-preview


ROOST_TEST_HASH=9ac90d269a

*/

// ********RoostGPT********
const express = require("express");
const { join, dirname } = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { fileURLToPath } = require('url');

// Helper function to get the directory of the current module file.
// Necessary due to the lack of __dirname in ES modules.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Import the app from the index file 
const app = require('../index'); // Adjust the relative path depending on the actual location

describe('server', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(5000, () => {
      console.log("Server is working");
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should start server without error', (done) => {
    const testServer = app.listen(0, () => {
      const port = testServer.address().port;
      expect(port).toBeDefined();
      expect(port).toBeGreaterThan(0);
      testServer.close(done);
    });
  });

  test('should handle error when starting server on occupied port', (done) => {
    // Assuming the server is already started on port 5000, we try to start another one
    const testServer = app.listen(5000);
    testServer.on('error', (err) => {
      expect(err).toBeDefined();
      testServer.close(done);
    });
  });
});

