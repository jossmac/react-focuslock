// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import FocusLock, { FocusProvider } from '../src';

const text = 'A short string of innocuous text.';

describe('basic', () => {
  it('should throw when rendered without a focus provider', () => {
    expect(() => {
      shallow(<FocusLock><button>button</button></FocusLock>);
    })
    .toThrow('FocusLock expects a FocusProvider ancestor.');
  });
  it('should render', () => {
    const wrapper = shallow(
      <FocusProvider>
        <FocusLock><button>button</button></FocusLock>
      </FocusProvider>
    );
    expect(wrapper).not.toBe(undefined)
  });
});
