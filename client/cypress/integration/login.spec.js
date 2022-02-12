/// <reference types="cypress" />
describe("user login", () => {
  // Difference from back-dev for cypress test
  // in Page/Login.js
  // added html elements id #nameInpt, #pwsInpt, #loginBtn
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  it("Enter wrong name and password to login, login failed", () => {
    // enter name and wrong password
    cy.get("#nameInpt").type("LeoLee");
    cy.get("#pwsInpt").type("LeoLee123?");
    cy.get("#loginBtn").click();
    cy.contains("No").should("exist");
  });
  it("Enter name and password to login", () => {
    // enter correct password
    cy.get("#nameInpt").type("LeoLee");
    cy.get("#pwsInpt").type("LeoLee123!");
    // login
    cy.get("#loginBtn").click();
    cy.contains("My Groups").should("exist");
  });
});
