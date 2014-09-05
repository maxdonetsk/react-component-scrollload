
/**
 * @jsx React.DOM
 */

var React = require('react');

var ContinuousScroll = React.createClass({
  propTypes: {
    hasMore: React.PropTypes.bool.isRequired,
    loadMore: React.PropTypes.func.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    threshold: React.PropTypes.number,
    loader: React.PropTypes.component,
    disablePointer: React.PropTypes.number,
    disablePointerClass: React.PropTypes.string
  },
  getDefaultProps: function () {
    return {
      threshold: 1000,
      loader: React.DOM.div(null, 'Loading...'),
      disablePointer: 0,
      disablePointerClass: 'disable-pointer'
    };
  },
  disablePointerTimeout: null,
  onScroll: function () {
    if (this.props.disablePointer > 0)
      this.disablePointer();

    if (!this.props.hasMore || this.props.isLoading)
      return;

    var el = this.getDOMNode();

    if (el.scrollTop + el.offsetHeight + this.props.threshold < el.scrollHeight)
      return;

    this.props.loadMore();
  },
  disablePointer: function () {
    if (this.disablePointerTimeout === null)
      this.refs.wrapper.getDOMNode().classList.add(this.props.disablePointerClass);

    clearTimeout(this.disablePointerTimeout);
    this.disablePointerTimeout = setTimeout(this.removeDisablePointerClass, this.props.disablePointer);
  },
  removeDisablePointerClass: function () {
    this.refs.wrapper.getDOMNode().classList.remove(this.props.disablePointerClass);
    this.disablePointerTimeout = null;
  },
  componentDidMount: function () {
    this.listenScroll();
  },
  componentDidUpdate: function () {
    var el = this.getDOMNode();

    // when component update need to check if loaded children height are bigger than threshold else load more
    // About setTimeout: fluxxor enforce flux principle; dispatching an action during and action would trigger an error
    setTimeout(this.onScroll);
  },
  componentWillUnmount: function () {
    this.unlistenScroll();
  },
  listenScroll: function () {
    this.getDOMNode().addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onScroll);
  },
  unlistenScroll: function () {
    this.getDOMNode().removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  },
  componentWillReceiveProps: function (nextProps) {
    // if there is no need to listen on scroll anymore
    if (!nextProps.hasMore && this.props.disablePointer <= 0)
      this.unlistenScroll();
  },
  render: function() {

    return this.transferPropsTo(
      React.DOM.div({},
        React.DOM.div({ref: 'wrapper'},
          this.props.children
        ),
        this.props.isLoading && this.props.loader
      )
    );
  }

});

module.exports = ContinuousScroll;
