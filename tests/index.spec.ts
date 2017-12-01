import {configure, getProfile, isAuthenticated, signIn, signOut} from '../src';

import * as chai from 'chai';
import * as spies from 'chai-spies';
import {Auth0Properties} from "../src/properties";

chai.use(spies);

describe('Testing basic functionality of this wrapper', () => {

  it('should be able to import functions', () => {
    chai.expect(configure).to.not.be.null;
    chai.expect(isAuthenticated).to.not.be.null;
    chai.expect(signIn).to.not.be.null;
    chai.expect(signOut).to.not.be.null;
    chai.expect(getProfile).to.not.be.null;
  });

  it('should accept basic configuration', () => {
    const spiedConfigure = chai.spy(configure);
    chai.expect(spiedConfigure).to.not.have.been.called();
    spiedConfigure(new Auth0Properties('bk-samples.auth0.com', 'someClientId'));
    chai.expect(spiedConfigure).to.have.been.called();
  });

  it('should accept full configuration', () => {
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
  });
});
