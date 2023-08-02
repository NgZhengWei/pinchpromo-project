/* eslint-disable no-undef */
//TODO Sign up, log in, once log in, check if empty, If empty, start on the uploading of the 

describe('Before logging into business account', () => {

  beforeEach(function() {
    cy.visit('http://localhost:3000/businesslogin')
    cy.contains('Business Login')
  })
  it('Signing up for business account', () => {
    cy.get('#businessLoginSignUpLink').click()
    cy.url().should('eq', 'http://localhost:3000/businesssignup')

    cy.get('#BusinessNameInput').type('Tester Business')
    cy.get('#BusinessEmailInput').type('testerbusiness@email.com')
    cy.get('#BusinessPasswordInput').type('HelloWorld')
    cy.get('#BusinessConfirmPasswordInput').type('HelloWorld')

    cy.get('#businesSignUpButton').click()
    cy.contains('Welcome to PinchPromo')
    cy.contains('Total Promotions')
    cy.contains('Promotions Claimed')

    cy.url().should('eq', 'http://localhost:3000/dashboard')
    cy.get('#businessHamburgerIcon').click()
    cy.get('#businessProfileLink').click()
    cy.contains("Logout").click()

    //bug regarding currentUser found, need to fix
  })

  it.only('Logging into business account', () => {
    cy.get('#businessLoginEmailInput').type('testerbusiness@email.com')
    cy.get('#businessLoginPasswordInput').type('HelloWorld')
    cy.get('#businessLoginButton').click()
    cy.url().should('eq', 'http://localhost:3000/dashboard')
  })

  it.only('Add new promotion, dashboard updates', () => {
    cy.get('#businessHamburgerIcon').click()
    cy.get('#businessCreateNewPromoLink').click()

    //Adding first Big Promo------------------------------------------------------------------------
    cy.get('#bigPromoStoreNameInput').type('Swifties Yeehaw 1')

    cy.get('#bigPromoPromoTitleInput').type('50% off Taylor Swift Tickets! 1')

    cy.get('#bigPromoAboutBusinessInput').type('We give out good deals for Taylor Swift')

    cy.get('#bigPromoSocialLinkInput').type('www.taylortaylor.com/socialmedia')

    cy.get('#bigPromoAboutWebsiteLinkInput').type('www.taylortaylor.com')

    cy.get('#bigPromoDescriptionInput').type('When you claim this and show Taylor Swift, she will give you 50% off!')

    cy.get('#bigPromoTermsAndConditionsInput').type('You must be a true swifty fan')

    cy.get('#bigPromoCodeInput').type('ILOVETAYLOR50')

    cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')

    cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')

    cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
    cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress.png')
    cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress.png')
    cy.get('#bigPromoNumCouponsInput').type('10')
    cy.get('#bigPromoSelectClaim').select('Website')
    cy.get('#bigPromoAddPromoButton').click()
    cy.wait(2000)
    cy.contains('Successfully added big promotion.')

    //Clearing the previous inputs
    cy.get('#bigPromoStoreNameInput').clear()

    cy.get('#bigPromoPromoTitleInput').clear()
    cy.get('#bigPromoAboutBusinessInput').clear()

    cy.get('#bigPromoSocialLinkInput').clear()

    cy.get('#bigPromoAboutWebsiteLinkInput').clear()

    cy.get('#bigPromoDescriptionInput').clear()

    cy.get('#bigPromoTermsAndConditionsInput').clear()

    cy.get('#bigPromoCodeInput').clear()

    cy.get('#bigPromoInitTimeInput').clear()
    cy.get('#bigPromoReleaseTimeInput').clear()

    cy.get('#bigPromoEndTimeInput').clear()

    cy.get('#bigPromoNumCouponsInput').clear()



    //Adding second Big Promo------------------------------------------------------------------------
    cy.get('#businessHamburgerIcon').click()
    cy.get('#businessCreateNewPromoLink').click()

  
    cy.get('#bigPromoStoreNameInput').type('Swifties Yeehaw 2')

    cy.get('#bigPromoPromoTitleInput').type('50% off Taylor Swift Tickets! 2')

    cy.get('#bigPromoAboutBusinessInput').type('We give out good deals for Taylor Swift')

    cy.get('#bigPromoSocialLinkInput').type('www.taylortaylor.com/socialmedia')

    cy.get('#bigPromoAboutWebsiteLinkInput').type('www.taylortaylor.com')

    cy.get('#bigPromoDescriptionInput').type('When you claim this and show Taylor Swift, she will give you 50% off!')

    cy.get('#bigPromoTermsAndConditionsInput').type('You must be a true swifty fan')

    cy.get('#bigPromoCodeInput').type('ILOVETAYLOR50')

    cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')

    cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')

    cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
    cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
    cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
    cy.get('#bigPromoNumCouponsInput').type('10')
    cy.get('#bigPromoSelectClaim').select('Website')
    cy.get('#bigPromoAddPromoButton').click()
    cy.wait(2000)
    cy.contains('Successfully added big promotion.')

    cy.visit('http://localhost:3000/dashboard')

  })

  it.only('Log into user account, see the new promotions', ()=> {


    cy.get('#businessHamburgerIcon').click()
    cy.get('#businessProfileLink').click()
    cy.contains("Logout").click()

    cy.visit('http://localhost:3000/login')
    cy.contains('Login').click()
    cy.get('#emailLogin').type('tester@email.com')
    cy.get('#passwordLogin').type('helloworld')
    cy.get('#logginInButton').click()
    cy.wait(1000)

    cy.contains('Swifties Yeehaw 1')
    cy.contains('Swifties Yeehaw 2')
    cy.contains('Swifties Yeehaw 2').parent().find('button').as('swiftiesButton')
    cy.get('@swiftiesButton').click()
    cy.url().should('eq', 'http://localhost:3000/mypromotions')
    //Logging out to go back into business account
    cy.get('#hamburgerIcon').click()
    cy.contains('Profile').click()
    cy.contains('Logout').click()

    //Logging into business account to check dashboard
    cy.get('#businessLoginEmailInput').type('testerbusiness@email.com')
    cy.get('#businessLoginPasswordInput').type('HelloWorld')
    cy.get('#businessLoginButton').click()
    cy.url().should('eq', 'http://localhost:3000/dashboard')
  } )


})


