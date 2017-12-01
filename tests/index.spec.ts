import {configure, getProfile, isAuthenticated, signIn, signOut} from '../src';
import {expect} from 'chai';
import 'mocha';

describe('Testing basic functionality of this wrapper', () => {

  it('should be able to import functions', () => {
    expect(configure).to.not.be.null;
    expect(isAuthenticated).to.not.be.null;
    expect(signIn).to.not.be.null;
    expect(signOut).to.not.be.null;
    expect(getProfile).to.not.be.null;
  });
});
