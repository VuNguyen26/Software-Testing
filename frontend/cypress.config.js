import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Base URL configuration
    baseUrl: "http://localhost:5173",
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Test files location
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    // Environment variables
    env: {
      apiUrl: "http://localhost:8080",
      loginEndpoint: "/api/auth/login",
      productsEndpoint: "/api/products"
    }
  },
  
  // Video and screenshot configuration
  video: true,
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  
  // Security and retry settings
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0
  }
});
