/* eslint-disable no-undef */
describe('Before Logging in Test', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.get('#signUpNavButton')
    cy.get('#loginNavButton')

  })

  it('Front Page and Footer Information', function() {
    cy.contains('PinchPromo')
    cy.contains('Gomgom')
    cy.contains('Promotions Available')
    cy.contains('Contact Us')
    cy.contains('Telegram: @alestierK')
  })
  
  it('"How to?" drop down', function() {
    cy.get('#dropDownInfo').click()
    cy.contains('New exclusive promos are released daily for you to maximise your dollar.')
    cy.get('#signUpLink')
    cy.get('#moreInfo').click()
    cy.contains("Steps To Use")
    cy.get('iframe#howToVideo')
    cy.get('iframe#howToVideo').should('have.attr', 'src')
      .and('include', 'https://www.youtube.com/embed/W3Q5h756igs');
    cy.get("#howToSignUpButton").click()
    cy.url().should('eq', 'http://localhost:3000/signup');
    
    //cy.go('back')
  })

  it('Test multiple "Claims", check if link to signup page', function() {
    cy.contains('Gomgom').parent().find('button').as('gomGomButton')
    cy.get('@gomGomButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup');
    cy.go('back')
    cy.contains('Eltelierworks').parent().find('button').as('eltelierWorksButton')
    cy.get('@eltelierWorksButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup');


  })

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
    cy.get('#bigPromoClaimButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup')
    cy.go('back')
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
    cy.get('#bigPromoClaimButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup')

  })

  //Testing for signing up
  it('Signing Up', function() {
    cy.contains('Sign Up').click()
    cy.get('#name').type('tester')
    cy.get('#email').type('tester@email.com')
    cy.get('#password').type('helloworld')
    cy.get('#confirmPassword').type('helloworld')
    cy.get('#signUp').click()
    cy.contains('Confirm Your Email')
    cy.contains('Verify email later',{timeout:10000}).click()

    cy.get('#hamburgerIcon').click()
    cy.contains('Profile').click()
    cy.contains('Logout').click()

    cy.contains('Login').click()
    cy.get('#emailLogin').type('tester@email.com')
    cy.get('#passwordLogin').type('helloworld')
    cy.get('#logginInButton').click()
    
    //Find side bar, log out, then i have to log out, then test log in.
    
  })
  
 //Test for logging in
 /*
 it.only('Login Test', function() {
  cy.contains('Login').click()
  cy.get('#emailLogin').type('tester@email.com')
  cy.get('#passwordLogin').type('helloworld')
  cy.get('#loginButton').click()
 })
 */
})

// describe('After logging in', function() {

//   beforeEach(function() {
//     cy.visit('http://localhost:3000')
//     cy.get('#hamburgerIcon')
//   })

    // it('Front Page and Footer Information', function() {
    //   cy.contains('PinchPromo')
    //   cy.contains('Gomgom')
    //   cy.contains('Promotions Available')
    //   cy.contains('Contact Us')
    //   cy.contains('Telegram: @alestierK')
    // })

//   it('Question Mark', function() {

//   })
//   it('Claiming and information', function() {

//   })
//   it('[HAMBURGER] Update Password', function() {

//   })
//   it('[HAMBURGER] claimed', function() {

//   })
//   it('[HAMBURGER] Receipt Upload', function() {

//   })
//   it('[HAMBURGER] Claim', function() {

//   })


// })



//Test functionalities when logged in. 1: claims, 2: update password. 3: the question mark stuff, check all functionalities in the hamrburger
// Test if claims available will be deducted or not