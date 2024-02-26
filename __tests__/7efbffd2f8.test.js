// ********RoostGPT********
/*
Test generated by RoostGPT for test NodeMochaTest using AI Type Open AI and AI Model gpt-4-1106-preview


ROOST_TEST_HASH=63c801a396

*/

// ********RoostGPT********
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../index"); // Assuming User model is exported from index.js
const supertest = require("supertest");

jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({}),
  Types: { ObjectId: jest.fn() }
}));

describe('POST /login', () => {
  let server;
  let request;
  let user;

  beforeAll(() => {
    // Mock User model methods
    User.findOne = jest.fn();
    bcrypt.compare = jest.fn();

    // Set up express app
    const app = express();
    app.use(express.json());
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      user = await User.findOne({ email });
      if (!user) return res.redirect("/register");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.render("login", { email, message: "Incorrect Password" });
      const token = jwt.sign({ _id: user._id }, "secretkey");
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    });

    // Start express server
    server = app.listen(3000);

    // Use supertest to mock HTTP requests
    request = supertest(app);
  });

  afterAll(async () => {
    // Close the server after tests
    await server.close();
  });

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create user mock
    user = {
      _id: mongoose.Types.ObjectId(),
      email: "test@example.com",
      password: await bcrypt.hash("correctpassword", 10)
    };
  });

  test('It correctly logs the user in with valid credentials', async () => {
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);

    const response = await request.post("/login").send({
      email: user.email,
      password: "correctpassword"
    });

    expect(response.headers.location).toBe('/');
    expect(response.status).toBe(302); // Redirect status code
    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcrypt.compare).toHaveBeenCalledWith("correctpassword", user.password);
  });

  test('It fails to log in with an invalid email', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request.post("/login").send({
      email: "wrong@example.com",
      password: "correctpassword"
    });

    expect(response.headers.location).toBe('/register');
    expect(response.status).toBe(302); // Redirect status code
  });

  test('It fails to log in with an incorrect password', async () => {
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request.post("/login").send({
      email: user.email,
      password: "wrongpassword"
    });

    expect(response.status).toBe(200); // Render status code
    expect(response.text).toMatch(/Incorrect Password/);
    expect(User.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", user.password);
  });

  // Add more test cases for edge cases and error handling as needed
});

