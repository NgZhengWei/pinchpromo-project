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

  it('Logging into business account', () => {
    cy.get('#businessLoginEmailInput').type('testerbusiness@email.com')
    cy.get('#businessLoginPasswordInput').type('HelloWorld')
    cy.get('#businessLoginButton').click()
    cy.url().should('eq', 'http://localhost:3000/dashboard')
  })  

  it('fuzzer testing for big promo', ()=> {
      var iter = 0
  
      function randomize() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let rand = '';
        const randLength = Math.floor(Math.random() * 10) + 5; // Random user length between 5 and 14 characters
        for (let i = 0; i < randLength; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          rand += chars.charAt(randomIndex);
        }
        return rand;
      }

      function randomizeDate() {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + Math.random() * 100000000000); // Random future date within 100000000000 milliseconds (~3 years)
        return futureDate.toISOString();
      }

      
    function omitRandomInput() {
      const inputFields = [
        'StoreName',
        'PromoTitle',
        'AboutBusiness',
   
        'PromoCode',
        'InitTime',
        'ReleaseTime',
        'EndTime',
        'NumOfCoupons'
        // Add other input field IDs here as needed
      ];
      const randomIndex = Math.floor(Math.random() * inputFields.length);
      const inputToOmit = inputFields[randomIndex];
      return inputToOmit
    }

      cy.get('#businessHamburgerIcon').click()
      cy.get('#businessCreateNewPromoLink').click()
      
      while (iter <10) {
        const omittedInput = omitRandomInput();

        if (omittedInput === 'StoreName'){
          cy.get('#bigPromoPromoTitleInput').type(randomize())

          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigPromoReleaseTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type( Math.floor(Math.random() *100 ))
  
          cy.get('#bigPromoSelectClaim').select('Website')

        }
        else if (omittedInput === 'PromoTitle') {
          cy.get('#bigPromoStoreNameInput').type(randomize())
          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type(randomize())
  
          cy.get('#bigPromoSelectClaim').select('Website')
        }
        else if (omittedInput === 'AboutBusiness') {
          cy.get('#bigPromoStoreNameInput').type(randomize())

          cy.get('#bigPromoPromoTitleInput').type(randomize())

          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())

          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type( Math.floor(Math.random() *100 ))
  
          cy.get('#bigPromoSelectClaim').select('Website')
  
        }
        else if (omittedInput === 'InitTime') {
          cy.get('#bigPromoStoreNameInput').type(randomize())

          cy.get('#bigPromoPromoTitleInput').type(randomize())
  
          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())

          cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type(randomize())
  
          cy.get('#bigPromoSelectClaim').select('Website')
        }
        else if (omittedInput === 'ReleaseTime'){
          cy.get('#bigPromoStoreNameInput').type(randomize())

          cy.get('#bigPromoPromoTitleInput').type(randomize())
  
          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')

          cy.get('#bigPromoEndTimeInput').type('2023-12-05T17:30')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type( Math.floor(Math.random() *100 ))
  
          cy.get('#bigPromoSelectClaim').select('Website')
        }
        else if (omittedInput === 'EndTime'){
          cy.get('#bigPromoStoreNameInput').type(randomize())

          cy.get('#bigPromoPromoTitleInput').type(randomize())
  
          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')

          cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoNumCouponsInput').type( Math.floor(Math.random() *100 ))
  
          cy.get('#bigPromoSelectClaim').select('Website')
          
        }
        else if (omittedInput === 'NumOfCoupons'){

          cy.get('#bigPromoStoreNameInput').type(randomize())

          cy.get('#bigPromoPromoTitleInput').type(randomize())
  
          cy.get('#bigPromoAboutBusinessInput').type(randomize())
  
          cy.get('#bigPromoAboutWebsiteLinkInput').type(randomize())
  
          cy.get('#bigPromoSocialLinkInput').type(randomize())
  
          cy.get('#bigPromoTermsAndConditionsInput').type(randomize())
  
          cy.get('#bigPromoDescriptionInput').type(randomize())
  
          cy.get('#bigPromoCodeInput').type(randomize())
  
          cy.get('#bigPromoInitTimeInput').type('2023-08-02T13:00')

          cy.get('#bigPromoReleaseTimeInput').type('2023-08-02T13:00')
  
          cy.get('#bigLogoImageInput').selectFile('BusinessPromoCypress2.png')
  
          cy.get('#bigPromoPosterimageInput').selectFile('BusinessPosterCypress2.png')
  
          cy.get('#bigPromoSelectClaim').select('Website')
          
        }

        cy.get('#bigPromoAddPromoButton').click()

        cy.contains('Successfully added big promotion.').should('not.exist');
        //Clearing

        cy.get('#bigPromoStoreNameInput').clear()

        cy.get('#bigPromoPromoTitleInput').clear()
        cy.get('#bigPromoAboutBusinessInput').clear()
    
        cy.get('#bigPromoSocialLinkInput').clear()
    
        cy.get('#bigPromoAboutWebsiteLinkInput').clear()
    
        cy.get('#bigPromoTermsAndConditionsInput').clear()

        cy.get('#bigPromoDescriptionInput').clear()
    
        cy.get('#bigPromoCodeInput').clear()
    
        cy.get('#bigPromoInitTimeInput').clear()
        cy.get('#bigPromoReleaseTimeInput').clear()
    
        cy.get('#bigPromoEndTimeInput').clear()
    
        cy.get('#bigPromoNumCouponsInput').clear()
    
        //should not go through, how to check
        //insert checker here 
        iter+=1
      }
    })
})


