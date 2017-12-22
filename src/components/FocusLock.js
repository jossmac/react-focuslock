// @flow

import { Component, type Element } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import FocusMarshal, {
  type AutoFocus,
  type Boundary,
  type TeardownOptions,
} from './FocusMarshal';

type Props = {
  /**
    DOM Element to apply `aria-hidden=true` to when this component gains focus.
    Also available via context if set on an ancestor's getChildContext().
  */
  ariaHiddenNode?: HTMLElement,
  /**
    Boolean OR Function indicating which element to focus when the component
    initialises (mounts or becomes enabled):
    - TRUE will automatically find the first "tabbable" element within the lock
    - Providing a function should return the element you want to focus
  */
  autoFocus: AutoFocus,
  /**
    Accepts a single child
  */
  children?: Element<*>,
  /**
    Toggle focus management outside of mount/unmount lifecycle methods
  */
  enabled?: boolean,
};

/* eslint-disable react/sort-comp */
export default class FocusLock extends Component<Props> {
  ariaHiddenNode: HTMLElement;
  boundary: Boundary;
  initFromProps: boolean = false;
  teardownFromProps: boolean = false;

  static defaultProps = {
    autoFocus: false,
  };
  static contextTypes = {
    /** provide a universal node to hide when focus lock is active */
    ariaHiddenNode: PropTypes.object,
    /** marshal provided by the FocusProvider */
    focusMarshal: PropTypes.instanceOf(FocusMarshal).isRequired,
  };
  constructor(props, context) {
    super(props, context);

    if (!this.context.focusMarshal) {
      throw new Error('FocusLock expects a FocusProvider ancestor.');
    }

    this.focusMarshal = context.focusMarshal;
  }

  componentDidMount() {
    const { enabled } = this.props;

    if (enabled || enabled === undefined) {
      this.initialise();
    }
  }
  componentWillUnmount() {
    if (!this.initFromProps && !this.teardownFromProps) {
      this.teardown({ shouldRestoreFocus: true });
    }
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      this.initFromProps = true;
      this.initialise();
    }

    if (!nextProps.enabled && nextProps.enabled !== this.props.enabled) {
      this.teardownFromProps = true;
      this.teardown({ shouldRestoreFocus: true });
    }
  }

  initialise = () => {
    const { autoFocus } = this.props;

    this.getBoundary();

    // set the element to hide from assistive technology
    this.ariaHiddenNode =
      this.props.ariaHiddenNode || this.context.ariaHiddenNode;

    // accessible `popup` content
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.setAttribute('aria-hidden', '');
    }

    // register the boundary
    this.focusMarshal.register({ autoFocus, boundary: this.boundary });
  };
  teardown = (options: TeardownOptions) => {
    if (this.ariaHiddenNode) {
      this.ariaHiddenNode.removeAttribute('aria-hidden');
    }

    this.focusMarshal.unregister(options);
  };
  getBoundary() {
    // eslint-disable-next-line react/no-find-dom-node
    const boundary = findDOMNode(this);

    // findDOMNode's return type is `Element | Text | null`
    // This check keeps flow happy
    if (boundary instanceof HTMLElement) {
      this.boundary = boundary;
    }
  }

  render() {
    return this.props.children;
  }
}
