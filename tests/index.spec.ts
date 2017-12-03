import './mocks';
import 'jsdom-global/register'

import * as Auth0Web from '../src';

import * as chai from 'chai';
import * as sinonjs from 'sinon';

describe('Testing basic functionality of this wrapper', () => {

  it('should be able to import functions', checkImportFunctions);
  it('should accept basic configuration', checkBasicConfiguration);
  it('should accept full configuration', checkFullConfiguration);
  it('should clear identity/token properties from localStorage', checkSignOut);
  it('should be able to handle Auth0 calback', checkHandleAuthCallback);
  it('should be able to inform if user is authenticated', checkAuthenticated);
  it('should be able to support subscribers when not auth', checkSubscribeUnauthenticated);
  it('should be able to support subscribers when auth', checkSubscribeAuthenticated);
  it('should return profile from localStorage', checkGetProfile);
  it('should call authorize', checkSignIn);

  function checkImportFunctions() {
    chai.expect(Auth0Web.configure).to.not.be.undefined;
    chai.expect(Auth0Web.isAuthenticated).to.not.be.undefined;
    chai.expect(Auth0Web.signIn).to.not.be.undefined;
    chai.expect(Auth0Web.handleAuthCallback).to.not.be.undefined;
    chai.expect(Auth0Web.signOut).to.not.be.undefined;
    chai.expect(Auth0Web.getProfile).to.not.be.undefined;
  }

  function checkBasicConfiguration() {
    const spiedConfigure = sinonjs.spy(Auth0Web.configure);
    chai.expect(spiedConfigure.called).to.be.false;
    spiedConfigure({domain: 'bk-samples.auth0.com', clientID: 'someClientID'});
    chai.expect(spiedConfigure.called).to.be.true;
  }

  function checkFullConfiguration() {
    const spiedConfigure = sinonjs.spy(Auth0Web.configure);
    chai.expect(spiedConfigure.called).to.be.false;

    const auth0Properties = {
      domain: 'bk-samples.auth0.com',
      clientID: 'someClientID',
      callbackUrl: 'http://localhost:4200/callback',
      scope: 'read:contacts',
      audience: 'https://contacts.auth0samples.com/'
    };
    spiedConfigure(auth0Properties);

    chai.expect(spiedConfigure.called).to.be.true;
  }

  function checkSignOut() {
    const OTHER_KEY = 'some-other-key';
    localStorage.setItem(OTHER_KEY, 'some-other-data');
    localStorage.setItem(Auth0Web.ACCESS_TOKEN, 'fake-access-token');
    localStorage.setItem(Auth0Web.ID_TOKEN, 'fake-id-token');
    localStorage.setItem(Auth0Web.PROFILE, 'fake-profile');
    localStorage.setItem(Auth0Web.EXPIRES_AT, 'one-day');

    Auth0Web.signOut();

    chai.expect(localStorage.getItem(Auth0Web.ACCESS_TOKEN)).to.be.null;
    chai.expect(localStorage.getItem(Auth0Web.ID_TOKEN)).to.be.null;
    chai.expect(localStorage.getItem(Auth0Web.PROFILE)).to.be.null;
    chai.expect(localStorage.getItem(Auth0Web.EXPIRES_AT)).to.be.null;
    chai.expect(localStorage.getItem(OTHER_KEY)).to.not.be.null; //not null
  }

  function checkHandleAuthCallback() {
    Auth0Web.configure({domain: 'bk-samples.auth0.com', clientID: 'someClientID'});
    chai.expect(Auth0Web.isAuthenticated()).to.be.false;

    Auth0Web.handleAuthCallback();

    chai.expect(Auth0Web.isAuthenticated()).to.be.true;
    chai.expect(localStorage.getItem(Auth0Web.ACCESS_TOKEN)).to.be.not.null;
    chai.expect(localStorage.getItem(Auth0Web.ID_TOKEN)).to.be.not.null;
    chai.expect(localStorage.getItem(Auth0Web.PROFILE)).to.be.not.null;
    chai.expect(localStorage.getItem(Auth0Web.EXPIRES_AT)).to.be.not.null;
  }

  function checkAuthenticated() {
    Auth0Web.signOut();
    chai.expect(Auth0Web.isAuthenticated()).to.be.false;
  }

  function checkSubscribeUnauthenticated() {
    const subscription = Auth0Web.subscribe(signedIn => {
      chai.expect(signedIn).to.be.false;
    });
    subscription.unsubscribe();
  }

  function checkSubscribeAuthenticated() {
    Auth0Web.configure({domain: 'bk-samples.auth0.com', clientID: 'someClientID'});
    chai.expect(Auth0Web.isAuthenticated()).to.be.false;
    let subscription = Auth0Web.subscribe(signedIn => {
      chai.expect(signedIn).to.be.false;
    });
    subscription.unsubscribe();

    subscription = Auth0Web.subscribe(signedIn => {
      chai.expect(signedIn).to.be.equal(Auth0Web.isAuthenticated());
    });
    Auth0Web.handleAuthCallback();
    Auth0Web.signOut();
    subscription.unsubscribe();
  }

  function checkGetProfile() {
    Auth0Web.configure({domain: 'bk-samples.auth0.com', clientID: 'someClientID'});
    chai.expect(Auth0Web.getProfile()).to.be.null;
    Auth0Web.handleAuthCallback();
    chai.expect(Auth0Web.getProfile()).to.not.be.null;
  }

  function checkSignIn() {
    Auth0Web.configure({domain: 'bk-samples.auth0.com', clientID: 'someClientID'});
    chai.expect(Auth0Web.auth0Client.called()).to.be.false;
    Auth0Web.signIn();
    chai.expect(Auth0Web.auth0Client.called()).to.be.true;
  }
});
