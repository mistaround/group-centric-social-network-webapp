/// <reference types="cypress" />
describe("user post", () => {
  // Difference from back-dev for cypress test
  // in Page/Login.js
  // added html elements id #nameInpt, #pwsInpt, #loginBtn
  it("Enter name and password to login", () => {
    cy.visit("http://localhost:3000/login");
    // enter correct password
    cy.get("#nameInpt").type("LeoLee");
    cy.get("#pwsInpt").type("LeoLee123!");
    // login
    cy.get("#loginBtn").click();
    cy.contains("My Groups").should("exist");
    cy.get("#postBtn").click();
    cy.contains("Create").should("exist");
    cy.get("#selectBtn").click();
    cy.contains("CIS557 Discussion").click();
    cy.get("#titleInpt").type("This is a cypress test title");
    cy.get("#createBtn").click();
    cy.contains("My Groups").should("exist");
  });
});