/* eslint-disable no-undef */
describe('Front End Testing', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3000')
    cy.get('#signUpButton')
    cy.get('#loginButton')

  })

  it('front page can be opened', function() {
    cy.contains('PinchPromo')
    cy.contains('Gomgom')
    cy.contains('Promotions Available')
    cy.contains('Contact Us')
    cy.contains('Telegram: @alestierK')
    })
  
  it('testing "How to?" drop down ', function() {
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

  it('Testing multiple "Claims", check if link to signup page', function() {
    cy.contains('Gomgom').parent().find('button').as('gomGomButton')
    cy.get('@gomGomButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup');
    cy.go('back')
    cy.contains('Eltelierworks').parent().find('button').as('eltelierWorksButton')
    cy.get('@eltelierWorksButton').click()
    cy.url().should('eq', 'http://localhost:3000/signup');


  })
  it.only('Testing more information when promotion is clicked', function() {
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
  /*it('Login test', function() {
    cy.contains('Sign Up').click()
    cy.get('#name').type('tester')
    cy.get('#email').type('tester@email.com')
    cy.get('#password').type('helloworld')
    cy.get('#confirmPassword').type('helloworld')
    cy.get('#signUp').click()
    cy.contains('Confirm Your Email')
    
  })
  */
})