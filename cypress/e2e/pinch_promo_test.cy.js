/* eslint-disable no-undef */
//README: Before starting the test, remember to delete the current user account
describe("Before Logging in Test", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
    cy.get("#signUpNavButton");
    cy.get("#loginNavButton");
  });

  it("Front Page and Footer Information", function () {
    cy.contains("PinchPromo");
    cy.contains("Gomgom");
    cy.contains("Promotions Available");
    cy.contains("Contact Us");
    cy.contains("Telegram: @alestierK");
  });

  it('"How to?" drop down', function () {
    cy.get("#dropDownInfo").click();
    cy.contains(
      "New exclusive promos are released daily for you to maximise your dollar."
    );
    cy.get("#signUpLink");
    cy.get("#moreInfo").click();
    cy.contains("Steps To Use");
    cy.get("iframe#howToVideo");
    cy.get("iframe#howToVideo")
      .should("have.attr", "src")
      .and("include", "https://www.youtube.com/embed/W3Q5h756igs");
    cy.get("#howToSignUpButton").click();
    cy.url().should("eq", "http://localhost:3000/signup");

    //cy.go('back')
  });

  it('Test multiple "Claims", check if link to signup page', function () {
    cy.contains("Gomgom").parent().find("button").as("gomGomButton");
    cy.get("@gomGomButton").click();
    cy.url().should("eq", "http://localhost:3000/signup");
    cy.go("back");
    cy.contains("Eltelierworks")
      .parent()
      .find("button")
      .as("eltelierWorksButton");
    cy.get("@eltelierWorksButton").click();
    cy.url().should("eq", "http://localhost:3000/signup");
  });

  it("Testing more information when promotion is clicked", function () {
    cy.get('[alt="Eltelierworks logo"]').click();
    cy.go("back");
    cy.contains("Eltelierworks").click();
    cy.contains("Release date");
    cy.contains("Expiry date");
    cy.contains("About the business").click();
    cy.contains("Browse products");
    cy.contains("Terms & Conditions").click();
    cy.contains("Mandatory Legal Information");
    cy.get("#bigPromoClaimButton").click();
    cy.url().should("eq", "http://localhost:3000/signup");
    cy.go("back");
    cy.go("back");

    cy.get('[alt="Gomgom logo"]').click();
    cy.go("back");
    cy.contains("Gomgom").click();
    cy.contains("Release date");
    cy.contains("Expiry date");
    cy.contains("About the business").click();
    cy.contains("Browse products");
    cy.contains("Terms & Conditions").click();
    cy.contains("Mandatory Legal Information");
    cy.get("#bigPromoClaimButton").click();
    cy.url().should("eq", "http://localhost:3000/signup");
  });

  //Testing for signing up
  it("Signing Up", function () {
    cy.contains("Sign Up").click();
    cy.get("#name").type("tester");
    cy.get("#email").type("tester@email.com");
    cy.get("#password").type("helloworld");
    cy.get("#confirmPassword").type("helloworld");
    cy.get("#signUp").click();
    cy.contains("Confirm Your Email");
    cy.contains("Verify email later", { timeout: 10000 }).click();

    cy.get("#hamburgerIcon").click();
    cy.contains("Profile").click();
    cy.contains("Logout").click();

    cy.contains("Login").click();
    cy.get("#emailLogin").type("tester@email.com");
    cy.get("#passwordLogin").type("helloworld");
    cy.get("#logginInButton").click();

    //Find side bar, log out, then i have to log out, then test log in.
  });

  //Test for logging in
  /*
 it.only('Login Test', function() {
  cy.contains('Login').click()
  cy.get('#emailLogin').type('tester@email.com')
  cy.get('#passwordLogin').type('helloworld')
  cy.get('#loginButton').click()
 })
 */
});

describe("After logging in", function () {
  const login = () => {
    cy.visit("http://localhost:3000");

    // Perform the login steps
    cy.contains("Login").click();
    cy.get("#emailLogin").type("tester@email.com");
    cy.get("#passwordLogin").type("helloworld");
    cy.get("#logginInButton").click();
    cy.wait(1000); // Wait for any necessary network requests or animations

    // Set a flag in Cypress to indicate that the login has been performed
    Cypress.env("loggedIn", true);
  };

  beforeEach(function () {
    cy.visit("http://localhost:3000");

    if (!Cypress.env("loggedIn")) {
      login();
    }

    cy.visit("http://localhost:3000");
    cy.get("#hamburgerIcon");
  });
  it("Front Page and Footer Information", function () {
    cy.contains("Claim Promos");
    cy.contains("Gomgom");
    cy.contains("Promotions Available");
    cy.contains("Contact Us");
    cy.contains("Telegram: @alestierK");
    cy.contains("Claims available");
    cy.contains("Claim promotions from your favourite brands now!");
  });
  it("Question Mark", function () {
    cy.get("#questionMark").click();
    cy.contains("How does PinchPromo work?");
    cy.contains("Happy Pinching Promos");
    cy.contains("Close").click();
  });
  it('Testing more information when promotion is clicked', function() {
          cy.get('[alt="Eltelierworks logo"]').click()
          cy.go('back')
          cy.contains('Eltelierworks').click()
          cy.contains('Release date')
          cy.contains('Expiry date')
          cy.contains('About the business').click()
          cy.contains('Browse products')
          cy.contains('Terms & Conditions').click()
          cy.contains('Mandatory Legal Information')
          //cy.get('#bigPromoClaimButton').click()
          //cy.url().should('eq', 'http://localhost:3000/signup')
          cy.go('back')
      
          cy.get('[alt="Gomgom logo"]').click()
          cy.go('back')
          cy.contains('Gomgom').click()
          cy.contains('Release date')
          cy.contains('Expiry date')
          cy.contains('About the business').click()
          cy.contains('Browse products')
          cy.contains('Terms & Conditions').click()
          cy.contains('Mandatory Legal Information')
          cy.go('back')
          //cy.get('#bigPromoClaimButton').click()
          //cy.url().should('eq', 'http://localhost:3000/signup')
      
    })

  it('Used Promos are stored', function() {
    cy.get('#hamburgerIcon').click()
    cy.get('#hamburgerClaimedLink').click()
    cy.contains('Used Promos').click()
    cy.contains('Gomgom')
  })  
});

// Test flow: claim from promos page, click on logo, use the claim,check if speech bubble pops up, use claim, check for pinch promo X seomthign
//Test functionalities when logged in. 1: claims,  receipt claim
// Test if claims available will be deducted or not
