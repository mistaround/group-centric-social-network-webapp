/// <reference types="cypress" />
describe("Registration", () => {
  // Difference from back-dev for cypress test
  // in Page/Register.js
  // added html elements id #newnameInpt, #newEmailInpt, #newPwdInpt #registerBtn, #confirmPwdInpt
  const name0 = Math.floor(Math.random() * 10000);
  const name1 = "testname";
  const email0 = "@gmail.com";
  const name = name1 + name0.toString();
  const email = name + email0;
  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
  });
  it("Enter name, password, occupied email to register", () => {
    cy.get("#newNameInpt").type(name);
    cy.get("#newEmailInpt").type("m730026053@uic.edu.cn");
    cy.get("#newPwdInpt").type("Testpwd123!");
    cy.get("#confirmPwdInpt").type("Testpwd123!");
    cy.get("#registerBtn").click();
    cy.contains("Already").should("exist");
  });
  it("Enter a new valid email to register", () => {
    cy.get("#newNameInpt").type(name);
    cy.get("#newEmailInpt").type(email);
    cy.get("#newPwdInpt").type("Testpwd123!");
    cy.get("#confirmPwdInpt").type("Testpwd123!");
    cy.get("#registerBtn").click();
    cy.contains("No").should("exist");
  });
});
