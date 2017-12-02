import './mocks';
import 'jsdom-global/register'

import {
  ACCESS_TOKEN,
  configure,
  EXPIRES_AT,
  getProfile,
  handleAuthCallback,
  ID_TOKEN,
  isAuthenticated,
  PROFILE,
  signIn,
  signOut
} from '../src';

import * as chai from 'chai';
import * as spies from 'chai-spies';
import {Auth0Properties} from "../src/properties";

chai.use(spies);

describe('Testing basic functionality of this wrapper', () => {

  it('should be able to import functions', checkImportFunctions);
  it('should accept basic configuration', checkBasicConfiguration);
  it('should accept full configuration', checkFullConfiguration);
  it('should clear identity/token properties from localStorage', checkSignOut);
  it('should be able to handle Auth0 calback', checkHandleAuthCallback);

  function checkImportFunctions() {
    chai.expect(configure).to.not.be.undefined;
    chai.expect(isAuthenticated).to.not.be.undefined;
    chai.expect(signIn).to.not.be.undefined;
    chai.expect(handleAuthCallback).to.not.be.undefined;
    chai.expect(signOut).to.not.be.undefined;
    chai.expect(getProfile).to.not.be.undefined;
  }

  function checkBasicConfiguration() {
    const spiedConfigure = chai.spy(configure);
    chai.expect(spiedConfigure).to.not.have.been.called();
    spiedConfigure(new Auth0Properties('bk-samples.auth0.com', 'someClientId'));
    chai.expect(spiedConfigure).to.have.been.called();
  }

  function checkFullConfiguration() {
    const spiedConfigure = chai.spy(configure);
    chai.expect(spiedConfigure).to.not.have.been.called();

    const auth0Properties = new Auth0Properties(
      'bk-samples.auth0.com',
      'someClientId',
      'http://localhost:4200/callback',
      'read:contacts',
      'https://contacts.auth0samples.com/'
    );
    spiedConfigure(auth0Properties);

    chai.expect(spiedConfigure).to.have.been.called();
  }

  function checkSignOut() {
    const OTHER_KEY = 'some-other-key';
    localStorage.setItem(OTHER_KEY, 'some-other-data');
    localStorage.setItem(ACCESS_TOKEN, 'fake-access-token');
    localStorage.setItem(ID_TOKEN, 'fake-id-token');
    localStorage.setItem(PROFILE, 'fake-profile');
    localStorage.setItem(EXPIRES_AT, 'one-day');

    signOut();

    chai.expect(localStorage.getItem(ACCESS_TOKEN)).to.be.null;
    chai.expect(localStorage.getItem(ID_TOKEN)).to.be.null;
    chai.expect(localStorage.getItem(PROFILE)).to.be.null;
    chai.expect(localStorage.getItem(EXPIRES_AT)).to.be.null;
    chai.expect(localStorage.getItem(OTHER_KEY)).to.not.be.null; //not null
  }

  function checkHandleAuthCallback() {
    configure(new Auth0Properties('bk-samples.auth0.com', 'someClientId'));
    chai.expect(isAuthenticated()).to.be.false;

    handleAuthCallback();

    chai.expect(isAuthenticated()).to.be.true;
    chai.expect(localStorage.getItem(ACCESS_TOKEN)).to.be.not.null;
    chai.expect(localStorage.getItem(ID_TOKEN)).to.be.not.null;
    chai.expect(localStorage.getItem(PROFILE)).to.be.not.null;
    chai.expect(localStorage.getItem(EXPIRES_AT)).to.be.not.null;
  }
});
