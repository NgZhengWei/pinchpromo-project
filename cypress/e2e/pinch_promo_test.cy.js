/* eslint-disable no-undef */
//README: Before starting the test, remember to delete the current user account
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

  it.only('Fuzzer testing for logging in', function() {
    var iter = 0

    function randomizeUser() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let user = '';
      const userLength = Math.floor(Math.random() * 10) + 5; // Random user length between 5 and 14 characters
      for (let i = 0; i < userLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        user += chars.charAt(randomIndex);
      }
      return user;
    }
    
    function randomizePassword() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let password = '';
      const passLength = Math.floor(Math.random() * 15) + 8; // Random password length between 8 and 22 characters
      for (let i = 0; i < passLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
      }
      return password;
    }
    
    cy.contains('Login').click()
    while (iter <10) {
      const randomUser = randomizeUser()
      const randomPass =  randomizePassword()
      console.log('randomUser: ', randomUser)
      console.log('randomPass: ', randomPass)
    
      cy.get('#emailLogin').type(randomUser)
      cy.get('#passwordLogin').type(randomPass)
      cy.get('#logginInButton').click()
      cy.url().should('eq', 'http://localhost:3000/login')

      cy.get('#emailLogin').clear()
      cy.get('#passwordLogin').clear()


      iter +=1
    }
  })

  it.only('Fuzzer testing for signing up', function() {

    var iter = 0
    const maxIter = 5

    function randomizeUser() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let user = '';
      const userLength = Math.floor(Math.random() * 10) + 5; // Random user length between 5 and 14 characters
      for (let i = 0; i < userLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        user += chars.charAt(randomIndex);
      }
      return user;
    }
    
    function randomizePassword() {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let password = '';
      const passLength = Math.floor(Math.random() * 15) + 8; // Random password length between 8 and 22 characters
      for (let i = 0; i < passLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
      }
      return password;
    }

    cy.get('#signUpNavButton').click()

    while( iter < maxIter) {
      var randomName = randomizeUser()
      var randomPassword1 = randomizePassword()
      var randomPassword2 = randomizePassword()

      cy.get('#name').type(randomName)
      cy.get('#email').type('staticmail@email.com')
      cy.get('#password').type(randomPassword1)
      cy.get('#confirmPassword').type(randomPassword2)
      cy.get('#signUp').click()
      cy.contains('Passwords do not match')
      cy.wait(1000)
      cy.get('#name').clear()
      cy.get('#email').clear()
      cy.get('#password').clear()
      cy.get('#confirmPassword').clear()
      iter +=1
    }
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

describe('After logging in', function() {

  const login = () => {
  cy.visit('http://localhost:3000')

  // Perform the login steps
  cy.contains('Login').click()
  cy.get('#emailLogin').type('tester@email.com')
  cy.get('#passwordLogin').type('helloworld')
  cy.get('#logginInButton').click()
  cy.wait(1000) // Wait for any necessary network requests or animations

  // Set a flag in Cypress to indicate that the login has been performed
  Cypress.env('loggedIn', true)
}

  beforeEach(function() {
    cy.visit('http://localhost:3000')

    if (!Cypress.env('loggedIn')) {
      login()
    }

    cy.visit('http://localhost:3000')
    cy.get('#hamburgerIcon')
  })

    it('Front Page and Footer Information', function() {
      cy.contains('Claim Promos')
      cy.contains('Gomgom')
      cy.contains('Promotions Available')
      cy.contains('Contact Us')
      cy.contains('Telegram: @alestierK')
      cy.contains('Claims available')
      cy.contains('Claim promotions from your favourite brands now!')
    
    })

    it.only('Fuzzer Receipt Test', function() {
      var  iter = 0

      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerReceiptUpLoadLink').click()

      function randomizeNum() {
        const chars = '0123456789';
        let rand = '';
        const randLength = Math.floor(Math.random() * 10) + 5; // Random user length between 5 and 14 characters
        for (let i = 0; i < randLength; i++) {
          const randomIndex = Math.floor(Math.random() * chars.length);
          rand += chars.charAt(randomIndex);
        }
        return rand;
      }

      function omitRandomInput() {
        const inputFields = [
          'PictureUpload',
          'NumberUpload',
          'PromoClaimSelect'
          // Add other input field IDs here as needed
        ];
        const randomIndex = Math.floor(Math.random() * 3);
        const inputToOmit = inputFields[randomIndex];
        return inputToOmit
      }

      while (iter <10) {
        const omittedInput = omitRandomInput();

        if (omittedInput === 'PictureUpload'){
          cy.get('#ReceiptClaimPhoneNumInput').type(randomizeNum())
          cy.get('#ReceiptClaimFormSelectInput').select('SUTD Professors')
          cy.get('#ReceiptClaimButtonInput').click()

        }
        else if(omittedInput === 'NumberUpload'){
          cy.get('#ReceiptClaimReceiptImageInput').selectFile('UserAccountReceiptClaimImage.png')
          cy.get('#ReceiptClaimFormSelectInput').select('SUTD Professors')
          cy.get('#ReceiptClaimButtonInput').click()

        }
        else if(omittedInput === 'PromoClaimSelect'){
          cy.get('#ReceiptClaimReceiptImageInput').selectFile('UserAccountReceiptClaimImage.png')
          cy.get('#ReceiptClaimPhoneNumInput').type(randomizeNum())
          cy.get('#ReceiptClaimFormSelectInput').select('Select')
          cy.get('#ReceiptClaimButtonInput').click()

        }
        cy.contains('Successfully added receipt claim.').should('not.exist');

        cy.go('back')
        cy.go('forward')

        iter +=1
      }

    })

    it('Question Mark', function() {
      cy.get('#questionMark').click()
      cy.contains('How does PinchPromo work?')
      cy.contains('Happy Pinching Promos')
      cy.contains('Close').click()
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

    it('[HAMBURGER] Update Password', function() {
      //Update Password
      cy.get('#updateEmailInput').should('have.value', 'tester@email.com')
      cy.get('#updatePasswordInput').type('rightpassword')
      cy.get('#updateConfirmPasswordInput').type('testwrongpassword2')
      cy.get('#updateButton').click()
      cy.contains('Passwords do not match')
      cy.get('#updateConfirmPasswordInput').clear()
      cy.get('#updateConfirmPasswordInput').type('rightpassword')
      cy.get('#updateButton').click()
      cy.wait(2000)

      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerProfileLink').click()
      cy.get('#logoutButton').click()
      cy.url().should('eq', 'http://localhost:3000/login')
      cy.get('#emailLogin').type('tester@email.com')
      cy.get('#passwordLogin').type('rightpassword')
      cy.get('#logginInButton').click()

      //Update Email
      cy.get('#hamburgerIcon').click()
      cy.contains('Profile').click()
      cy.get('#updateEmailInput').should('have.value', 'tester@email.com')
      cy.get('#updateEmailInput').clear()
      cy.get('#updateEmailInput').type('updatedTester@email.com')
      cy.get('#updateButton').click()
      cy.wait(2000)

      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerProfileLink').click()
      cy.get('#logoutButton').click()
      cy.url().should('eq', 'http://localhost:3000/login')
      cy.get('#emailLogin').type('updatedTester@email.com')
      cy.get('#passwordLogin').type('rightpassword')
      cy.get('#logginInButton').click()

      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerProfileLink').click()
      /*
      Fails due to no capital letters setting, please fix
      cy.get('#updateEmailInput').should('have.value', 'updatedTester@email.com')  
      */

    })

    it('[HAMBURGER] How to Use', function() {
      cy.get('#hamburgerIcon').click()
      cy.contains('How to use').click()
      cy.url().should('eq', 'http://localhost:3000/howtouse')
      cy.contains('Claim New Promos').click()
    })

    it('[HAMBURGER] Receipt Upload', function() {
      
      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerReceiptUpLoadLink').click()
      cy.get('#ReceiptClaimPhoneNumInput').type('12345678')
      cy.get('#ReceiptClaimFormSelectInput').select('SUTD Professors')
      cy.get('#ReceiptClaimReceiptImageInput').selectFile('UserAccountReceiptClaimImage.png')

      cy.get('#ReceiptClaimButtonInput').click()
      cy.contains('Successfully added receipt claim.').should('exist');

    })
    
    it('[HAMBURGER] Claim', function() {
      cy.contains('Gomgom').parent().find('button').as('gomGomButton')
      cy.get('@gomGomButton').click()
      cy.url().should('eq', 'http://localhost:3000/mypromotions')
      cy.go('back')  
      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerClaimedLink').click()
      cy.url().should('eq', 'http://localhost:3000/mypromotions')
      cy.get('[alt="Gomgom logo"]').click()
      cy.contains('[Important] How to use').click()
      cy.contains('About Business').click()
      cy.contains('Terms & Conditions').click()
      cy.contains('Mandatory Legal Information')
      cy.get('#claimingButton').click()
      cy.contains('Note: Before Using Coupon')
      cy.get('#cancelButton').click()
      cy.get('#claimingButton').click()
      cy.get('#confirmUseButton').click()
      cy.contains('Time remaining:')
      cy.contains('Promocode:')
      // cy.contains('Ready to Use Promos')
    })

    it('Used Promos are stored', function() {
      cy.get('#hamburgerIcon').click()
      cy.get('#hamburgerClaimedLink').click()
      cy.contains('Used Promos').click()
      cy.contains('Gomgom')

    })

    it("Claiming before claim is reset", function() {
      cy.contains('0/1')
      cy.contains('New claim in ')
      cy.contains('Eltelierworks').parent().find('button').as('eltelierWorksbutton')
      cy.get('@eltelierWorksbutton').click()
      cy.contains('Wait till your claim recharges to claim another promotion.')
    })


  })


// Test flow: claim from promos page, click on logo, use the claim,check if speech bubble pops up, use claim, check for pinch promo X seomthign
//Test functionalities when logged in. 1: claims,  receipt claim
// Test if claims available will be deducted or not