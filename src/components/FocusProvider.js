// @flow
import React, { Component, type ElementType, type Node } from 'react';
import PropTypes from 'prop-types';
import FocusMarshal from './FocusMarshal';

type Props = {
  children: Node,
  component: ElementType,
};

export default class FocusProvider extends Component<Props> {
  focusMarshal: FocusMarshal;
  static childContextTypes = {
    focusMarshal: PropTypes.instanceOf(FocusMarshal).isRequired,
  };
  static defaultProps = {
    component: 'div',
  };

  constructor(props: Props) {
    super(props);
    this.focusMarshal = new FocusMarshal();
  }

  getChildContext() {
    return {
      focusMarshal: this.focusMarshal,
    };
  }

  render() {
    const { children, component: Tag } = this.props;

    return <Tag>{children}</Tag>;
  }
}
