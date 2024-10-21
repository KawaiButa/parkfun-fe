describe("login", () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.visit(Cypress.env("NEXT_PUBLIC_BASE_URL") + "/auth/login");
  });
  it("empty password", () => {
    cy.get("input[type=email]").type("test@gmail.com");
    cy.get("button[type=submit]").click();
    cy.get("p.MuiFormHelperText-root.Mui-error").should("contain", "Please enter your password");
  });
  it("empty email", () => {
    cy.get("input[type=password]").type("1234567890");
    cy.get("button[type=submit]").click();
    cy.get("p.MuiFormHelperText-root.Mui-error").should("contain", "Please enter your email");
  });
  it("successfully login", () => {
    cy.get("input[type=email]").type("test@gmail.com");
    cy.get("input[type=password]").type("1234567890");
    cy.get("form")
      .submit()
      .then(() => {
        cy.url().should("contain", "/home");
      });
  });
});