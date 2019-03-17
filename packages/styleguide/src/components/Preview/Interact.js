/* eslint-disable no-underscore-dangle */
import React from 'react';
import { arrayOf, string, bool, element, func, oneOfType } from 'prop-types';
import cx from 'classnames';
import styled from 'styled-components';
import CodeExample from './CodeExample';
import Preview from './Preview';

import { Bar, BarItem, Button } from './../';

import useId from './../../utils/useId';

const Grid = styled.div`
  display: flex;
`;
const GridCol = styled.div`
  flex: 1 0 auto;
  padding: ${props => props.theme.spaces.small};

  ${props =>
    props.size &&
    `
    width: ${(props.size / 12) * 100 + '%'}
    `}
`;

const Input = styled.input`
  background-color: #fff;
  border: 1px solid #ced3d7;
  border-radius: 3px;
  font-size: 0.875rem;
  min-height: 1em;
  padding: 0.42857em 0.57143em;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StyledTooltip = styled.div`
  position: relative;
  color: white;

  .tooltip-title {
    pointer-events: none;
    position: absolute;
    width: 200px;
    text-align: center;
    padding: ${props => props.theme.spaces.small};
    background: black;
    border-radius: ${props => props.theme.spaces.tiny};
    left: 0;
    top: 50%;
    transform: translate(-105%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease-in 0.1s;

    ::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(100%, -50%);
      border-style: solid;
      border-width: 6px 0 6px 8px;
      border-color: transparent transparent transparent black;
    }
  }

  .tooltip-trigger:hover + .tooltip-title {
    opacity: 1;
  }

  .tooltip-trigger {
    background: black;
    color: white;
    text-align: center;
    font-size: 0.875rem;
    height: 32px;
    width: 32px;
    margin: 0;
    padding: 0.42857em;
    border-radius: 50%;
  }
`;

const Tooltip = ({ children, dialog, ...other }) => (
  <StyledTooltip {...other}>
    <div className="tooltip-trigger">{children}</div>
    <div className="tooltip-title">{dialog}</div>
  </StyledTooltip>
);

const StyledButton = styled(Button)`
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.2s ease-out;
  position: relative;
  display: inline-block;
  margin-bottom: 1em;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  padding: 0.427rem;
  font-size: 0.875rem;
  border-radius: 0;
  color: #ff5722;

  :focus,
  :hover {
    color: #ff9a7a;
    background-color: #fff;
    border-color: hsla(0, 0%, 100%, 0.4);
    z-index: 1;
  }

  .is-active,
  :active {
    color: #ff794e;
    background-color: #fff;
    border-color: hsla(0, 0%, 100%, 0.2);
    z-index: 1;
  }

  ::after {
    content: '';
    display: inline-block;
    border-style: solid;
    border-width: 7px 6px 0 6px;
    border-color: #e64e1f transparent transparent transparent;
  }

  &.opened::after {
    border-width: 0 6px 7px 6px;
    border-color: transparent transparent #e64e1f transparent;
  }
`;

const StyledSticky = styled.div`
  position: sticky;
  top: 0;
`;

const Hidden = styled.div`
  display: ${props => (props.hide ? 'none' : 'block')};
`;

const cleanValue = s => (typeof s === 'string' ? s.replace(/(^'|'$)/g, '') : s);

const getDocgenProps = component =>
  (component.type &&
    component.type.__docgenInfo &&
    component.type.__docgenInfo.props) || {
    children: {
      type: {
        name: typeof component,
        value: component
      }
    }
  };

const getDisplayName = component =>
  (component.type && component.type.displayName) ||
  (typeof component === 'string' ? 'Text' : 'NoDisplayName');

const is = (value, type) => value === type;

const StyledInteract = styled.div`
  font-family: ${props => props.theme.fontFamily};
`;

class Interact extends React.Component {
  static propTypes = {
    filterProps: arrayOf(string),
    render: oneOfType([element, func]).isRequired,
    skipChildren: bool
  };

  static defaultProps = {
    filterProps: []
  };

  constructor(props) {
    super(props);
    this.component = props.render;

    this.id = useId('interactive');

    this.getPropValue = this.getPropValue.bind(this);
    this.isDefaultValue = this.isDefaultValue.bind(this);
    this.getDefaultValue = this.getDefaultValue.bind(this);
    this.handleShowCode = this.handleShowCode.bind(this);
    this.handleShowProps = this.handleShowProps.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.renderInteractive = this.renderInteractive.bind(this);
    this.generateLiveProps = this.generateLiveProps.bind(this);
    this.generateDocgenProps = this.generateDocgenProps.bind(this);
    this.getComponentInfo = this.getComponentInfo.bind(this);
    this.getComponentDocgenProps = this.getComponentDocgenProps.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
    this.setDeepState = this.setDeepState.bind(this);
    this.renderInput = this.renderInput.bind(this);

    /*  
      this.state = {
        liveProps:{
          'Button0': {
          ...Button0Props
        },
        'Button0Icon0': {
          ...Button0Icon0Props
        },
        'Button0Text0': {
          ...Button0Text0
        },
        'Button0Icon1': {
          ...Button0Icon1Props
        },
        etc.
      }             
    }; 
    */
    this.state = {
      showCode: false,
      liveProps: this.generateLiveProps(this.component),
      showProps: this.generateShowProps(this.component)
    };
    this.docgen = {
      liveProps: this.generateDocgenProps(this.component)
    };

    console.log(this);
  }

  getComponentInfo(component, id = 0, prefix = '') {
    const name = prefix + getDisplayName(component) + id;
    const props = getDocgenProps(component);
    const propValues = Object.keys(props).reduce((acc, propName) => {
      const value =
        typeof component !== 'string'
          ? this.getPropValue(propName, component)
          : component;
      return {
        ...acc,
        ...(value !== null ? { [propName]: value } : {})
      };
    }, {});

    return {
      name,
      state: {
        [name]: {
          ...propValues
        }
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getComponentDocgenProps(component, id = 0, prefix = '') {
    const name = prefix + getDisplayName(component) + id;
    const props = getDocgenProps(component);
    return {
      name,
      state: {
        [name]: {
          ...props
        }
      }
    };
  }

  isDefaultValue(id, name) {
    const stateValue =
      this.state.liveProps[id] && this.state.liveProps[id][name];
    const docgenValue =
      this.docgen.liveProps[id] && this.docgen.liveProps[id][name];
    return (
      stateValue &&
      docgenValue &&
      stateValue === this.getDefaultValue(docgenValue)
    );
  }

  getDefaultValue(docgen) {
    const { defaultValue } = docgen || {};
    return defaultValue
      ? cleanValue(
          typeof defaultValue === 'object' ? defaultValue.value : defaultValue
        )
      : false;
  }

  getPropValue(name, component) {
    const docgen = getDocgenProps(component)[name];
    const componentPropValue = component.props[name];
    const defaultValue = this.getDefaultValue(docgen);

    if (componentPropValue) {
      return componentPropValue;
    } else if (defaultValue) {
      return defaultValue;
    }
    return '';
  }

  setDeepState(target, name, value) {
    const id = target.getAttribute('data-component-id');

    this.setState(prevState => {
      const state = prevState;

      if (value === 'null') delete state.liveProps[id][name];

      return {
        liveProps: {
          ...(state.liveProps || {}),
          [id]: {
            ...(state.liveProps[id] || {}),
            ...(value === 'null' ? {} : { [name]: value })
          }
        }
      };
    });
  }

  handleShowCode() {
    this.setState(prevState => ({
      showCode: !prevState.showCode
    }));
  }

  handleShowProps(e, id) {
    this.setState(prevState => ({
      showProps: {
        ...prevState.showProps,
        [id]: !prevState.showProps[id]
      }
    }));
  }

  handleInputChange(type, event) {
    const { target } = event;
    const { name, value } = target;
    let newValue = value;
    if (is(type, 'number')) {
      newValue = 0;
      if (parseInt(value) !== 0) {
        newValue = parseInt(value) || parseFloat(value) || '';
      }
    }
    this.setDeepState(target, name, newValue);
  }

  handleCheckboxChange(event) {
    const { target } = event;
    const { name, checked } = target;
    this.setDeepState(target, name, checked);
  }

  handleSelectChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setDeepState(target, name, value);
  }

  generateLiveProps(component, id = 0, prefix = '') {
    const {
      name: componentName,
      state: componentState
    } = this.getComponentInfo(component, id, prefix);
    const children = (component.props && component.props.children) || [];
    let childrenStates = {};
    if (!this.props.skipChildren && children) {
      const childrenArray = React.Children.toArray(children);

      childrenStates = childrenArray.reduce(
        (acc, child, index) => ({
          ...acc,
          ...this.generateLiveProps(child, index, componentName)
        }),
        {}
      );
    }

    return {
      ...componentState,
      ...childrenStates
    };
  }

  generateShowProps(component, id = 0, prefix = '') {
    const componentName = prefix + getDisplayName(component) + id;
    const componentState = { [componentName]: prefix ? false : true };

    const children = (component.props && component.props.children) || [];
    let childrenStates = {};
    if (!this.props.skipChildren && children) {
      const childrenArray = React.Children.toArray(children);

      childrenStates = childrenArray.reduce(
        (acc, child, index) => ({
          ...acc,
          ...this.generateShowProps(child, index, componentName)
        }),
        {}
      );
    }

    return {
      ...componentState,
      ...childrenStates
    };
  }

  generateDocgenProps(component, id = 0, prefix = '') {
    const {
      name: componentName,
      state: componentState
    } = this.getComponentDocgenProps(component, id, prefix);
    const children = (component.props && component.props.children) || [];
    let childrenStates = {};
    if (!this.props.skipChildren && children) {
      const childrenArray = React.Children.toArray(children);

      childrenStates = childrenArray.reduce(
        (acc, child, index) => ({
          ...acc,
          ...this.generateDocgenProps(child, index, componentName)
        }),
        {}
      );
    }

    return {
      ...componentState,
      ...childrenStates
    };
  }

  renderInput(id, name) {
    let input;
    const props = {
      key: name,
      id: name,
      name,
      'data-component-id': id
    };
    const label = name.replace(/^\w/, m => m.toUpperCase());
    const isDefaultValue = this.isDefaultValue(id, name) && (
      <div style={{ color: 'grey' }}>Default</div>
    );
    const docgenProps = this.docgen.liveProps[id][name];
    const componentPropInfo = this.renderTooltip(docgenProps);
    let inputLabel = (
      <div>
        <label htmlFor={props.id}>{label}</label>
      </div>
    );

    if (docgenProps.type) {
      const type = docgenProps.type.name;

      if (is(type, 'string') || is(type, 'number')) {
        input = (
          <Input
            {...props}
            value={this.state.liveProps[id][name]}
            onChange={e => {
              this.handleInputChange(type, e);
            }}
          />
        );
      } else if (is(type, 'bool')) {
        inputLabel = null;
        input = (
          <label htmlFor={props.id}>
            <Input
              {...props}
              type="checkbox"
              checked={this.state.liveProps[id][name] ? 'checked' : false}
              onChange={this.handleCheckboxChange}
            />
            {label}
          </label>
        );
      } else if (is(type, 'enum')) {
        input = (
          <select
            {...props}
            value={this.state.liveProps[id][name]}
            onChange={this.handleSelectChange}
          >
            <option value="null">None</option>
            {Object.values(docgenProps.type.value).map((option, index) => {
              const optionValue = cleanValue(option.value);
              return (
                <option key={index.toString()} value={optionValue}>
                  {optionValue}
                </option>
              );
            })}
          </select>
        );
      } else {
        const inputValue = this.state.liveProps[id][name];
        inputLabel = (
          <div>
            <label style={{ color: 'grey' }} htmlFor={props.id}>
              {label}
            </label>
          </div>
        );
        input = (
          <textarea
            {...props}
            disabled
            value={
              is(typeof inputValue, 'object')
                ? JSON.stringify(inputValue)
                : inputValue
            }
          />
        );
        // return null;
        /*
        any, array, func, object, node, element, symbol, 
        instanceOf, oneOfType, arrayOf, objectOf, shape

        these types of props cannot be parsed because their value in 
        __docgenInfo defaultValue.value is very complex form but is stored
        as a simple string not a JSON, so its impossible for now to 
        */
      }
    }

    return (
      <Bar key={id + name}>
        <BarItem>
          {inputLabel}
          {input}
          {isDefaultValue}
        </BarItem>
        {componentPropInfo}
      </Bar>
    );
  }

  renderInteractive(component, id = 0, prefix = '') {
    const componentName = prefix + getDisplayName(component) + id;
    const { props } = component;
    const { children } = props || { children: [] };
    const docgenProps = this.docgen.liveProps[componentName];
    const liveProps = this.state.liveProps[componentName];

    return {
      ...(component.type ? component : React.createElement(React.Fragment)),
      props: {
        ...props,
        ...(!this.props.skipChildren
          ? {
              children: React.Children.map(children, (child, index) =>
                this.renderInteractive(child, index, componentName)
              )
            }
          : {}),
        ...Object.keys(liveProps).reduce((acc, curr) => {
          const defaultValue =
            docgenProps[curr].defaultValue &&
            cleanValue(docgenProps[curr].defaultValue.value);
          // default values should not be visible in code example
          return {
            ...acc,
            [curr]:
              defaultValue === liveProps[curr] || liveProps[curr] === ''
                ? undefined
                : liveProps[curr]
          };
        }, {})
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  renderTooltip(prop) {
    return (
      <BarItem>
        <Tooltip dialog={prop.description || 'No valuable description found'}>
          i
        </Tooltip>
      </BarItem>
    );
  }

  render() {
    const componentIds = Object.keys(this.state.liveProps);

    return (
      <StyledInteract>
        <Preview
          code={this.renderInteractive(this.component)}
          codeJSXOptions={{ cleanProps: true, filterProps: ['key'] }}
        >
          <Grid className="mb-large">
            <GridCol
              size={7}
              className="align-items-middle align-items-middle"
              style={{
                borderRight: '1px solid #eaeaea',
                position: 'relative'
              }}
            >
              <StyledSticky>
                <Bar>
                  <BarItem isFilling>
                    <h3 className="h4 text-bold">
                      {getDisplayName(this.component)}
                    </h3>
                  </BarItem>
                  <BarItem>
                    <StyledButton
                      onClick={this.handleShowCode}
                      className={cx({ opened: this.state.showCode })}
                    >
                      {this.state.showCode ? 'Hide code ' : 'Show code '}
                    </StyledButton>
                  </BarItem>
                </Bar>
                <Hidden hide={this.state.showCode}>
                  {this.renderInteractive(this.component)}
                </Hidden>
                <Hidden hide={!this.state.showCode}>
                  <CodeExample
                    codeJSXOptions={{
                      cleanProps: true,
                      filterProps: ['key']
                    }}
                  >
                    {this.renderInteractive(this.component)}
                  </CodeExample>
                </Hidden>
              </StyledSticky>
            </GridCol>
            <GridCol size={5}>
              {componentIds.map((id, compIndex) => {
                const statePropNames = Object.keys(this.docgen.liveProps[id]);
                const propCount = statePropNames.length;
                const deepness = id
                  .replace(/(\w+\d+)*(\w+)\d+$/g, '$1')
                  .replace(/\w+?\d+?/g, '-').length;
                const componentName = id.replace(/(\w+\d+)*(\w+)\d+$/g, '$2');
                return (
                  <div key={id} style={{ marginLeft: `${deepness * 10}px` }}>
                    <StyledButton
                      onClick={e => {
                        this.handleShowProps(e, id);
                      }}
                      className={cx({ opened: this.state.showProps[id] })}
                    >
                      {deepness > 0 && '↳'} {componentName} ({propCount}){' '}
                    </StyledButton>
                    <Hidden hide={!this.state.showProps[id]}>
                      {propCount ? (
                        statePropNames.map(name => {
                          if (
                            this.props.filterProps.find(
                              filtered => filtered === name
                            )
                          ) {
                            return null;
                          }
                          return this.renderInput(id, name);
                        })
                      ) : (
                        <div>
                          There are no props to edit, try another component!
                        </div>
                      )}
                    </Hidden>
                  </div>
                );
              })}
            </GridCol>
          </Grid>
        </Preview>
      </StyledInteract>
    );
  }
}

export default Interact;
