/* eslint-disable no-undef */
// eslint-disable-next-line no-undef

describe('Front End Testing', function() {

  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('PinchPromo')
    cy.contains('Gomgom')
    cy.contains('Eltelierworks')
    cy.contains('Promotions Available')
    cy.contains('Contact Us')
    cy.contains('Telegram: @alestierK')
    })
  //Testing for signing up
  it('Login test', function() {
    cy.contains('Sign Up').click()
    cy.get('#name').type('tester')
    cy.get('#email').type('tester@email.com')
    cy.get('#password').type('helloworld')
    cy.get('#confirmPassword').type('helloworld')
    cy.get('#signUp').click()
    cy.contains('Confirm Your Email')
  })
})